import * as FS from "fs"
import * as FSP from "fs/promises"

function recurExploreDir(dir, cb){
  const files = FS.readdirSync(dir)
  for( let file of files ){
    let path = `${dir}/${file}`
    try { 
      recurExploreDir(path, cb)
    }
    catch(e){
      cb(path)
    }
  }
}

function asyncAssert(condition, message) {
  if (!condition) {
    console.error(message)
    process.exit(1)
  }
}

const routesPath     = "./src/routes"
const headerFinder   = /(export const pageHeader: HeaderData.*?)({[^]*?\n})/gm
const jsonFixer      = /(['"])?([a-zA-Z0-9_]+)(['"])?:/g
const fileClipper    = /\/[^/]+$/

module.exports = async function() {
  const files = []
  recurExploreDir(
    routesPath, 
    (path) => {files.push(path)} 
  )

  const promises = [];
  for(let file of files){
    if( file == undefined ){ continue }
    if( file.endsWith("index.tsx") ){
      promises.push( FSP.readFile(file).then(
        data => {
          let header = headerFinder.exec(data.toString())
          asyncAssert(header, `Missing header information on ${file}!`)
          try {
            header = header[2].replace(jsonFixer,'"$2":')
            header = JSON.parse(header)
            header.url = header.url || file.slice(routesPath.length).replace(fileClipper,"")
            return header
          }
          catch(e){
            asyncAssert(false,`Bad header information on ${file}: ${e}`)
          }
        }
      )
    )}
  }
  const result = await Promise.all(promises)
  return result
}
