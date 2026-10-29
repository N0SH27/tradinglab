export const HIDDEN_ROUTE = '/after-hours'
const ENTRY_KEY = 'tradinglab:after-hours-entry'
let entryGranted = false

export function hasHiddenEntry() {
  if (entryGranted) return true
  try {
    return window.sessionStorage.getItem(ENTRY_KEY) === 'granted'
  } catch {
    return false
  }
}

export function grantHiddenEntry() {
  entryGranted = true
  try {
    window.sessionStorage.setItem(ENTRY_KEY, 'granted')
  } catch {
    /* 内存凭证仍可支持当前页跳转。 */
  }
}

export function clearHiddenEntry() {
  entryGranted = false
  try {
    window.sessionStorage.removeItem(ENTRY_KEY)
  } catch {
    /* 无 sessionStorage 时，内存凭证已在上方清除。 */
  }
}
