/* InkTransition 挂载后在此注册引擎，供 SwipeBack 等触发「收束」过渡 */
import type { InkEngine } from './engine'

export const inkBus: { engine: import('./engine').InkEngine | null } = { engine: null }

export type { InkEngine }
