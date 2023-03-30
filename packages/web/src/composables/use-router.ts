import { useRouter } from 'vue-router'

const useCustomRouter = async () => {
  const router = useRouter()
  await router.isReady()
  return router
}

export {
  useCustomRouter as useRouter
}
