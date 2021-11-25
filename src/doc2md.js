const fs = require('fs')
const path = require('path');
const fg = require('fast-glob');
const JavadocToMarkdown = require('./doc-to-markdown.js').JavadocToMarkdown

const argv = process.argv.slice(2)
if (argv.length < 3) {
  console.error('please provide exactly 3 arguments {directoryToConvert} {extension} {targetDir}')
  process.exit(1)
}
function dirToAbsolute(dir) {
  return (dir.startsWith('/')) ? dir : path.join(process.cwd(), dir)
}

const baseDir = dirToAbsolute(argv[0])
const ext = argv[1]
const targetDir  = dirToAbsolute(argv[2])
const javadocToMarkdown = new JavadocToMarkdown()

const files = fg.sync(
  `**/*.${ext}`,
  { 
    cwd: baseDir,
    onlyFiles: true, 
    absolute: false,
    globstar: true,
  } 
)
if (files.length === 0) {
  console.error(`${baseDir} contains no .${ext} files`)
  process.exit(1)
}

const index = []

files.forEach((relativeFile) => {
  const relativeTargetFile = 
    relativeFile.replace(new RegExp(`\.${ext}$`), '.md')
  const targetFile = path.join(targetDir, relativeTargetFile)
  console.log(`creating ${targetFile}`)

  // create target directory
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });

  // create md file from source
  const data = fs.readFileSync(
    path.join(baseDir, relativeFile), 
    { encoding:'utf8', flag:'r' }
  )
  fs.writeFileSync(targetFile, javadocToMarkdown.fromJavadoc(data, 1))

  // update index
  index.push({relativeFile, relativeTargetFile})
})

// generate _index.md
const indexFile = path.join(targetDir, '_index.md') 
console.log(`creating ${indexFile}`)
let data = `
# Documentation

`
index.forEach(({relativeFile, relativeTargetFile}) => {
  data += ` * [${relativeFile} doc](${relativeTargetFile})\n`
})
fs.writeFileSync(indexFile, data)