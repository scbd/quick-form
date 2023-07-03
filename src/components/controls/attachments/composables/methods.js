function isDataUrl(url){
  if(url.startsWith('blob:')) return true

  return false
}