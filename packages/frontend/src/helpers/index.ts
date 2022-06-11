export const copyToClipboard = (text: string) => {
  const textarea = document.createElement('textarea')
  textarea.value = text

  textarea.style.top = '0'
  textarea.style.left = '0'
  textarea.style.position = 'fixed'

  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  document.execCommand('copy')
  document.body.removeChild(textarea)
}

export const withLock = async (lockName: string, callback: () => any) => {
  if( !localStorage.getItem(`lock:${lockName}`) ) {
    await callback()
    localStorage.setItem(`lock:${lockName}`, 'true')
  }
}
