import React, { useState } from "react";
import { Button, Card, Form, Input, message, Table } from "antd";
import { encryptedPost, fetchPublicKey } from "../api/cryptoReq";

const CryptoForm = () => {
  const [form] = Form.useForm();
  const [encryptedData, setEncryptedData] = useState("");
  const [decryptedData, setDecryptedData] = useState(null);

  const onFinish = async (values: any) => {
    try {
      // 显示加密前的数据
      setEncryptedData(JSON.stringify(values, null, 2));
      const result = await fetchPublicKey();
      console.log(result.data.ownPublicKey, "公钥");
      // 发送加密请求
      const response = await encryptedPost("/process-data", values, result.data.ownPublicKey);

      // 显示解密后的响应
      setDecryptedData(response);
      message.success("加解密成功！");
    } catch (error) {
      message.error("操作失败: " + error.message);
    }
  };

  const columns = [
    { title: "字段", dataIndex: "key", key: "key" },
    { title: "值", dataIndex: "value", key: "value" },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="数据加解密演示" bordered={false}>
        <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 600 }}>
          <Form.Item label="银行卡号" name="bankCard" rules={[{ required: true, message: "请输入银行卡号" }]}>
            <Input placeholder="6225880123456789" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              加密提交并解密响应
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 24 }}>
          <Card title="加密后的数据" style={{ marginBottom: 16 }}>
            <pre>{encryptedData || "暂无数据"}</pre>
          </Card>

          {decryptedData && <Card title="解密后的响应数据">{decryptedData}</Card>}
        </div>
      </Card>
    </div>
  );
};

export default CryptoForm;
