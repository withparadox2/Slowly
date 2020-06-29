const fs = require("fs")
const path = require("path")

const basePath = "./src/i18n/locale"

function main() {
  const fileList = fs.readdirSync(basePath)

  let mapFirst = null
  let mapSecond = null

  fileList.forEach((file) => {
    const fullPath = path.join(basePath, file)
    if (mapFirst === null) {
      mapFirst = loadFile(fullPath)
    } else {
      mapSecond = loadFile(fullPath)

      Object.keys(mapFirst.map).forEach((key) => {
        if (!mapSecond.map[key]) {
          throw new Error(mapSecond.file + " doesn't contain key " + key)
        }
      })

      Object.keys(mapSecond.map).forEach((key) => {
        if (!mapFirst.map[key]) {
          throw new Error(mapFirst.file + " doesn't contain key " + key)
        }
      })
    }
  })

  console.log("Check i18n pass")
}

function loadFile(jsonFile) {
  return {
    file: jsonFile,
    map: JSON.parse(fs.readFileSync(jsonFile)),
  }
}

main()
