import { readdir, readFile, writeFile } from 'fs/promises'

const gatherIcons = async () => {
  const instanceFilename = `${process.cwd()}/instance.json`
  const targetDir = `${process.cwd()}/../api/resources/collections`
  const collections = await readdir(targetDir)
  const instance = require(instanceFilename)

  const icons = new Set<string>()
  const regex = /icon:\s?['|"]([^'"]+)['|"]/mg

  const scrapIcons = (content: string) => {
    let match: Array<string>|null
    while( match = regex.exec(content) ) {
      const iconName = match[1]
      if( !icons.has(iconName) ) {
        icons.add(iconName)
      }
    }
  }

  for( const collection of collections ) {
    const descriptionFilename = (await readdir(`${targetDir}/${collection}`))
      .find((filename) => /\.description\.([a-z]+)$/.test(filename))

    const description = await readFile(`${targetDir}/${collection}/${descriptionFilename}`) as unknown
    scrapIcons(description as string)

  }

  instance.icons ??= []
  instance.icons = Array.from(new Set([
      ...instance.icons,
      ...Array.from(icons)
    ])
  )

  return writeFile(instanceFilename, JSON.stringify(instance, null, 2))
}

const main = () => {
  gatherIcons()
}

main()
