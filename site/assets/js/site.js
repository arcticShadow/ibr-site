/* IBR — progressive enhancement only.
   Every page works with this file blocked: the nav is visible without JS via
   the <noscript> rule, the gallery falls back to plain links, and the enquiry
   form falls back to a normal mailto: submission. */

/* -- Mobile nav ---------------------------------------------------------- */

const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('#primary-nav');

if (toggle && nav) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
  });

  // Close on Escape, and whenever we grow past the desktop breakpoint.
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') toggle.setAttribute('aria-expanded', 'false');
  });

  matchMedia('(width >= 60rem)').addEventListener('change', (e) => {
    if (e.matches) toggle.setAttribute('aria-expanded', 'false');
  });
}

/* -- Gallery lightbox ---------------------------------------------------- */

const lightbox = document.querySelector('#lightbox');

if (lightbox && typeof lightbox.showModal === 'function') {
  const img = lightbox.querySelector('img');
  const title = lightbox.querySelector('.lightbox__cap b');
  const body = lightbox.querySelector('.lightbox__cap span');

  document.querySelectorAll('.shot__btn').forEach((btn) => {
    btn.hidden = false;
    btn.addEventListener('click', () => {
      const fig = btn.closest('figure');
      const source = fig.querySelector('img');
      img.src = source.currentSrc || source.src;
      img.alt = source.alt;
      img.width = source.naturalWidth || 400;
      img.height = source.naturalHeight || 267;
      title.textContent = fig.querySelector('figcaption b').textContent;
      body.textContent = fig.querySelector('figcaption span').textContent;
      lightbox.showModal();
    });
  });

  lightbox
    .querySelector('.lightbox__close')
    .addEventListener('click', () => lightbox.close());

  // Click the backdrop (i.e. the dialog element itself) to dismiss.
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.close();
  });
}

/* -- Enquiry form -------------------------------------------------------- */

/* ENDPOINT is intentionally empty. IBR has not commissioned this site yet, so
   nothing here delivers to their inbox. Paste the Apps Script /exec URL in
   apps-script/README.md's step 6 to switch the form from mailto: to POST.
   See GO-LIVE.md. */
const ENDPOINT = '';

const form = document.querySelector('#enquiry-form');

if (form) {
  const status = form.querySelector('.form__status');
  const submit = form.querySelector('button[type="submit"]');

  const summarise = (data) =>
    [
      `Name:     ${data.get('name') || '—'}`,
      `Phone:    ${data.get('phone') || '—'}`,
      `Email:    ${data.get('email') || '—'}`,
      `Boat:     ${data.get('boat') || '—'}`,
      `Job type: ${data.getAll('jobtype').join(', ') || '—'}`,
      `Timing:   ${data.get('timing') || '—'}`,
      '',
      'Details',
      '-------',
      data.get('message') || '—',
    ].join('\n');

  form.addEventListener('submit', async (e) => {
    // Let the browser show its own validation UI first.
    if (!form.reportValidity()) return;

    e.preventDefault();
    const data = new FormData(form);

    if (!ENDPOINT) {
      // No backend configured: hand off to the visitor's mail client with
      // everything already filled in. Nothing is transmitted by this page.
      const subject = `Enquiry from ${data.get('name') || 'the IBR website'}`;
      window.location.href =
        `mailto:${form.dataset.mailto}` +
        `?subject=${encodeURIComponent(subject)}` +
        `&body=${encodeURIComponent(summarise(data))}`;
      status.dataset.state = 'ok';
      status.textContent =
        'Opening your email app with the details filled in — press send to finish.';
      return;
    }

    submit.disabled = true;
    status.dataset.state = '';
    status.textContent = 'Sending…';

    try {
      // text/plain keeps this a CORS "simple request", so Apps Script
      // answers it without needing a preflight it cannot serve.
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      status.dataset.state = 'ok';
      status.textContent =
        'Thanks — that has reached the workshop. We will come back to you on the next working day.';
    } catch {
      status.dataset.state = 'err';
      status.textContent =
        `Sorry, that did not send. Please call 021 759 223, or email ${form.dataset.mailto} directly.`;
      submit.disabled = false;
    }
  });
}
