import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs'
import { join } from 'path'

function walk(dir) {
  let results = []
  for (const file of readdirSync(dir)) {
    const full = join(dir, file)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      if (!full.includes('/components/shadcn') && !full.includes('/shared/ui/shadcn')) {
        results = results.concat(walk(full))
      }
    } else if (full.endsWith('.ts') || full.endsWith('.tsx')) {
      results.push(full)
    }
  }
  return results
}

let count = 0
for (const fp of walk('src')) {
  const content = readFileSync(fp, 'utf8')
  if (content.includes('@/components/shadcn/')) {
    writeFileSync(fp, content.replaceAll('@/components/shadcn/', '@/shared/ui/shadcn/'))
    count++
  }
}
console.log(`Done: ${count} files`)
