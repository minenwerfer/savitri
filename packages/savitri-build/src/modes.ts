import { fileURLToPath } from 'url'
import { createServer, build as viteBuild } from 'vite'

const projectRoot = process.cwd()
const buildRoot = fileURLToPath(new URL('.', import.meta.url))

export const serve = async () => {
  const server = await createServer({
    configFile: `${buildRoot}/vite.js`,
    root: projectRoot,
    server: {
      port: 8080
    }
  })

  await server.listen()
  server.printUrls()
}

export const build = async () => {
  const { default: content } = await import(`${buildRoot}/vite.js`)
  return viteBuild(content)

}
