/**
 * Marhaba Thailand — Opening Ceremony
 * Confirmation and reminder emails, sent from the Embassy's own account.
 *
 * This runs inside the Google Sheet that collects the Opening Ceremony form
 * responses, so guest details never leave the Embassy's Google account and
 * every email is sent from the Embassy's address rather than a third party.
 *
 * ── Setup ────────────────────────────────────────────────────────────────
 * 1. Open the form's response spreadsheet.
 * 2. Extensions ▸ Apps Script. Delete whatever is in the editor and paste
 *    this whole file in. Save.
 * 3. Run `setUpTriggers` once. Google will ask for permission to send mail
 *    on your behalf; approve it.
 * 4. That is all. From then on:
 *      • every new registration gets a confirmation with their own ticket
 *      • on 10 September everyone registered gets a reminder
 *
 * To test before going live, run `sendTestToMe` — it emails only you.
 * ─────────────────────────────────────────────────────────────────────────
 */

var CONFIG = {
  invitationUrl: 'https://www.wethink.ae/embassy/opening',
  programmeUrl: 'https://www.wethink.ae/embassy/programme',
  eventName: 'Marhaba Thailand · Opening Ceremony',
  when: 'Friday 11 September 2026, 17:00 – 18:00 hrs',
  where: 'Main Atrium, Ground Floor (near Zara), Reem Mall, Abu Dhabi',
  host: 'The Royal Thai Embassy, Abu Dhabi',
  senderName: 'Royal Thai Embassy, Abu Dhabi',
  // the day the reminder goes out, in the sheet's own time zone
  reminderDate: '2026-09-10',
  // column headers in the response sheet, as the form writes them
  columns: {
    name: 'Title, name and surname',
    email: 'Email',
  },
  // set to a real address to copy every send somewhere for the record
  bcc: '',
}

/* ── triggers ─────────────────────────────────────────────────────────── */

function setUpTriggers() {
  var ss = SpreadsheetApp.getActive()
  ScriptApp.getProjectTriggers().forEach(function (t) {
    ScriptApp.deleteTrigger(t)
  })
  ScriptApp.newTrigger('onRegistration').forSpreadsheet(ss).onFormSubmit().create()
  ScriptApp.newTrigger('sendRemindersIfDue').timeBased().atHour(10).everyDays(1).create()
  SpreadsheetApp.getUi().alert(
    'Done. Confirmations will go out as people register, and reminders on ' +
      CONFIG.reminderDate + '.',
  )
}

/* ── confirmation, on each new registration ───────────────────────────── */

function onRegistration(e) {
  if (!e || !e.namedValues) return
  var name = firstValue(e.namedValues, CONFIG.columns.name)
  var email = firstValue(e.namedValues, CONFIG.columns.email)
  if (!email) return
  send(email, name, 'confirmation')
}

/* ── reminder, on the day before ──────────────────────────────────────── */

function sendRemindersIfDue() {
  var tz = SpreadsheetApp.getActive().getSpreadsheetTimeZone()
  var today = Utilities.formatDate(new Date(), tz, 'yyyy-MM-dd')
  if (today !== CONFIG.reminderDate) return
  sendReminders()
}

/** Run this by hand if you want to send the reminders early. */
function sendReminders() {
  var rows = readGuests()
  var sent = 0
  for (var i = 0; i < rows.length; i++) {
    if (!rows[i].email) continue
    send(rows[i].email, rows[i].name, 'reminder')
    sent++
    Utilities.sleep(400) // stay well inside the daily sending quota
  }
  Logger.log('Reminders sent: ' + sent)
}

function sendTestToMe() {
  send(Session.getEffectiveUser().getEmail(), 'Test Guest', 'confirmation')
  send(Session.getEffectiveUser().getEmail(), 'Test Guest', 'reminder')
}

/* ── the sheet ────────────────────────────────────────────────────────── */

function readGuests() {
  var sheet = SpreadsheetApp.getActive().getSheets()[0]
  var values = sheet.getDataRange().getValues()
  if (values.length < 2) return []
  var header = values[0]
  var nameCol = header.indexOf(CONFIG.columns.name)
  var emailCol = header.indexOf(CONFIG.columns.email)
  if (emailCol < 0) throw new Error('No "' + CONFIG.columns.email + '" column in this sheet.')

  var seen = {}
  var out = []
  for (var r = 1; r < values.length; r++) {
    var email = String(values[r][emailCol] || '').trim()
    if (!email || seen[email.toLowerCase()]) continue
    seen[email.toLowerCase()] = true
    out.push({ name: String(nameCol >= 0 ? values[r][nameCol] : '').trim(), email: email })
  }
  return out
}

function firstValue(namedValues, key) {
  var v = namedValues[key]
  if (!v) return ''
  return String(Array.isArray(v) ? v[0] : v).trim()
}

/* ── the email ────────────────────────────────────────────────────────── */

function invitationLink(name) {
  return name ? CONFIG.invitationUrl + '?to=' + encodeURIComponent(name) : CONFIG.invitationUrl
}

function send(email, name, kind) {
  var link = invitationLink(name)
  var greeting = name ? 'Dear ' + name + ',' : 'Dear Guest,'
  var lead =
    kind === 'reminder'
      ? 'The Opening Ceremony is tomorrow. Your invitation and ticket are ready below.'
      : 'Thank you for confirming your attendance. Your invitation and ticket are ready below.'
  var subject =
    kind === 'reminder'
      ? CONFIG.eventName + ' is tomorrow'
      : 'Your invitation · ' + CONFIG.eventName

  var options = {
    name: CONFIG.senderName,
    htmlBody: htmlBody(greeting, lead, link),
    body: textBody(greeting, lead, link),
  }
  if (CONFIG.bcc) options.bcc = CONFIG.bcc

  MailApp.sendEmail(email, subject, options.body, options)
}

function textBody(greeting, lead, link) {
  return [
    greeting,
    '',
    lead,
    '',
    CONFIG.eventName,
    CONFIG.when,
    CONFIG.where,
    '',
    'Your invitation and ticket: ' + link,
    'Festival programme: ' + CONFIG.programmeUrl,
    '',
    CONFIG.host,
  ].join('\n')
}

function htmlBody(greeting, lead, link) {
  return [
    '<div style="margin:0;padding:24px 12px;background:#EEF7F8;font-family:Helvetica,Arial,sans-serif;">',
    '<div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 10px 30px rgba(1,88,102,0.10);">',

    '<div style="background:linear-gradient(135deg,#015866,#037A8A);padding:26px 28px;">',
    '<div style="color:#A8E0E8;font-size:11px;letter-spacing:2.4px;text-transform:uppercase;">Marhaba Thailand</div>',
    '<div style="color:#ffffff;font-size:26px;line-height:1.2;margin-top:6px;">Opening Ceremony</div>',
    '</div>',

    '<div style="padding:26px 28px;color:#0C3A42;font-size:15px;line-height:1.6;">',
    '<p style="margin:0 0 14px;">' + escapeHtml(greeting) + '</p>',
    '<p style="margin:0 0 20px;color:#46707A;">' + escapeHtml(lead) + '</p>',

    '<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-top:1px solid rgba(3,122,138,0.16);border-bottom:1px solid rgba(3,122,138,0.16);margin:0 0 22px;">',
    row('When', CONFIG.when),
    row('Where', CONFIG.where),
    row('Hosted by', CONFIG.host),
    '</table>',

    '<a href="' + link + '" style="display:inline-block;background:#015866;color:#ffffff;text-decoration:none;padding:14px 26px;border-radius:999px;font-size:14px;letter-spacing:0.6px;">View your invitation</a>',
    '<div style="margin-top:14px;">',
    '<a href="' + link + '" style="color:#037A8A;text-decoration:none;font-size:13px;">Your ticket and wallet pass</a>',
    '<span style="color:#9DBFC6;"> &nbsp;·&nbsp; </span>',
    '<a href="' + CONFIG.programmeUrl + '" style="color:#037A8A;text-decoration:none;font-size:13px;">Festival programme</a>',
    '</div>',
    '</div>',

    '<div style="padding:16px 28px 22px;border-top:1px solid rgba(3,122,138,0.12);color:#7FA3AB;font-size:11px;letter-spacing:1.6px;text-transform:uppercase;">',
    'Designed and built by WeThink',
    '</div>',

    '</div></div>',
  ].join('')
}

function row(label, value) {
  return (
    '<tr>' +
    '<td style="padding:12px 0;width:96px;vertical-align:top;color:#037A8A;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;">' +
    escapeHtml(label) +
    '</td>' +
    '<td style="padding:12px 0;color:#0C3A42;font-size:14px;">' +
    escapeHtml(value) +
    '</td>' +
    '</tr>'
  )
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
