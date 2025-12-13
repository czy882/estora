import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 中文注释：尊重用户的“减少动画”系统偏好（无障碍）
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // 中文注释：路由变化时滚动到顶部
    // 使用 requestAnimationFrame，避免在 React 提交阶段同步触发
    requestAnimationFrame(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
      });
    });
  }, [pathname]);

  return null; // 该组件不渲染任何可见内容
};

export default ScrollToTop;