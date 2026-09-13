/**
 * SHIKHAR AGARWAL PORTFOLIO - SCRIPT ENGINE
 * Features:
 *  - Interactive Canvas Mesh / Node Grid Background
 *  - Web Audio Synthesizer (Sci-Fi Audio Feedback with mute toggle)
 *  - Command Palette (Cmd+K / Ctrl+K) with keyboard navigation
 *  - Dark / Light Theme switching with local storage
 *  - Filterable Projects Grid
 *  - Node ping diagnostics & particle confetti triggers
 *  - Email clipboard copy with visual feedback toast
 *  - Intersection Observer smooth animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* -------------------------------------------------------------
     1. Web Audio Synthesizer (Retro Sci-Fi SFX)
     ------------------------------------------------------------- */
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
  }

  function playTone(freq = 440, type = 'sine', duration = 0.08, gainVal = 0.05) {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play prevented:', e);
    }
  }

  function playCyberSuccess() {
    if (!soundEnabled) return;
    playTone(523.25, 'triangle', 0.08, 0.04);
    setTimeout(() => playTone(659.25, 'sine', 0.09, 0.04), 70);
    setTimeout(() => playTone(783.99, 'sine', 0.14, 0.05), 140);
  }

  function playLaserBlip() {
    if (!soundEnabled) return;
    playTone(880, 'sine', 0.05, 0.03);
  }

  // Sound Toggle Button
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundStatusText = document.getElementById('sound-status-text');

  if (soundToggleBtn && soundStatusText) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      soundStatusText.textContent = soundEnabled ? 'ON' : 'OFF';
      soundStatusText.classList.toggle('text-emerald-400', soundEnabled);
      if (soundEnabled) {
        playCyberSuccess();
        showToast('HUD Audio Synthesizer: ONLINE 🔊');
      } else {
        showToast('HUD Audio Synthesizer: MUTED 🔇');
      }
    });
  }

  /* -------------------------------------------------------------
     2. Interactive HUD Canvas Grid & Particles
     ------------------------------------------------------------- */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 55);

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        color: Math.random() > 0.4 ? 'rgba(56, 189, 248, 0.5)' : 'rgba(16, 185, 129, 0.45)',
      });
    }

    let mouseX = -1000;
    let mouseY = -1000;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      // Connect near particles with faint cyber lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0) p1.x = width;
        if (p1.x > width) p1.x = 0;
        if (p1.y < 0) p1.y = height;
        if (p1.y > height) p1.y = 0;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        ctx.fillStyle = p1.color;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.15 * (1 - dist / 130)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }

        // Mouse proximity link
        const mouseDist = Math.hypot(p1.x - mouseX, p1.y - mouseY);
        if (mouseDist < 160) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.strokeStyle = `rgba(56, 189, 248, ${0.3 * (1 - mouseDist / 160)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      requestAnimationFrame(renderCanvas);
    }
    renderCanvas();
  }

  /* -------------------------------------------------------------
     3. Theme Toggle (Dark / Light)
     ------------------------------------------------------------- */
  const themeToggle = document.getElementById('theme-toggle');
  const iconDark = document.getElementById('theme-icon-dark');
  const iconLight = document.getElementById('theme-icon-light');

  function applyTheme(isLight) {
    if (isLight) {
      document.documentElement.classList.add('light-theme');
      if (iconDark) iconDark.classList.add('hidden');
      if (iconLight) iconLight.classList.remove('hidden');
      localStorage.setItem('shikhar_theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      if (iconDark) iconDark.classList.remove('hidden');
      if (iconLight) iconLight.classList.add('hidden');
      localStorage.setItem('shikhar_theme', 'dark');
    }
  }

  const savedTheme = localStorage.getItem('shikhar_theme');
  if (savedTheme === 'light') {
    applyTheme(true);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      playLaserBlip();
      const isCurrentlyLight = document.documentElement.classList.contains('light-theme');
      applyTheme(!isCurrentlyLight);
      showToast(!isCurrentlyLight ? 'Light Mode Engaged ☀️' : 'Dark Matrix Mode Active 🌙');
    });
  }

  /* -------------------------------------------------------------
     4. Mobile Menu Toggle
     ------------------------------------------------------------- */
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIconBars = document.getElementById('menu-icon-bars');
  const menuIconClose = document.getElementById('menu-icon-close');

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      playLaserBlip();
      const isHidden = mobileMenu.classList.contains('hidden');
      if (isHidden) {
        mobileMenu.classList.remove('hidden');
        menuIconBars.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
      } else {
        mobileMenu.classList.add('hidden');
        menuIconBars.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      }
    });

    // Close on navigation link click
    mobileMenu.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIconBars.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
      });
    });
  }

  /* -------------------------------------------------------------
     5. Project Filtering Tabs
     ------------------------------------------------------------- */
  const filterBtns = document.querySelectorAll('.project-filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      playLaserBlip();
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transition = 'opacity 0.3s ease';
          }, 20);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* -------------------------------------------------------------
     6. Copy Email to Clipboard Actions
     ------------------------------------------------------------- */
  const EMAIL_ADDRESS = 'shikharagarwal1701@gmail.com';

  function copyEmailToClipboard(btnElement, textElement, originalText) {
    navigator.clipboard
      .writeText(EMAIL_ADDRESS)
      .then(() => {
        playCyberSuccess();
        if (textElement) textElement.textContent = 'COPIED TO CLIPBOARD! ✓';
        showToast('Email copied to clipboard! Ready to transmit 🚀');

        if (window.confetti) {
          window.confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#38bdf8', '#10b981', '#ffffff'],
          });
        }

        setTimeout(() => {
          if (textElement) textElement.textContent = originalText;
        }, 2500);
      })
      .catch(() => {
        showToast('Clipboard access denied. Email: ' + EMAIL_ADDRESS);
      });
  }

  const copyEmailBtn = document.getElementById('copy-email-btn');
  const copyEmailText = document.getElementById('copy-email-text');
  if (copyEmailBtn && copyEmailText) {
    copyEmailBtn.addEventListener('click', () => {
      copyEmailToClipboard(copyEmailBtn, copyEmailText, 'Copy Email (shikharagarwal1701@gmail.com)');
    });
  }

  const copyEmailBottomBtn = document.getElementById('copy-email-bottom-btn');
  const copyEmailBottomText = document.getElementById('copy-email-bottom-text');
  if (copyEmailBottomBtn && copyEmailBottomText) {
    copyEmailBottomBtn.addEventListener('click', () => {
      copyEmailToClipboard(copyEmailBottomBtn, copyEmailBottomText, 'COPY EMAIL ADDRESS');
    });
  }

  /* -------------------------------------------------------------
     7. Interactive Ping Nodes Diagnostic / Confetti
     ------------------------------------------------------------- */
  const pingNodesBtn = document.getElementById('ping-nodes-btn');
  if (pingNodesBtn) {
    pingNodesBtn.addEventListener('click', () => {
      playCyberSuccess();
      pingNodesBtn.innerHTML = `<i data-lucide="refresh-cw" class="w-3.5 h-3.5 animate-spin"></i> <span>DIAGNOSTIC OK</span>`;
      if (window.lucide) window.lucide.createIcons();

      showToast('All 9 Global Branch Nodes: 100% HEALTHY (0 SEV-1) ⚡');

      if (window.confetti) {
        window.confetti({
          particleCount: 75,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#34d399', '#f59e0b', '#a855f7'],
        });
      }

      setTimeout(() => {
        pingNodesBtn.innerHTML = `<i data-lucide="activity" class="w-3.5 h-3.5"></i> <span>PING CLUSTER</span>`;
        if (window.lucide) window.lucide.createIcons();
      }, 3000);
    });
  }

  /* -------------------------------------------------------------
     8. Command Palette (Cmd+K / Ctrl+K)
     ------------------------------------------------------------- */
  const cmdModal = document.getElementById('cmd-palette-modal');
  const cmdTriggerBtn = document.getElementById('cmd-trigger-btn');
  const cmdCloseBtn = document.getElementById('cmd-close-btn');
  const cmdInput = document.getElementById('cmd-input');
  const cmdResults = document.getElementById('cmd-results');

  function openCmdPalette() {
    if (!cmdModal) return;
    playLaserBlip();
    cmdModal.classList.remove('hidden');
    if (cmdInput) {
      cmdInput.value = '';
      cmdInput.focus();
    }
  }

  function closeCmdPalette() {
    if (!cmdModal) return;
    cmdModal.classList.add('hidden');
  }

  if (cmdTriggerBtn) {
    cmdTriggerBtn.addEventListener('click', openCmdPalette);
  }
  if (cmdCloseBtn) {
    cmdCloseBtn.addEventListener('click', closeCmdPalette);
  }

  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (cmdModal && cmdModal.classList.contains('hidden')) {
        openCmdPalette();
      } else {
        closeCmdPalette();
      }
    }
    if (e.key === 'Escape' && cmdModal && !cmdModal.classList.contains('hidden')) {
      closeCmdPalette();
    }
  });

  if (cmdModal) {
    cmdModal.addEventListener('click', (e) => {
      if (e.target === cmdModal) closeCmdPalette();
    });
  }

  // Filter commands inside palette
  if (cmdInput && cmdResults) {
    const cmdItems = cmdResults.querySelectorAll('.cmd-item');
    cmdInput.addEventListener('input', () => {
      const q = cmdInput.value.toLowerCase().trim();
      cmdItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? 'flex' : 'none';
      });
    });

    cmdItems.forEach((item) => {
      item.addEventListener('click', () => {
        const action = item.getAttribute('data-action');
        const target = item.getAttribute('data-target');

        closeCmdPalette();

        if (action === 'goto' && target) {
          const el = document.querySelector(target);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'copy-email') {
          copyEmailToClipboard(null, null, '');
        } else if (action === 'ping-nodes') {
          if (pingNodesBtn) pingNodesBtn.click();
        } else if (action === 'open-github') {
          window.open('https://github.com/shikharagrawal17/', '_blank');
        }
      });
    });
  }

  /* -------------------------------------------------------------
     9. Toast Notification Engine
     ------------------------------------------------------------- */
  function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'hud-toast';
    toast.innerHTML = `<span class="pulse-dot-sm"></span><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
});
