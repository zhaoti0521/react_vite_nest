import { useState } from "react";
import axios from "axios";

import Scheduler from "@/config/schedulers";

export default function FileUpload() {
  const schedulers = new Scheduler(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  function fileSlice(file: File): File[] {
    const singleSize: number = 1024 * 1024;
    let startPos: number = 0;
    const sliceArr: File[] = [];
    while (startPos < file.size) {
      const sliceFile: Blob = file.slice(startPos, startPos + singleSize);
      sliceArr.push(sliceFile as File);
      startPos += singleSize;
    }
    return sliceArr;
  }
  // 计算文件的 SHA-256 哈希值，用于唯一标识文件。
  // 这样在断点续传时，通过文件哈希值就能准确识别是哪个文件，判断哪些切片已经上传。
  async function calculateFileHash(file: File): Promise<string> {
    // 创建一个 FileReader 实例，用于读取文件内容
    const reader = new FileReader();
    // 以 ArrayBuffer 格式读取文件
    reader.readAsArrayBuffer(file);
    return new Promise((resolve) => {
      // 当文件读取完成时触发该回调函数
      reader.onload = async () => {
        // 获取读取到的文件内容，类型为 ArrayBuffer
        const buffer = reader.result as ArrayBuffer;
        // 使用 Web Crypto API 计算文件内容的 SHA-256 哈希值，返回一个新的 ArrayBuffer
        const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
        // 将哈希值的 ArrayBuffer 转换为 Uint8Array 数组
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        // 将 Uint8Array 数组中的每个元素转换为十六进制字符串，并拼接成一个完整的哈希字符串
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
        // 解析 Promise，返回最终的哈希字符串
        resolve(hashHex);
      };
    });
  }
  async function fileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      console.log(e.target.files, "target");
      const file = e.target.files[0];
      // 调用 calculateFileHash 函数计算文件的哈希值
      const fileHash = await calculateFileHash(file);
      console.log(fileHash, "fileHash");
      // 向后端发送请求，检查该文件已经上传的切片
      // 通过 GET 请求调用后端的 /check-chunks 接口，并传递文件哈希值作为参数
      const { uploadedChunks } = await axios
        .get("http://localhost:3000/check-chunks", {
          params: { fileHash },
        })
        .then((res) => res.data);
      const fileSliceArr = fileSlice(file);
      const totalChunks = fileSliceArr.length;
      // 计算已经上传的切片占比
      const initialProgress = (uploadedChunks.length / totalChunks) * 100;
      setUploadProgress(initialProgress);
      // const uploadedChunkCount = uploadedChunks.length;
      const fetchlist: Promise<unknown>[] = [];
      fileSliceArr.forEach((fileFragments, index) => {
        // 检查当前切片的索引是否在已上传的切片列表中
        if (uploadedChunks.includes(index)) {
          // 如果已上传，则打印日志并跳过该切片的上传
          console.log(`切片 ${index} 已上传，跳过`);
          return;
        }
        const formData = new FormData();
        console.log(fileFragments, index, "每个切片");
        formData.set("file", fileFragments);
        formData.set("name", file.name);
        formData.set("index", index + "");
        // 将文件哈希值添加到 FormData 中，以便后端识别文件
        formData.set("fileHash", fileHash);
        async function task(): Promise<void> {
          await axios({
            method: "POST",
            url: "http://localhost:3000/upload",
            data: formData,
            // 监听上传进度事件
            onUploadProgress: (progressEvent) => {
              const currentChunkProgress = (progressEvent.loaded / progressEvent.total / totalChunks) * 100;
              // 计算整体进度
              const overallProgress =
                initialProgress +
                (uploadedChunks.length < index ? ((index - uploadedChunks.length) / totalChunks) * 100 : 0) +
                currentChunkProgress;
              setUploadProgress(overallProgress);
            },
          }).catch((e) => {
            console.log(e);
          });
        }
        const addTask = () => {
          const delayTask: () => Promise<void> = () => {
            return new Promise((resolve) => {
              return task().then(() => {
                resolve();
              });
            });
          };
          fetchlist.push(schedulers.add(delayTask));
        };
        addTask();
      });
      Promise.all(fetchlist).then(() => {
        axios({
          method: "POST",
          url: "http://localhost:3000/steam_merge",
          data: {
            name: file.name,
            // 在合并文件的请求中，传递文件哈希值，方便后端准确合并该文件的切片
            fileHash,
          },
        });
      });
      // console.log(fileSliceArr, "fileSliceArr");
    }
  }
  function fileDownload() {
    const singleSize = 1024 * 1024;
    axios({
      method: "GET",
      url: "http://localhost:3000/file_size",
    }).then((res) => {
      if (res.data) {
        const fileSize = res.data.size;
        const fileName = res.data.fileName;
        let startPos = 0;
        const fetchList: Promise<Blob>[] = [];
        while (startPos < fileSize) {
          fetchList.push(
            new Promise((resolve) => {
              axios({
                method: "GET",
                url: "http://localhost:3000/file_chunk",
                params: {
                  start: startPos,
                  end: startPos + singleSize,
                },
                responseType: "blob",
              }).then((res) => {
                resolve(res.data);
              });
            }),
          );
          startPos = startPos + singleSize + 1;
        }
        Promise.all(fetchList).then((res) => {
          const mergedBlob = new Blob(res);
          const downloadUrl = window.URL.createObjectURL(mergedBlob);
          const link = document.createElement("a");
          link.href = downloadUrl;
          link.setAttribute("download", fileName);
          link.click();
          window.URL.revokeObjectURL(downloadUrl);
        });
      }
    });
  }
  const defunction = debounce(() => {
    console.log("执行的函数");
  }, 600);

  function debounce<F extends (...args: unknown[]) => unknown>(
    fn: F,
    wait: number,
  ): (...args: Parameters<F>) => ReturnType<F> {
    let timer: ReturnType<typeof setTimeout> | null = null;
    return function (this: ThisParameterType<F>, ...args: Parameters<F>): ReturnType<F> {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      timer = setTimeout(() => {
        fn.apply(this, args);
      }, wait);
      // 由于防抖函数中 fn 是异步执行的，这里暂时返回 undefined
      return undefined as ReturnType<F>;
    };
  }
  const handleLRu = () => {
    const map: Map<string, number> = new Map();
    map.set("a", 1);
    map.set("b", 2);
    console.log(map);
    map.delete("a");
    console.log(map);
    map.set("a", 1);
    console.log(map);
  };
  return (
    <div>
      <input type="file" className="upload-input" onChange={(e) => fileChange(e)} />
      <p>上传进度：{uploadProgress}%</p>
      <progress value={uploadProgress} max="100"></progress>
      <button onClick={fileDownload}>下载</button>
      <button onClick={defunction}>防抖</button>
      <button onClick={handleLRu}>LRU</button>
    </div>
  );
}
