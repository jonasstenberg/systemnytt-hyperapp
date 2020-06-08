/**
 * @param {String} param
 * @return {String}
 */
export default (param) => {
  const query = window.location.search.substring(1)
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const separator = vars[i].indexOf('=')
    const key = vars[i].slice(0, separator)
    const val = vars[i].slice(separator + 1)
    if (decodeURIComponent(key) === param) {
      return decodeURIComponent(val.replace(/\+/g, '%20'))
    }
  }
  return null
}
