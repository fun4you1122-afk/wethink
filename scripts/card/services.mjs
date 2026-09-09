/* The five service lines, read from lib/services.ts so the card cannot
   disagree with the website. Parsed rather than imported: this script is
   plain JavaScript and the source is TypeScript. */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../lib/services.ts',
)

export function serviceTitles() {
  const src = readFileSync(SRC, 'utf8')
  const titles = [...src.matchAll(/^\s{4}title:\s*'((?:[^'\\]|\\.)*)',$/gm)]
    .map((m) => m[1].replace(/\\'/g, "'"))
  if (titles.length !== 5) {
    throw new Error(`expected 5 service lines in lib/services.ts, found ${titles.length}`)
  }
  return titles
}
