const fs = require('fs')
const path = require('path')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    file = path.join(dir, file)
    const stat = fs.statSync(file)
    if (stat && stat.isDirectory()) {
      if (!file.includes('/components/shadcn') && !file.includes('/shared/ui/shadcn')) {
        results = results.concat(walk(file))
      }
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx')) results.push(file)
    }
  })
  return results
}

const files = walk('src')
let count = 0
files.forEach(fp => {
  const content = fs.readFileSync(fp, 'utf8')
  if (content.includes('@/components/shadcn/')) {
    fs.writeFileSync(fp, content.replace(/@\/components\/shadcn\//g, '@/shared/ui/shadcn/'))
    count++
  }
})
console.log(count + ' files updated')
