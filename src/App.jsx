import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useRef, useState } from "react";
import useFetchData from "@/components/Custom";
import FileUpload from "@/components/FileLoad";
import Screenshot from "./components/Screenshot";
import Algorithm from "./config/algorithm";
import HybridEncryptionDemo from './components/Crypto';
import TwoCrypto from './components/TwoCrypto';

import Position from "@/components/Postion";
import "./App.css";

// import { encryptAES, iv, key } from "@/config/cryto";
function App() {
  const [count, setCount] = useState(0);
  // useProcessData(data, loading);
  const { data, loading } = useFetchData();
  const countRef = useRef(count);
  const algorithm = new Algorithm();

  const handleClick = () => {
    const newCount = count + 1;
    setCount(newCount); // 异步更新状态
    countRef.current = newCount;
    console.log("最新状态值:", countRef.current); // 注意：这里仍然是旧值
  };
  return (
    <>
    <Router>
      <nav>
        <ul class="nav-ul">
          <li><Link to="/fileUpload">大文件上传</Link></li>
          <li><Link to="/screenshot">算法</Link></li>
          <li><Link to="/position">移动元素</Link></li>
          <li><Link to="/hybridEncryptionDemo">sm2+sm4加解密</Link></li>
          <li><Link to="/twoway">sm2双向加解密</Link></li>
        </ul>
      </nav>
      
      <Routes>
        <Route path="/" element={<Navigate to="/fileUpload" replace />} />
        <Route path="/fileUpload" element={<FileUpload />} />
        <Route path="/screenshot" element={<Screenshot />} />
        <Route path="/position" element={<Position />} />
        <Route path="/hybridEncryptionDemo" element={<HybridEncryptionDemo />} />
        <Route path="/twoway" element={<TwoCrypto />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
