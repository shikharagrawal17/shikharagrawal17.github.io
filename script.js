/**
 * BLOOMBERG TERMINAL & FINANCIAL INTERACTION ENGINE — SHIKHAR AGARWAL
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 2. Interactive Bloomberg Command Line (<GO> Engine)
  const cmdInput = document.getElementById('terminal-cmd-input');
  const goBtn = document.getElementById('terminal-go-btn');

  function executeBloombergCommand(rawCmd) {
    const cmd = rawCmd.trim().toUpperCase().replace('<GO>', '').trim();
    if (!cmd) return;

    switch (cmd) {
      case 'FX':
      case 'EXP':
      case 'EXPERIENCE':
      case 'WELLS':
        navigateToSection('#experience');
        showTerminalToast('DESK 02: Wells Fargo FX Money Movement Loaded');
        break;

      case 'MBS':
      case 'QUANT':
      case 'LSTM':
      case 'CPR':
        navigateToSection('#mbs-lab');
        showTerminalToast('DESK 03: Interactive MBS Prepayment Lab Active');
        break;

      case 'PROJECTS':
      case 'CODE':
      case 'MCP':
        navigateToSection('#projects');
        showTerminalToast('DESK 04: Systems & Agentic AI Projects Displayed');
        break;

      case 'STACK':
      case 'SKILLS':
        navigateToSection('#skills');
        showTerminalToast('DESK 05: Technical Stack Matrix Active');
        break;

      case 'CFA':
      case 'COEP':
      case 'EDU':
      case 'ABOUT':
        navigateToSection('#education');
        showTerminalToast('DESK 06: Academic & CFA Credentials Loaded');
        break;

      case 'MSG':
      case 'CONTACT':
      case 'MAIL':
        navigateToSection('#contact');
        showTerminalToast('DESK 07: Message Transmission Desk Active');
        break;

      case 'HELP':
        showTerminalToast('COMMANDS: FX, MBS, MCP, CFA, EXP, PROJECTS, STACK, MSG');
        break;

      default:
        showTerminalToast(`UNKNOWN SECURITY / COMMAND: "${cmd}". TYPE HELP <GO>`);
        break;
    }

    if (cmdInput) cmdInput.value = '';
  }

  window.runCommand = function(cmd) {
    executeBloombergCommand(cmd);
  };

  if (goBtn && cmdInput) {
    goBtn.addEventListener('click', () => {
      executeBloombergCommand(cmdInput.value);
    });

    cmdInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        executeBloombergCommand(cmdInput.value);
      }
    });
  }

  function navigateToSection(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // 3. Interactive MBS Prepayment & Yield Shift Simulator
  const rateSlider = document.getElementById('rate-slider');
  const rateShiftVal = document.getElementById('rate-shift-val');
  const cprVal = document.getElementById('cpr-val');
  const durationVal = document.getElementById('duration-val');
  const convexityVal = document.getElementById('convexity-val');
  const modelStatusText = document.getElementById('model-status-text');

  if (rateSlider) {
    rateSlider.addEventListener('input', (e) => {
      const shift = parseInt(e.target.value, 10);
      
      // Update label
      if (shift > 0) {
        rateShiftVal.textContent = `+${shift} bps (Rate Hike)`;
        rateShiftVal.style.color = '#ff4d4d';
      } else if (shift < 0) {
        rateShiftVal.textContent = `${shift} bps (Rate Cut / Refi Wave)`;
        rateShiftVal.style.color = '#00d26a';
      } else {
        rateShiftVal.textContent = `0 bps (Neutral Benchmark)`;
        rateShiftVal.style.color = '#ff9900';
      }

      // Non-linear MBS Prepayment CPR & Duration formulas
      // Negative convexity: Rate Drop => Prepayments surge drastically (refinancing)
      let cpr, dur, note;

      if (shift < 0) {
        // Rate Cut: CPR spikes, Duration shortens (Contraction Risk)
        const factor = Math.abs(shift) / 25;
        cpr = (6.8 + Math.pow(factor, 1.45) * 3.2).toFixed(1);
        dur = Math.max(1.8, (5.42 - factor * 0.42)).toFixed(2);
        note = `Heavy refinancing incentive detected. Prepayment CPR surges to ${cpr}%. Bond duration contracts.`;
        if (convexityVal) {
          convexityVal.textContent = 'High Contraction Risk';
          convexityVal.className = 'm-val red-text';
        }
      } else if (shift > 0) {
        // Rate Hike: CPR drops (Lock-in effect), Duration lengthens (Extension Risk)
        const factor = shift / 25;
        cpr = Math.max(1.5, (6.8 - factor * 0.65)).toFixed(1);
        dur = (5.42 + factor * 0.35).toFixed(2);
        note = `Mortgage lock-in effect active. Prepayment speeds drop to ${cpr}%. Bond duration extends to ${dur} yrs.`;
        if (convexityVal) {
          convexityVal.textContent = 'Extension Risk (Lock-In)';
          convexityVal.className = 'm-val amber-text';
        }
      } else {
        cpr = '6.8';
        dur = '5.42';
        note = 'Balanced prepayment trajectory. Normal economic amortization.';
        if (convexityVal) {
          convexityVal.textContent = 'Negative Convexity';
          convexityVal.className = 'm-val red-text';
        }
      }

      if (cprVal) cprVal.textContent = `${cpr}% CPR`;
      if (durationVal) durationVal.textContent = `${dur} Yrs`;
      if (modelStatusText) modelStatusText.textContent = note;
    });
  }

  // 4. Email Copy Action
  const EMAIL = 'shikharagarwal1701@gmail.com';

  function copyEmail(btnId, textId) {
    const btn = document.getElementById(btnId);
    const txt = document.getElementById(textId);
    if (!btn) return;

    btn.addEventListener('click', () => {
      navigator.clipboard.writeText(EMAIL).then(() => {
        const orig = txt ? txt.textContent : '';
        if (txt) txt.textContent = 'COPIED TO CLIPBOARD ✓';
        showTerminalToast(`EMAIL COPIED: ${EMAIL} [CONFIRMED]`);

        if (window.confetti) {
          window.confetti({
            particleCount: 30,
            spread: 50,
            origin: { y: 0.8 },
            colors: ['#ff9900', '#00d26a', '#ffffff']
          });
        }

        setTimeout(() => {
          if (txt) txt.textContent = orig;
        }, 2200);
      });
    });
  }

  copyEmail('copy-email-btn', 'copy-text');
  copyEmail('copy-email-bottom-btn', 'copy-bottom-text');

  // 5. Terminal Toast Feedback
  function showTerminalToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerHTML = `<span class="pulse-dot"></span> <span>${msg}</span>`;
    toast.style.display = 'flex';
    toast.style.alignItems = 'center';
    toast.style.gap = '8px';

    setTimeout(() => {
      toast.style.display = 'none';
    }, 2800);
  }
});
