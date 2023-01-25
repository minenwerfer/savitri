import { reactive } from 'vue'

type Result = Record<string, any> & {
  _id: string
  _picture?: any
}

export const results = reactive<{ items: Array<Result> }>({
  items: []
})
