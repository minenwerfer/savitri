import { fileURLToPath } from 'url'
import { createServer, build } from 'vite'

const projectRoot = process.cwd()
const buildRoot = fileURLToPath(new URL('.', import.meta.url))

const serve = async () => {
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

const productionBuild = async () => {
  const { default: content } = await import(`${buildRoot}/vite.js`)
  return build(content)

}

productionBuild()
