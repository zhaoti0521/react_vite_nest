import { useEffect, useState } from "react";

// 定义返回的数据类型
interface FetchDataResponse {
  message: string;
}

const useFetchData = () => {
  const [data, setData] = useState<FetchDataResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 模拟异步请求
        const response: FetchDataResponse = await new Promise((resolve) =>
          // setTimeout(() => resolve({ message: "Data fetched" }), 3000),
          resolve({ message: "Data fetched" }),
        );
        setData(response); // 设置数据
      } catch (error: unknown) {
        // 捕获错误并处理
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // 无论成功或失败，都设置 loading 为 false
      }
    };

    fetchData();
    console.log("这是第几次");
  }, []); // 空依赖数组，表示只在组件挂载时执行

  return { data, loading };
};

export default useFetchData;
