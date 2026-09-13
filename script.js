document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Email copy functionality
  const copyBtn = document.getElementById('copy-email-btn');
  const copyText = document.getElementById('copy-text');
  const EMAIL = 'shikharagarwal1701@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(EMAIL).then(() => {
        if (copyText) copyText.textContent = 'Copied! ✓';
        setTimeout(() => {
          if (copyText) copyText.textContent = 'Copy Email';
        }, 2000);
      });
    });
  }
});
