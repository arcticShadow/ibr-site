/**
 * IBR website enquiry handler.
 *
 * A Google Apps Script web app that receives the contact form, appends it to a
 * spreadsheet, and emails the workshop. Free, owned entirely by IBR's own
 * Google account, and with no third-party service in between.
 *
 * Deployment instructions are in apps-script/README.md.
 */

/** Where enquiries are emailed. */
var NOTIFY = 'info@ibr.co.nz';

/** Tab name inside the bound spreadsheet. */
var SHEET = 'Enquiries';

var FIELDS = [
  'name',
  'phone',
  'email',
  'boat',
  'jobtype',
  'timing',
  'message',
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Honeypot: real people leave this empty. Accept silently so a bot that
    // fills it in gets a success response and does not retry.
    if (data.website) {
      return json({ ok: true });
    }

    if (!data.name || !data.message || (!data.phone && !data.email)) {
      return json({ ok: false, error: 'missing required fields' }, 400);
    }

    var row = [new Date()];
    FIELDS.forEach(function (f) {
      row.push(clean(data[f]));
    });

    var sheet = getSheet();
    sheet.appendRow(row);

    MailApp.sendEmail({
      to: NOTIFY,
      replyTo: data.email || NOTIFY,
      subject: 'Website enquiry — ' + clean(data.name),
      body: body(data),
    });

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'server error' }, 500);
  }
}

/** Browsers may probe the endpoint; answer politely rather than erroring. */
function doGet() {
  return json({ ok: true, service: 'ibr-enquiry' });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET);
    sheet.appendRow(['Received'].concat(FIELDS));
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function clean(v) {
  if (v === null || v === undefined) return '';
  return String(v).slice(0, 5000);
}

function body(d) {
  return [
    'New enquiry from the IBR website.',
    '',
    'Name:     ' + clean(d.name),
    'Phone:    ' + clean(d.phone),
    'Email:    ' + clean(d.email),
    'Boat:     ' + clean(d.boat),
    'Job type: ' + clean(d.jobtype),
    'Timing:   ' + clean(d.timing),
    '',
    'Details',
    '-------',
    clean(d.message),
  ].join('\n');
}

function json(obj, code) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
