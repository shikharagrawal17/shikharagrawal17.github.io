/**
 * MINIMALIST INTERACTION ENGINE — SHIKHAR AGARWAL
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Interactive Cursor Spotlight
  const spotlight = document.getElementById('spotlight');
  window.addEventListener('mousemove', (e) => {
    if (spotlight) {
      spotlight.style.setProperty('--mouse-x', `${e.clientX}px`);
      spotlight.style.setProperty('--mouse-y', `${e.clientY}px`);
    }
  });

  // 3. Email Copy Action with Confetti & Toast
  const EMAIL = 'shikharagarwal1701@gmail.com';

  function copyEmail(btn, textElement) {
    navigator.clipboard.writeText(EMAIL).then(() => {
      const orig = textElement ? textElement.textContent : '';
      if (textElement) textElement.textContent = 'Copied! ✓';
      showToast('Email copied to clipboard');

      if (window.confetti) {
        window.confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.8 },
          colors: ['#38bdf8', '#ffffff']
        });
      }

      setTimeout(() => {
        if (textElement) textElement.textContent = orig;
      }, 2000);
    });
  }

  const copyHeroBtn = document.getElementById('copy-email-hero-btn');
  const copyHeroText = document.getElementById('copy-hero-text');
  if (copyHeroBtn) {
    copyHeroBtn.addEventListener('click', () => copyEmail(copyHeroBtn, copyHeroText));
  }

  const copyBottomBtn = document.getElementById('copy-email-bottom-btn');
  const copyBottomText = document.getElementById('copy-bottom-text');
  if (copyBottomBtn) {
    copyBottomBtn.addEventListener('click', () => copyEmail(copyBottomBtn, copyBottomText));
  }

  // 4. Command Palette (Cmd+K / Ctrl+K)
  const cmdModal = document.getElementById('cmd-palette-modal');
  const cmdTrigger = document.getElementById('cmd-trigger-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');

  function openCmd() {
    if (!cmdModal) return;
    cmdModal.classList.remove('hidden');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
  }

  function closeCmd() {
    if (!cmdModal) return;
    cmdModal.classList.add('hidden');
  }

  if (cmdTrigger) cmdTrigger.addEventListener('click', openCmd);

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal && cmdModal.classList.contains('hidden')) openCmd();
      else closeCmd();
    }
    if (e.key === 'Escape') closeCmd();
  });

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) closeCmd();
    });
  }

  if (cmdInput && cmdResults) {
    const items = cmdResults.querySelectorAll('.cmd-item');
    cmdInput.addEventListener('input', () => {
      const q = cmdInput.value.toLowerCase().trim();
      items.forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(q) ? 'flex' : 'none';
      });
    });

    items.forEach(item => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        const target = item.getAttribute('data-target');
        closeCmd();
        if (action === 'goto' && target) {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'copy-email') {
          copyEmail(null, null);
        }
      });
    });
  }

  // 5. Toast Feedback
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span><span>${msg}</span>`;
    toast.classList.remove('hidden');
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }
});
