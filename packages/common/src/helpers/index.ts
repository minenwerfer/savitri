/**
 * @exports @function
 * Takes a multi depth object and flattens it.
 */
export function flatten(obj: any = {}, acc?: string, res: any = {}): any {
  if( Array.isArray(obj) ) {
    return obj.map((e) => flatten(e))
  }

  Object.entries(obj).forEach(([key, value]: [string, any]) => {
    const flat = acc ? `${acc}.${key}` : key;
    if( typeof value === 'object' && !Array.isArray(value) ) {
      return flatten(value, flat, res)
    }
    res[flat] = value;
  })

  return res
}

/**
 * @exports @function
 * Transforms Object.entries() return value back into an object.
 */
export function fromEntries(entries: any[]): any {
  return entries
  .reduce((a, [key, value]: [string, any]) => ({ ...a, [key]: value }), {})
}

/**
 * @see https://www.w3resource.com/javascript-exercises/javascript-math-exercise-21.php
 */
export function integerToRoman(num: number) {
  const digits = String(num).split('')
  const key = [
    '', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM',
    '', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC',
    '', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'
  ]

  let i = 3, roman_num = ''
  while( i-- ) {
    roman_num = (key[+(digits.pop()||'0') + (i * 10)] || '') + roman_num
  }

  return Array(+digits.join('') + 1).join('M') + roman_num
}
