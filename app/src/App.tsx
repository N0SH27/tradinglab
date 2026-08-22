import React, { Suspense, lazy, useEffect } from 'react'
import Layout from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { useHashRoute } from './hooks/useHashRoute'
import { trackPageView } from './analytics'
import { InkTransition } from './ink/InkTransition'
import { InkCursor } from './ink/InkCursor'
import { SwipeBack } from './ink/SwipeBack'

/* 按路由分包：首屏只下载当前页的代码，其余页面首次进入时静默加载 */
const Home = lazy(() => import('./pages/Home'))
const Manifesto = lazy(() => import('./pages/Manifesto'))
const System = lazy(() => import('./pages/System'))
const Thesis = lazy(() => import('./pages/Thesis'))
const Essays = lazy(() => import('./pages/Essays'))
const Essay = lazy(() => import('./pages/Essay'))
const IndustryMap = lazy(() => import('./pages/IndustryMap'))
const Cycle = lazy(() => import('./pages/Cycle'))
const Dimensions = lazy(() => import('./pages/Dimensions'))
const Wuwei = lazy(() => import('./pages/Wuwei'))
const Framework = lazy(() => import('./pages/Framework'))
const Journal = lazy(() => import('./pages/Journal'))

function route(path: string): React.ReactNode {
  if (path.startsWith('/essays/')) return <Essay id={path.replace('/essays/', '')} />
  switch (path) {
    case '/manifesto': return <Manifesto />
    case '/system': return <System />
    case '/thesis': return <Thesis />
    case '/essays': return <Essays />
    case '/map': return <IndustryMap />
    case '/cycle': return <Cycle />
    case '/dimensions': return <Dimensions />
    case '/wuwei': return <Wuwei />
    case '/framework': return <Framework />
    case '/journal': return <Journal />
    default: return <Home />
  }
}

export default function App() {
  const path = useHashRoute()
  useEffect(() => { trackPageView(path) }, [path])
  return (
    <>
      <Layout path={path}>
        <ErrorBoundary key={path}>
          <Suspense fallback={null}>{route(path)}</Suspense>
        </ErrorBoundary>
      </Layout>
      <InkTransition />
      <InkCursor />
      <SwipeBack />
    </>
  )
}
