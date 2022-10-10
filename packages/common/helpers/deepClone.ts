export const deepClone = (_: object) => {
  return JSON.parse(JSON.stringify(_))
}
