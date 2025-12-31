import axios from "axios";
import { decryptWithSM2, encryptWithSM2 } from "../config/twowayCrypto";

const api = axios.create({
  baseURL: "http://localhost:3000",
});

// 加密请求
export const encryptedPost = async (url: any, data: any, key: any) => {
  const encryptedData = encryptWithSM2(data, key);
  const response = await api.post(url, { encryptedData });
  return decryptWithSM2(response.data.receivedData);
};

// 获取公钥（实际项目使用）
export const fetchPublicKey = async () => {
  return api.get("/own-public-key");
};
