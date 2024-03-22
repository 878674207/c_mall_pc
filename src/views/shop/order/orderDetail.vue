<template>
    <div class="app-container">
        <div style=" display: flex; flex-direction: column; justify-content: center; padding: 100px; ">
            <el-steps :space="200" :active="active" finish-status="success">
                <el-step title="订单创建" :description=description1></el-step>
                <el-step title="支付订单" :description=description2></el-step>
                <el-step title="平台发货" :description=description3></el-step>
                <el-step title="确认收货" :description=description4></el-step>
                <el-step title="完成评价" :description=description5></el-step>
            </el-steps>
            <!-- 第1个表格 -->
            <p style="font-size: 23px;font-weight: 700;">基本信息</p>
            <el-table :data="orderAddress" style="width: 100% ;">
                <el-table-column label="订单编号" prop="orderNo" width="320px">
                </el-table-column>
                <el-table-column prop="" label="支付方式">
                </el-table-column>
                <el-table-column prop="" label="支付流水号">
                </el-table-column>
                <el-table-column prop="createTime" label="添加时间">
                </el-table-column>
                <el-table-column prop="" label="快递公司">
                </el-table-column>
                <el-table-column prop="" label="快递单号">
                </el-table-column>
            </el-table>
            <!-- 第2个表格 -->
            <p style="font-size: 23px;font-weight: 700;">商品信息</p>
            <el-table :data="tableData.orderItemList" style="width: 100% ;">
                <el-table-column label="商品图片">
                    <template slot-scope="scope">
                        <img :src="scope.row.productPic" style="width: 50px;height: 50px;">
                    </template>
                </el-table-column>
                <el-table-column prop="productName" label="商品名称">
                </el-table-column>
                <el-table-column prop="orderNo" label="属性">
                    <template slot-scope="scope">
                        <span>{{ setRule(scope.row.productAttr) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="货号">
                </el-table-column>
                <el-table-column prop="productPrice" label="单价">
                </el-table-column>
                <el-table-column prop="quantity" label="数量">
                </el-table-column>
                <el-table-column prop="orderNo" label="小计">
                    <template slot-scope="scope">
                        <span>{{ scope.row.productPrice * scope.row.quantity }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 第3个模块 -->
            <div class="infoOrder" style="display: flex; justify-content: space-between; padding-right: 100px;"
                v-if="tableData.orderAddress">
                <span>
                    <p style="font-size: 23px;font-weight: 700;">订单信息</p>
                    <p><span style="color: grey;">订单编号：</span>{{ tableData.orderNo }}</p>
                    <p><span style="color: grey;">快递单号：</span> {{ }}</p>
                    <p><span style="color: grey;">发货时间：</span> {{ tableData.createTime }}</p>
                    <p><span style="color: grey;">发货地址：</span> {{ tableData.orderAddress.province }} {{
                tableData.orderAddress.city }}
                        {{ tableData.orderAddress.region }} </p>
                    <p><span style="color: grey;">买家备注：</span> {{ tableData.remark }}</p>
                </span>
                <span>
                    <p style="font-size: 23px;font-weight: 700;">收货人信息</p>
                    <p><span style="color: grey;">收货人：</span>{{ tableData.orderAddress.receiverName }}</p>
                    <p><span style="color: grey;">收货地址：</span> {{ }}</p>
                    <p><span style="color: grey;">手机号码：</span> {{ tableData.orderAddress.receiverPhone }}</p>
                </span>
                <span>
                    <p style="font-size: 23px;font-weight: 700;">付款信息</p>
                    <p><span style="color: grey;">商品总价：</span> {{ tableData.totalAmount }}</p>
                    <p><span style="color: grey;">运费：</span> {{ }}</p>
                    <p><span style="color: grey;">实付款：</span> {{ tableData.totalAmount }}</p>
                </span>
            </div>
            <!-- 第4个表格 -->
            <p style="font-size: 23px;font-weight: 700;">操作日志</p>
            <el-table style="width: 100% ;" :data="tableData.orderRemarkLogList">
                <el-table-column prop="createBy" label="操作者">
                    <template>
                        <!-- {{ 管理员 }} -->
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="操作时间">
                </el-table-column>
                <el-table-column prop="orderStatus" label="订单状态">
                    <template slot-scope="scope">
                        <span>{{ conversion(scope.row.orderStatus) }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="remark" label="备注">
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { orderDetail } from '@/api/order/order.js'
export default {
    name: 'orderDetail',
    data() {
        return {
            tableData: [],
            orderAddress: [],
            orderOperationTimeList: [],
            active: null,
            description1: null,
            description2: null,
            description3: null,
            description4: null,
            description5: null,
        }
    },
    created() {
        // this.routeId = this.$route.query.id
        // this.orderDetail(this.routeId)
    },
    mounted() {
        this.routeId = this.$route.query.id
        this.orderDetail(this.routeId)
    },
    methods: {
        orderDetail(id) {
            orderDetail(id).then(res => {
                if (res.code == 200) {
                    this.tableData = res.data
                    this.orderAddress = [res.data.orderAddress]
                    this.orderOperationTimeList = res.data.orderOperationTimeList
                    this.orderOperationTimeList.forEach(item => {
                        // 状态切换
                        switch (item.orderNode) {
                            case 'create-order':
                                this.active = 1
                                this.description1 = item.operationTime
                                break
                            case 'payment-order':
                                this.active = 2
                                this.description2 = item.operationTime
                                break
                            case 'delivery-goods':
                                this.active = 3
                                this.description3 = item.operationTime
                                break
                            case 'receive-goods':
                                this.active = 4
                                this.description4 = item.operationTime
                                break
                            case 'comment-order':
                                this.active = 5
                                this.description5 = item.operationTime
                                break
                        }
                    })

                }
            })
        },
        // 订单状态中文转换
        conversion(item) {
            switch (item) {
                case 'waiting_pay':
                    return '待支付'
                case 'waiting_delivery':
                    return '待发货'
                case 'delivered':
                    return '已发货'
                case 'completed':
                    return '已完成'
                case 'closed':
                    return '已关闭'
            }
        },
        // 字段过滤
        setRule(item) {
            let arr = JSON.parse(item)
            let str = ''
            arr.forEach((element) => {
                str += element.key + '【' + element.value + '】'
            })
            return str
        },
    }
}
</script>