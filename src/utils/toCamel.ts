type AnyObject = { [key: string]: string | number | boolean | Date}

function toCamelCase(str: string): string {
  return str.split('_').map((part, index) => {
    if (index === 0) return part
    return part.charAt(0).toUpperCase() + part.slice(1)
  }).join('')
}

export function toCamelArr(arr: AnyObject[]): AnyObject[] {
  let res: AnyObject[] = []

  for (const item of arr) {
    let temp: AnyObject = {}
    for (const key of Object.keys(item)) {
      temp[toCamelCase(key)] = item[key]
    }
    res.push(temp)
  }

  return res
}
