// Recursion code
type Flat = (arr: Array<any>, depth?:number) => Array<any>

const flat: Flat = function (arr, depth = 1) {
    const answer = []

    for (let i=0; i < arr.length; i++) {
      if (!(i in arr)) continue
        if (Array.isArray(arr[i])) {
          answer.push(...solve(arr[i] , depth, 1))
        }
       else {
        answer.push(arr[i])
       }
    }
  return answer
    
}

function solve (value, depth, curr) : any[] {
  if (curr > depth) {
    return value
  }
  const ans = []

  if (Array.isArray(value)) {
    for (let i=0; i < value.length; i++) {
       if (!(i in value)) continue
      if (Array.isArray(value[i]) && curr + 1 <= depth) {
          ans.push(...solve(value[i] , depth, curr + 1))
        }
       else {
        ans.push(value[i])
       }
    }
  } else {
    ans.push(value)
  }

  return ans
}

// Iterative code
const flat: Flat = function (arr, depth = 1) {
  const stack = arr.filter((_, index) => index in arr).map((item) => [item , depth])
  const ans = []

  while(stack.length > 0) {
    const [item, dep] = stack.pop()

    if (Array.isArray(item) && dep > 0) {
      stack.push(...item.filter((_, index) => index in item).map((item) => [item, dep - 1]))
    } else {
      ans.push(item)
    }
  }
  return ans.reverse()
}
const arr: any[] = [1,2]
arr[4] = undefined
arr[5] = [3,4]
arr[5][4] = [5,6,[7,8,[9,10]]]

console.log(flat(arr, 1))
