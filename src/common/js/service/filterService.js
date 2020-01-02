/**
 * Author: $[USERNAME]
 * Created by $[USER] on $[DATE]
 */
const sliceFilter = function (myInput, len) {
  let result = ''
  if (myInput) {
    if (myInput.length) {
      result = myInput.length > len ? myInput.slice(0, len) + '...' : myInput
    } else {
      result = myInput
    }
  }
  return result
}

const replacePFilter = function (txt, len) {
  if (txt) {
    txt = txt.replace(/<p>|<\/p>/g, '')
    txt = txt.length > len ? txt.slice(0, len) + '...' : txt
  }
  return txt
}

export default {
  sliceFilter,
  replacePFilter
}
