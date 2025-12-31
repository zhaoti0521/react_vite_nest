import { sm2, sm4 } from "sm-crypto";

const PUBLIC_KEY =
  "048e8a2d8f872b0f22e8a0e5e8f7a6d5c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0";
export const cryptoUtils = {
  // 生成随机SM4密钥
  generSm4Key(): string {
    return Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0"),
    ).join("");
  },
  // sm2加密
  sm2Encrypt(data: string, publicKey: string = PUBLIC_KEY): string {
    return sm2.doEncrypt(data, publicKey);
  },
  // SM4加密
  sm4Encrypt(data: any, key: string): string {
    const dataStr = typeof data === "string" ? data : JSON.stringify(data);
    return sm4.encrypt(dataStr, key);
  },
  // SM4解密
  sm4Decrypt(encrypted: string, key: string): any {
    const decrypted = sm4.decrypt(encrypted, key);
    try {
      return JSON.parse(decrypted);
    } catch {
      return decrypted;
    }
  },
  // 混合加密
  hybridEncrypt(data: any) {
    const sm4Key = this.generSm4Key();
    return {
      encryptedData: this.sm4Encrypt(data, sm4Key),
      encryptedKey: this.sm2Encrypt(sm4Key),
    };
  },
};
