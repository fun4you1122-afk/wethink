/* All four panels in one file, in the order they are hung:
   the entrance pair first, then main, secondary and workshops. */
import { execFileSync } from 'node:child_process'
console.log(execFileSync('python3', ['-c', `
import sys, os, re
sys.path.insert(0, os.environ['PYLIBS'])
from pypdf import PdfWriter, PdfReader
d = 'public/embassy/print'
order = ['master', 'main', 'second', 'workshop']
w = PdfWriter()
for n in order:
    w.add_page(PdfReader(os.path.join(d, n + '.pdf')).pages[0])
out = os.path.join(d, 'all-panels.pdf')
with open(out, 'wb') as f:
    w.write(f)
r = PdfReader(out)
mm = lambda pt: float(pt) * 25.4 / 72
for i, p in enumerate(r.pages):
    print(f"  page {i+1}  {order[i]:9} {mm(p.mediabox.width):.1f} x {mm(p.mediabox.height):.1f} mm")
print(f"{out}  {len(r.pages)} pages, {os.path.getsize(out)//1024} KB")
`], { encoding: 'utf8', env: { ...process.env, PYLIBS: process.env.PYLIBS ?? '' } }))
