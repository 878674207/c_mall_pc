<template>
  <div class="component-upload-image">
    <el-upload :action="uploadImgUrl" list-type="picture-card" :on-success="handleUploadSuccess" :before-upload="handleBeforeUpload" :limit="limit" :on-error="handleUploadError" :on-exceed="handleExceed" ref="imageUpload" :show-file-list="true" :headers="headers" :file-list="uploadList" :class="{ hide: this.uploadList.length >= this.limit }" :disabled="disabled">
      <div :style="imgStyle" class="pr" slot="default">
        <i class="el-icon-plus"></i>
      </div>
      <div slot="file" class="ccc" slot-scope="{file}" v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
        <img :src="file.fileUrl" :alt="file.fileName" :style="imgStyle">
        <span class="el-upload-list__item-actions flex-spc align-c">
          <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span v-if="!disabled" class="el-upload-list__item-delete" style="margin-left:3%" @click="handleDelete(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>

    <!-- 上传提示 -->
    <div class="el-upload__tip" slot="tip" v-if="showTip">
      请上传
      <template v-if="fileSize"> 大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b> </template>
      <template v-if="fileType"> 格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b> </template>
      <template> 数量限制 <b style="color: #f56c6c">{{ limit }}个</b> </template>
      的文件
    </div>

    <el-dialog :visible.sync="dialogVisible" title="预览" width="800" append-to-body>
      <img :src="dialogImageUrl" style="display: block; max-width: 100%; margin: 0 auto" />
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'

export default {
  props: {
    value: [String, Object, Array],
    // 图片数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型, 例如['png', 'jpg', 'jpeg']
    fileType: {
      type: Array,
      default: () => ['png', 'jpg', 'jpeg'],
    },
    // 是否显示提示
    isShowTip: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    imgStyle: {
      type: Object,
      default: () => {
        return {
          width: '146px',
          height: '146px',
        }
      },
    },
  },
  data() {
    return {
      number: 0,
      dialogImageUrl: '',
      dialogVisible: false,
      hideUpload: false,
      baseUrl: process.env.VUE_APP_BASE_API,
      uploadImgUrl: process.env.VUE_APP_BASE_API + '/file/upload', // 上传的图片服务器地址
      headers: {
        Authorization: 'Bearer ' + getToken(),
      },
      loading: false,
      uploadList: [],
      fileList: [],
      upData: {
        file: null,
      },
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          // 首先将值转为数组
          const list = Array.isArray(val) ? val : this.value.split(',')
          // // 然后将数组转为对象数组
          this.uploadList = list.map((item) => {
            if (typeof item === 'string') {
              if (item.indexOf(this.baseUrl) === -1) {
                if (item.indexOf('http') >= -1) {
                  item = {
                    name: item,
                    url: item,
                    fileUrl: item,
                    fileName: item,
                  }
                } else {
                  item = {
                    name: this.baseUrl + item,
                    url: this.baseUrl + item,
                    fileUrl: this.baseUrl + item,
                    fileName: this.baseUrl + item,
                  }
                }
              } else {
                item = { name: item, url: item, fileUrl: item, fileName: item }
              }
            }
            return item
          })
          this.fileList = list.map((item) => {
            if (typeof item === 'string') {
              if (item.indexOf(this.baseUrl) === -1) {
                if (item.indexOf('http') >= -1) {
                  item = { fileName: item, fileUrl: item }
                } else {
                  item = {
                    fileName: this.baseUrl + item,
                    fileUrl: this.baseUrl + item,
                  }
                }
              } else {
                item = { fileName: item, fileUrl: item }
              }
            }
            return item
          })
        } else {
          this.fileList = []
          return []
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    // 是否显示提示
    showTip() {
      return this.isShowTip && (this.fileType || this.fileSize)
    },
  },
  methods: {
    // 上传前loading加载
    handleBeforeUpload(file) {
      this.loading = true
      let isImg = false
      if (this.fileType.length) {
        let fileExtension = ''
        if (file.name.lastIndexOf('.') > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
        }
        isImg = this.fileType.some((type) => {
          if (file.type.indexOf(type) > -1) return true
          if (fileExtension && fileExtension.indexOf(type) > -1) return true
          return false
        })
      } else {
        isImg = file.type.indexOf('image') > -1
      }
      if (!isImg) {
        this.$modal.msgError(
          `文件格式不正确, 请上传${this.fileType.join('/')}图片格式文件!`
        )
        return false
      }
      const isLt2M = file.size / 1024 > 100
      if (isLt2M) {
        this.number++
        return this.compressImgSize(file)
      }
      // if (this.fileSize) {
      //   const isLt = file.size / 1024 / 1024 < this.fileSize;
      //   if (!isLt) {
      //     this.$modal.msgError(`上传头像图片大小不能超过 ${this.fileSize} MB!`);
      //     return false;
      //   }
      // }
    },
    compressImgSize(file) {
      // 压缩图片
      return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = URL.createObjectURL(file)
        image.onload = (e) => {
          // onload 才能获取到图片真实的宽高
          if (image.width > 0 && image.height > 0) {
            const oldScale = Number((image.width / image.height).toFixed(2))
            let maxWidth = 860,
              maxHeight = 860 // 定义缩放后的最大宽高
            let targetWidth = image.width,
              targetHeight = image.height // 图片缩放后的真实宽高, 默认为图片的原始尺寸
            if (targetWidth > maxWidth) {
              // 目标宽度大于最大宽度
              targetWidth = maxWidth
              targetHeight = targetWidth / oldScale
            }
            //缩放后高度仍然大于最大高度继续按比例缩小
            if (targetHeight > maxHeight) {
              targetHeight = maxHeight
              targetWidth = targetHeight * oldScale
            }
            const canvas = document.createElement('canvas') // 创建一个canvas节点
            const context = canvas.getContext('2d')
            canvas.width = targetWidth // 设置canvas的宽高
            canvas.height = targetHeight
            context.drawImage(image, 0, 0, targetWidth, targetHeight) // 将图片绘制到canvas内部
            const imageBase64 = canvas.toDataURL(file.type, 1) //canvas导出成为base64
            resolve(this.base64ToFile(imageBase64, 'file'))
          }
        }
      })
    },

    // base64图片转file的方法（base64图片, 设置生成file的文件名）
    base64ToFile(base64, fileName) {
      // 将base64按照 , 进行分割 将前缀  与后续内容分隔开
      let data = base64.split(',')
      // 利用正则表达式 从前缀中获取图片的类型信息（image/png、image/jpeg、image/webp等）
      let type = data[0].match(/:(.*?);/)[1]
      // 从图片的类型信息中 获取具体的文件格式后缀（png、jpeg、webp）
      let suffix = type.split('/')[1]
      // 使用atob()对base64数据进行解码  结果是一个文件数据流 以字符串的格式输出
      const bstr = window.atob(data[1])
      // 获取解码结果字符串的长度
      let n = bstr.length
      // 根据解码结果字符串的长度创建一个等长的整形数字数组
      // 但在创建时 所有元素初始值都为 0
      const u8arr = new Uint8Array(n)
      // 将整形数组的每个元素填充为解码结果字符串对应位置字符的UTF-16 编码单元
      while (n--) {
        // charCodeAt()：获取给定索引处字符对应的 UTF-16 代码单元
        u8arr[n] = bstr.charCodeAt(n)
      }
      // 利用构造函数创建File文件对象
      // new File(bits, name, options)
      const file = new File([u8arr], `${fileName}.${suffix}`, {
        type: type,
      })
      // 将File文件对象返回给方法的调用者
      return file
    },
    // 文件个数超出
    handleExceed() {
      this.$modal.msgError(`上传文件数量不能超过 ${this.limit} 个!`)
    },
    // 上传成功回调
    handleUploadSuccess(res, file) {
      if (res.code === 200) {
        this.uploadList.push({ ...file, fileUrl: res.data.fileUrl })
        this.fileList.push({
          fileName: res.data.fileName,
          fileUrl: res.data.fileUrl,
        })
        this.loading = false
        this.$modal.msgSuccess(`上传成功`)
        this.$emit('input', this.fileList)
        // this.uploadedSuccessfully();
      }
      // else {
      //   this.number--;
      //   this.$modal.closeLoading();
      //   this.$modal.msgError(res.msg);
      //   this.$refs.imageUpload.handleRemove(file);
      //   this.uploadedSuccessfully();
      // }
    },
    // 删除图片
    handleDelete(file) {
      console.log(file)
      const findex = this.fileList.map((f) => f.fileName).indexOf(file.fileName)
      if (findex > -1) {
        this.uploadList.splice(findex, 1)
        this.fileList.splice(findex, 1)
        this.$emit('input', this.fileList)
      }
    },
    // 上传失败
    handleUploadError() {
      this.$modal.msgError('上传图片失败，请重试')
      this.$modal.closeLoading()
    },
    // 上传结束处理
    // uploadedSuccessfully() {
    //   if (this.number > 0 && this.uploadList.length === this.number) {
    //     this.uploadList = [];
    //     this.number = 0;
    //     console.log(this.fileList)
    //   }
    // },
    // 预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.fileUrl
      this.dialogVisible = true
    },
    // 对象转成指定字符串分隔
    listToString(list, separator) {
      let strs = ''
      separator = separator || ','
      for (let i in list) {
        if (list[i].url) {
          strs += list[i].url.replace(this.baseUrl, '') + separator
        }
      }
      return strs != '' ? strs.substr(0, strs.length - 1) : ''
    },
  },
}
</script>
<style scoped lang="scss">
// .el-upload--picture-card 控制加号部分
::v-deep.hide .el-upload--picture-card {
  display: none;
}

// 去掉动画效果
::v-deep .el-list-enter-active,
::v-deep .el-list-leave-active {
  transition: all 0s;
}

::v-deep .el-list-enter,
.el-list-leave-active {
  opacity: 0;
  transform: translateY(0);
}
::v-deep .el-upload--picture-card {
  width: inherit;
  height: inherit;
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
::v-deep .el-upload-list__item {
  width: inherit;
  height: inherit;
  line-height: 0;
}
.pr {
  position: relative;
}
.el-icon-plus {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-top: -14px;
  margin-left: -14px;
}
</style>

