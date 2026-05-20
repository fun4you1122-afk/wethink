/**
 * WeThink Lead Generator
 * Run: node scripts/generate-leads.mjs
 *
 * Paste Claude's CSV output into the LEADS array below, then run the script.
 * It will update (or create) public/WeThink-Leads.xlsx
 */

import * as XLSX from 'xlsx'
import { readFileSync, existsSync } from 'fs'

const FILE = 'public/WeThink-Leads.xlsx'

// ── Paste new leads here (CSV rows from Claude) ────────────────────
// Each row: "Business Name","Industry","Address","Phone","Email","Website","Rating","Reviews","Pain Points","Recommended Services","Priority"
const NEW_CSV = `
"Al Reem Medical Centre","Healthcare","Al Reem Island, Abu Dhabi","02-123-4567","info@alreem.ae","www.alreemmedical.ae","4.2","87","Outdated patient management system, no digital appointment booking, manual billing","Custom Software, Digital Transformation","High"
"Gulf Freight Solutions","Logistics","Mussafah Industrial, Abu Dhabi","02-555-0123","ops@gulffreight.ae","www.gulffreight.ae","3.8","42","No real-time shipment tracking, siloed data across branches, legacy ERP","Data Analytics, IT Solutions, Cloud Services","High"
"Desert Rose Real Estate","Real Estate","Corniche Road, Abu Dhabi","02-444-7890","contact@desertrose.ae","www.desertrose.ae","4.5","156","No CRM, manual client follow-ups, no data on lead conversion","Custom Software, Strategic Consulting","Medium"
`.trim()

// ── Column definitions ─────────────────────────────────────────────
const HEADERS = [
  'Business Name',
  'Industry',
  'Address',
  'Phone',
  'Email',
  'Website',
  'Rating',
  'Reviews',
  'Pain Points',
  'Recommended Services',
  'Priority',
  'Outreach Status',
  'Date Added',
  'Notes',
]

const STATUS_OPTIONS = ['Not Contacted', 'Message Sent', 'Replied', 'Meeting Booked', 'Proposal Sent', 'Won', 'Not Interested']

// ── Parse incoming CSV rows ────────────────────────────────────────
function parseCSV(csv) {
  return csv.split('\n')
    .map(line => line.trim()).filter(Boolean)
    .map(line => {
      const cols = []
      let cur = '', inQ = false
      for (let i = 0; i < line.length; i++) {
        const ch = line[i]
        if (ch === '"') { inQ = !inQ }
        else if (ch === ',' && !inQ) { cols.push(cur.trim()); cur = '' }
        else { cur += ch }
      }
      cols.push(cur.trim())
      return cols
    })
    .filter(row => row.length >= 8 && row[0])
}

// ── Load existing workbook or create fresh ─────────────────────────
let wb, ws, existingNames = new Set()

if (existsSync(FILE)) {
  const buf = readFileSync(FILE)
  wb = XLSX.read(buf, { type: 'buffer' })
  ws = wb.Sheets['Leads']
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 })
  rows.slice(1).forEach(r => r[0] && existingNames.add(String(r[0]).trim().toLowerCase()))
  console.log(`  Loaded existing file — ${existingNames.size} leads already in sheet`)
} else {
  wb = XLSX.utils.book_new()
  ws = null
  console.log('  Creating new leads file…')
}

// ── Build rows ─────────────────────────────────────────────────────
const today = new Date().toISOString().slice(0, 10)
const incoming = parseCSV(NEW_CSV)
const newRows = []

incoming.forEach(cols => {
  const name = (cols[0] || '').trim()
  if (!name || existingNames.has(name.toLowerCase())) {
    if (existingNames.has(name.toLowerCase()))
      console.log(`  Skip duplicate: ${name}`)
    return
  }
  newRows.push([
    name,           // Business Name
    cols[1] || '',  // Industry
    cols[2] || '',  // Address
    cols[3] || '',  // Phone
    cols[4] || '',  // Email
    cols[5] || '',  // Website
    cols[6] || '',  // Rating
    cols[7] || '',  // Reviews
    cols[8] || '',  // Pain Points
    cols[9] || '',  // Recommended Services
    cols[10] || '', // Priority
    'Not Contacted',// Outreach Status
    today,          // Date Added
    '',             // Notes
  ])
  existingNames.add(name.toLowerCase())
})

// ── Rebuild sheet with all data ────────────────────────────────────
let allRows = [HEADERS]

if (ws) {
  const existing = XLSX.utils.sheet_to_json(ws, { header: 1 })
  allRows = existing.length > 1 ? existing : [HEADERS]
}
allRows.push(...newRows)

const newWs = XLSX.utils.aoa_to_sheet(allRows)

// ── Column widths ──────────────────────────────────────────────────
newWs['!cols'] = [
  { wch: 28 },  // Business Name
  { wch: 18 },  // Industry
  { wch: 32 },  // Address
  { wch: 16 },  // Phone
  { wch: 28 },  // Email
  { wch: 28 },  // Website
  { wch: 8  },  // Rating
  { wch: 10 },  // Reviews
  { wch: 42 },  // Pain Points
  { wch: 38 },  // Recommended Services
  { wch: 10 },  // Priority
  { wch: 18 },  // Outreach Status
  { wch: 13 },  // Date Added
  { wch: 30 },  // Notes
]

// ── Row freeze (header stays visible on scroll) ────────────────────
newWs['!freeze'] = { xSplit: 0, ySplit: 1 }

// Replace or add sheet
if (wb.SheetNames.includes('Leads')) {
  wb.Sheets['Leads'] = newWs
} else {
  XLSX.utils.book_append_sheet(wb, newWs, 'Leads')
}

XLSX.writeFile(wb, FILE)

const total = allRows.length - 1
console.log(`\n  ✓  ${newRows.length} new lead(s) added  |  ${total} total in sheet`)
console.log(`  →  ${FILE}\n`)
