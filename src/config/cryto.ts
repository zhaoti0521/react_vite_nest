import CryptoJS from "crypto-js";
// 密钥和 IV（初始化向量）
export const key = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16 字节密钥
export const iv = CryptoJS.enc.Utf8.parse("1234567890123456"); // 16 字节 IV

export function encryptAES(word: string): string {
  const encrypted = CryptoJS.AES.encrypt(word, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC, // 加密模式
    padding: CryptoJS.pad.Pkcs7, // 填充方式
  });
  return encrypted.toString(); // 返回 Base64 格式的密文
}
