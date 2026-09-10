/* The five service lines, read from lib/services.ts so the card cannot
   disagree with the website. Parsed rather than imported: this script is
   plain JavaScript and the source is TypeScript.

   The card takes the `short` form: at 85mm there is no room for the full
   titles, and they are what the site and the profile carry. */

import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../../lib/services.ts',
)

export function serviceTitles({ brief = true } = {}) {
  const src = readFileSync(SRC, 'utf8')
  const key = brief ? 'short' : 'title'
  const re = new RegExp(`^\\s{4}${key}:\\s*'((?:[^'\\\\]|\\\\.)*)',$`, 'gm')
  const out = [...src.matchAll(re)].map((m) => m[1].replace(/\\'/g, "'"))
  if (out.length !== 5) {
    throw new Error(`expected 5 service lines in lib/services.ts, found ${out.length}`)
  }
  return out
}
