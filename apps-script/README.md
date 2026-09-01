# Enquiry form backend (Google Apps Script)

The website is static and has no server. The contact form is handled by a Google
Apps Script web app that IBR owns outright: it writes each enquiry to a Google
Sheet and emails the workshop. No third-party form service, no account to pay
for, no monthly submission cap.

**It is not connected yet.** `site/assets/js/site.js` has `ENDPOINT = ''`, so the
form currently falls back to opening the visitor's email client with the details
pre-filled. Nothing is transmitted by the page and nothing reaches IBR's inbox
until step 6 below.

## Setup

1. Sign in to Google **as IBR** (not a personal or unrelated work account — the
   enquiries and the customer data in them should live in IBR's own Workspace).
2. Create a new Google Sheet, name it something like `IBR website enquiries`.
3. In that Sheet: **Extensions → Apps Script**. Delete the placeholder code.
4. Paste in the contents of [`Code.gs`](Code.gs) and save.
5. **Deploy → New deployment → Web app**:
   - *Execute as*: **Me** (so it can write the Sheet and send mail)
   - *Who has access*: **Anyone**
   - Deploy, and grant the permissions it asks for.
6. Copy the deployment's `/exec` URL and paste it into `ENDPOINT` in
   `site/assets/js/site.js`. Commit and push — that's the form live.

## Checking it works

Submit the form on the live site. Within a few seconds you should see a new row
in the Sheet and an email at `info@ibr.co.nz`. If not, open **Executions** in the
Apps Script editor to see the error.

## Notes

- **Changing the notification address**: edit `NOTIFY` at the top of `Code.gs`,
  save, then **Deploy → Manage deployments → Edit → New version**. Editing the
  code alone does not update the live web app.
- **Spam**: the form carries a hidden honeypot field. Anything that fills it in
  is accepted and discarded, so bots don't retry.
- **Photo uploads** are not wired up. Apps Script can accept base64 images and
  drop them in Drive, but large phone photos will hit request limits, so the form
  currently asks people to attach photos to a reply instead. If IBR wants true
  in-form uploads, that's the piece to build next.
- **Quotas**: a consumer Gmail account can send roughly 100 emails a day via
  Apps Script; Workspace accounts get more. Far beyond what this form will do.
