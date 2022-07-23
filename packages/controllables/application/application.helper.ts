export const replacePlaceholders = (input:string, map:any) => {
  return Object.entries(map).reduce((a: string, [key, value]: [string, any]) => {
    return a.replace(new RegExp(`{{ ${key} }}`, 'g'), value)

  }, input)
}
