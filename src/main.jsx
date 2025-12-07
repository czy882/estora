import React from 'react'
import ReactDOM from 'react-dom/client'
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client'
import App from './App.jsx'
import './index.css'

// 1. 配置 WordPress API 连接
// createHttpLink 负责建立网络请求
const httpLink = createHttpLink({
  uri: 'https://admin.estora.au/graphql', // 你的真实 WordPress API
  credentials: 'include', // 关键：允许携带 Cookie (为了购物车和登录)
});

// 2. 创建 Apollo 客户端
const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(), // 内存缓存，提升网页加载速度
});

// 3. 用 ApolloProvider 包裹整个应用
// 这样 App 里的任何组件（Home, Shop, Cart）都能直接获取 WordPress 数据
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
)