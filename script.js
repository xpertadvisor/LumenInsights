// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      nav.classList.toggle('open');
    });
    // Close nav on link click
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('open');
        nav.classList.remove('open');
      });
    });
  }

  // Contact form mailto fallback
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const firstName = (data.get('name') || '').toString().trim();
      const lastName = (data.get('lastname') || '').toString().trim();
      const fullName = [firstName, lastName].filter(Boolean).join(' ') || 'Website Visitor';
      const subjectLine = (data.get('subject') || '').toString().trim();
      const subject = encodeURIComponent(subjectLine ? `Website Enquiry: ${subjectLine}` : `Website Enquiry from ${fullName}`);
      const body = encodeURIComponent(
        'Name: ' + fullName + '\n' +
        'Email: ' + (data.get('email') || '') + '\n' +
        (subjectLine ? ('Subject: ' + subjectLine + '\n') : '') +
        '\n' +
        (data.get('message') || '')
      );
      window.location.href = 'mailto:lumen.insights.sg@gmail.com?subject=' + subject + '&body=' + body;
    });
  }
});
