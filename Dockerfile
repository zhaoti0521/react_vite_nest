# 使用官方 Node.js 作为构建环境
FROM node:18 AS build
# 设置工作目录
WORKDIR /app
# 复制 package.json 和 package-lock.json
COPY package*.json ./
# 安装依赖
RUN npm install --legacy-peer-deps
# 复制全部代码
COPY . .
# 构建 React 项目
RUN npm run build
# 使用 Nginx 作为生产环境的 Web 服务器
FROM nginx:alpline
# 复制编译后的文件到 Nginx 的 HTML 目录
COPY --from=build /app/build /user/share/nginx/HTML
# 复制自定义的 Nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf
# 暴露端口
EXPOSE 80
# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]