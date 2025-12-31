import React, { useEffect, useState } from "react";
import { Button, Card, Divider, Form, Input, message } from "antd";
import axios from "axios";
import { sm2, sm4 } from "sm-crypto";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
// 工具类
let PUBLIC_KEY = "";

const fetchPublicKey = async (): Promise<string> => {
  if (PUBLIC_KEY) return PUBLIC_KEY;
  try {
    const response = await axios.get(`${API_BASE_URL}/public-key`);
    PUBLIC_KEY = response.data.publicKey;
    return PUBLIC_KEY;
  } catch (error) {
    console.error("获取公钥失败:", error);
    throw new Error("无法获取服务器公钥");
  }
};

const cryptoUtils = {
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
    return sm2.doEncrypt(data, publicKey, 0);
  },
  // SM4加密
  sm4Encrypt(data: any, key: string): string {
    if (key.length !== 32) throw new Error("SM4 key must be 32 hex chars");
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

// // 加密并发送数据
// export const sendEncryptedData = async (payload: any) => {
//   try {
//     // 1. 获取服务器公钥
//     const publicKey = await fetchPublicKey();

//     // 2. 生成SM4密钥并加密数据
//     const sm4Key = cryptoUtils.generSm4Key();
//     const encryptedData = sm4.encrypt(JSON.stringify(payload), sm4Key);
//     const encryptedKey = sm2.doEncrypt(sm4Key, publicKey);

//     // 3. 发送加密数据
//     const response = await axios.post(`${API_BASE_URL}/secure-data`, {
//       encryptedData,
//       encryptedKey
//     });

//     // 4. 解密响应（如果响应也是加密的）
//     if (response.data.encryptedData) {
//       const decrypted = sm4.decrypt(response.data.encryptedData, sm4Key);
//       return JSON.parse(decrypted);
//     }

//     return response.data;
//   } catch (error) {
//     console.error('加密请求失败:', error);
//     throw error;
//   }
// };
const HybridEncryptionDemo: React.FC = () => {
  const [form] = Form.useForm();
  const [encryptedResult, setEncryptedResult] = useState<any>(null);
  const [decryptedData, setDecryptedData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [sm4Key, setSm4Key] = useState<string | null>(null);
  // 加密处理
  const handleEncrypt = async () => {
    setLoading(true);
    try {
      const publicKey = await fetchPublicKey();
      const values = form.getFieldsValue();
      const plaintext = values.data;
      const password = values.password;
      if (!plaintext || !password) {
        message.warning("请输入要加密的数据和密码");
        setLoading(false);
        return;
      }
      // 执行混合加密
      const sm4Key = cryptoUtils.generSm4Key();
      const encryptedData = cryptoUtils.sm4Encrypt(JSON.stringify(plaintext), sm4Key);
      const encryptedKey = cryptoUtils.sm2Encrypt(sm4Key, publicKey);
      const response = await axios.post(`${API_BASE_URL}/secure-data`, {
        encryptedData,
        encryptedKey,
      });
      setEncryptedResult(response.data.encryptedData);
      setSm4Key(sm4Key);
      console.log(response.data.encryptedData, "是否成功");
      message.success("加密成功！");
    } catch (error) {
      message.error(`加密失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // 解密处理
  const handleDecrypt = () => {
    setLoading(true);
    try {
      const values = form.getFieldsValue();
      const password = values.password;

      if (!encryptedResult || !password) {
        message.warning("请先加密数据并输入密码");
        setLoading(false);
        return;
      }

      // 这里需要私钥解密，实际应用中应该由后端处理
      // 注意：前端不应该存储或处理私钥，这里仅作演示
      message.warning("前端解密需要私钥，此操作仅作演示，实际应由后端处理");

      // 模拟解密过程（实际应用中应调用后端API）
      // 1. 使用SM2私钥解密SM4密钥（需要私钥）
      // 2. 使用SM4密钥解密数据

      // 这里只是展示解密后的数据结构
      if (!sm4Key) {
        message.error("未找到 SM4 密钥，无法解密");
        setLoading(false);
        return;
      }
      const decrypted = cryptoUtils.sm4Decrypt(encryptedResult, sm4Key);
      setDecryptedData(decrypted);
      message.success("模拟解密成功！实际应用中应调用后端API完成解密");
    } catch (error) {
      message.error(`解密失败: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <Card title="加密/解密表单" style={{ marginBottom: "20px" }}>
        <Form form={form} layout="vertical">
          <Form.Item
            label="要加密的数据"
            name="data"
            rules={[{ required: true, message: "请输入要加密的数据" }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="请输入要加密的明文数据"
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>

          <Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
            <Button type="primary" onClick={handleEncrypt} loading={loading}>
              加密数据
            </Button>

            <Button type="primary" onClick={handleDecrypt} loading={loading} disabled={!encryptedResult}>
              解密数据
            </Button>
          </div>
        </Form>
      </Card>

      <Divider />

      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        <Card title="加密结果" style={{ flex: 1, minWidth: "300px" }}>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "4px",
              maxHeight: "300px",
              overflow: "auto",
              fontFamily: "monospace",
            }}
          >
            {encryptedResult ? JSON.stringify(encryptedResult, null, 2) : "加密结果将显示在这里..."}
          </pre>
        </Card>

        <Card title="解密结果" style={{ flex: 1, minWidth: "300px" }}>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "12px",
              borderRadius: "4px",
              maxHeight: "300px",
              overflow: "auto",
              fontFamily: "monospace",
            }}
          >
            {decryptedData ? JSON.stringify(decryptedData, null, 2) : "解密结果将显示在这里..."}
          </pre>
        </Card>
      </div>
    </div>
  );
};

export default HybridEncryptionDemo;
