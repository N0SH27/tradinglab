/* Google Analytics 手动页面浏览上报（hash 路由 SPA）
 * gtag 本体在 index.html 以 async 外链加载（无 npm 依赖），
 * send_page_view 已关闭，统一由此按路由变化上报。 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export function trackPageView(path: string) {
  if (typeof window.gtag !== 'function') return // 脚本被拦截或未加载时静默跳过
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}
