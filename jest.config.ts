export default {
  testEnvironment: "jsdom", // 模拟浏览器环境
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"], // 引入 jest-dom 的扩展
};
