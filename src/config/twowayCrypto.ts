import { sm2, sm4 } from "sm-crypto";

const frontEndPrvideKey = "a210e83b3d637b9c2bf8051983006ada1a7ed962095e371f5d670fbe3d268ff8";
// 配置密钥（实际项目应从接口动态获取）
const CRYPTO_CONFIG = {
  // 后端公钥（用于前端加密）
  // serverPublicKey: backEndPublicKey,
  // 前端私钥（用于解密后端数据）
  clientPrivateKey: frontEndPrvideKey,
};

// SM2加密（用于加密传输数据）
export const encryptWithSM2 = (data: any, key: any) => {
  return sm2.doEncrypt(JSON.stringify(data), key, 0);
};

// SM4加密（可选，用于本地存储加密）
export const encryptWithSM4 = (data: any, key: any) => {
  return sm4.encrypt(JSON.stringify(data), key);
};

// SM2解密（用于解密后端响应）
export const decryptWithSM2 = (encryptedData: any) => {
  try {
    const decrypted = sm2.doDecrypt(encryptedData, CRYPTO_CONFIG.clientPrivateKey, 0);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error("解密失败:", e);
    return null;
  }
};
