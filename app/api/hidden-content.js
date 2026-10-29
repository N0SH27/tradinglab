import { hasServerConfig, hasValidSession, sendJson } from './_hidden-access.js'

/* 隐藏页正文只从这里发出。不要把私密正文复制进 src，否则会被打进公开静态包。 */
const PRIVATE_CONTENT = {
  kicker: 'TRADINGLABB / PRIVATE STUDY',
  title: ['AFTER', 'HOURS'],
  intro: '这里不发布结论，只保留那些还没有被公开语言接住的观察。',
  notes: [
    {
      index: '01',
      title: '弱信号',
      tag: 'SIGNAL / UNRESOLVED',
      body: '先记录变化，再决定它是否值得成为一个命题。此处是实验页的示例正文，可替换为真正需要保护的私密内容。',
    },
    {
      index: '02',
      title: '反证',
      tag: 'COUNTER / EVIDENCE',
      body: '为每一个看似顺畅的叙事保留一条反向证据。只有验证通过之后，这些文字才会由服务端返回。',
    },
    {
      index: '03',
      title: '留白',
      tag: 'SPACE / PENDING',
      body: '没有新的观察时，保留空白，不用内容填满页面。这里可以继续扩展成你的私人研究、草稿或实验区域。',
    },
  ],
}

export default function handler(req, res) {
  if (!hasServerConfig()) {
    sendJson(res, 503, { error: 'server_not_configured' })
    return
  }
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'method_not_allowed' }, { Allow: 'GET' })
    return
  }
  if (!hasValidSession(req)) {
    sendJson(res, 401, { error: 'unauthorized' })
    return
  }
  sendJson(res, 200, PRIVATE_CONTENT)
}
