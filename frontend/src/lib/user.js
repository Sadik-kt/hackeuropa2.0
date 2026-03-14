export const getAnonymousId = () => {
  let id = localStorage.getItem('anonsentra_user_id')
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36)
    localStorage.setItem('anonsentra_user_id', id)
  }
  return id
}
