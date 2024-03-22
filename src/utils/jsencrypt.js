import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3fPmp4d3uHoxVH4VtAuWrQ9eBHmFXUuZ2mWJvrrBTtw7uIqSaJ2b4zNRyWW/Sk3tPQvDfmJ5AOCA5xF46vZqnrkK9mSFwx+DYMesPTEDchVuNp1CEDdOxTOolNLVqQn2P+6DufqbnCsj61iZa5OLA4hrIcALvzQThhdcaCrOsgDB/+pCmltiwwkAfKCAZrcA1S1dqggJx6DwkK5+a83zWojkCGkh/Q5sR4llK2Kg3h1UeY3Qeb3KPAtns+Oa/04GN2ZIFzAWtdE6KNwUaPtZcpzrqMDWJUFN1CxBhDnt85gUTou/oHnlAGZ1hnPeAleXW015jPZxoCzAQMs6TyK1LwIDAQAB'

// 加密
export function encrypt(txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对数据进行加密
}

