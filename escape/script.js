document.addEventListener('DOMContentLoaded', () => {
  // ================= 极简音效引擎 =================
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  function playClickSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.05);
    gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
    osc.start(); osc.stop(audioCtx.currentTime + 0.05);
  }

  function playErrorSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.15);
    osc.start(); osc.stop(audioCtx.currentTime + 0.15);
  }

  function playTypingSound() {
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode); gainNode.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.02);
    gainNode.gain.setValueAtTime(0.015, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.02);
    osc.start(); osc.stop(audioCtx.currentTime + 0.02);
  }

  // ================= 崩坏特效逻辑 =================
  let glitchOsc, glitchIntervalData;
  function startGlitch() {
    document.body.classList.add('glitch-active');
    if(audioCtx.state === 'suspended') audioCtx.resume();
    
    glitchOsc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    glitchOsc.connect(gain); gain.connect(audioCtx.destination);
    glitchOsc.type = 'sine';
    glitchOsc.frequency.value = 6000; 
    gain.gain.value = 0.03;
    glitchOsc.start();

    glitchIntervalData = setInterval(() => {
        const div = document.createElement('div');
        div.className = 'glitch-data';
        div.style.left = Math.random() * 100 + 'vw';
        div.style.top = Math.random() * 100 + 'vh';
        div.textContent = "ERR_SYNC_" + Math.random().toString(36).substring(2, 10).toUpperCase();
        document.getElementById('glitch-overlay').appendChild(div);
        
        const tOsc = audioCtx.createOscillator();
        const tGain = audioCtx.createGain();
        tOsc.connect(tGain); tGain.connect(audioCtx.destination);
        tOsc.type = 'square'; tOsc.frequency.value = 100 + Math.random() * 800;
        tGain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        tGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
        tOsc.start(); tOsc.stop(audioCtx.currentTime + 0.05);

        setTimeout(() => div.remove(), 150);
    }, 80);
  }

  function stopGlitch() {
    document.body.classList.remove('glitch-active');
    if(glitchOsc) { glitchOsc.stop(); glitchOsc.disconnect(); glitchOsc = null; }
    if(glitchIntervalData) { clearInterval(glitchIntervalData); glitchIntervalData = null; }
    document.getElementById('glitch-overlay').innerHTML = '';
  }

  document.querySelectorAll('.spring-btn').forEach(btn => {
    btn.addEventListener('mousedown', playClickSound);
  });

  // ================= 粒子螺旋与代码瀑布 =================
  const SPIRAL_PARTICLE_COUNT = 700; // 调这个值可增加/减少白灰旋转粒子数量
  const spiralBg = document.getElementById('spiral-bg');
  if(spiralBg) {
      for(let i=0; i<SPIRAL_PARTICLE_COUNT; i++) {
          let p = document.createElement('div');
          p.className = 'spiral-particle';
          let size = Math.random() * 7 + 3; 
          p.style.width = size + 'px';
          p.style.height = size + 'px';
          p.style.background = ['#ffffff', '#e5e7eb', '#9ca3af', '#4b5563', '#d1d5db'][Math.floor(Math.random() * 5)];
          p.style.setProperty('--angle', Math.random() * 360 + 'deg');
          p.style.setProperty('--duration', (Math.random() * 20 + 15) + 's');
          p.style.setProperty('--delay', '-' + (Math.random() * 20) + 's');
          spiralBg.appendChild(p);
      }
  }

  function initCodeStream(containerId) {
      const container = document.getElementById(containerId);
      if (!container) return;
      container.innerHTML = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
      const cols = Math.floor(container.clientWidth / 20) || 30;
      for (let i=0; i<cols; i++) {
          let col = document.createElement('div');
          col.className = 'code-column';
          col.style.left = `${i * 20}px`;
          col.style.animationDuration = `${Math.random() * 4 + 3}s`;
          col.style.animationDelay = `${Math.random() * 5}s`;
          
          let str = '';
          for(let j=0; j<25; j++) str += chars[Math.floor(Math.random()*chars.length)] + '\n';
          col.innerText = str;
          
          setInterval(() => {
              if (Math.random() > 0.6) {
                  let newStr = '';
                  for(let j=0; j<25; j++) newStr += chars[Math.floor(Math.random()*chars.length)] + '\n';
                  col.innerText = newStr;
              }
          }, 600);

          container.appendChild(col);
      }
  }

  // ================= 打字机系统 =================
  let typewriterSessionId = 0;
  async function typeWriterEffect(elementId, text, speed = 35) {
    const el = document.getElementById(elementId);
    if (!el) return;
    typewriterSessionId++;
    const currentSession = typewriterSessionId;
    el.innerHTML = '';
    
    for (let i = 0; i < text.length; i++) {
      if (currentSession !== typewriterSessionId) break;
      el.innerHTML += text.charAt(i);
      
      if (text.charAt(i) !== ' ' && i % 2 === 0) playTypingSound();
      
      el.parentElement.scrollTop = el.parentElement.scrollHeight;
      await new Promise(r => setTimeout(r, speed));
    }
  }

  // ================= 密码配置与文案 =================
  const PASS_MAIN = "DOUBLEE";
  const PASS_COMMS = "EVT0320";
  const AUTH_LV3 = "1425";
  const PASS_EVIDENCE = "03/02"; 
  
  const TEXT_MAIN = "You’ve restored the power. Good. I am Elena. I cannot explain everything yet. Open the first level of the refrigerator first. That is where we begin. The code is the day Edith was waiting for—her grandchild’s due date. Look closely at her sewing workspace; the month and the day she was counting down to are hidden among the threads.";
  const TEXT_AUTH_1 = "There are four items in the fridge that do not belong. Clues beside the lock on the second layer will help you identify them. Find these items, then place them into the washbasin one by one and clean them in sequence to reveal what is hidden. Only then can you stand in her footsteps and see the next lock’s key. Once you have the code, retrieve the items — their purpose is not yet finished.";
  const TEXT_AUTH_2 = "Do you see the four icons beneath the refrigerator wheel? They are the four shackles that bound her life. There is no absolute weight here, only relative suffering. Understand their burden in relation to one another, and you will be able to turn the final lock.";
  const TEXT_AUTH_3 = "A frozen female body… proof of an ending. But we still need a killer. One final step remains. After that, I will show you everything I know about that day—everything I heard, and everything I saw.\nNow, please enter the code hidden in the image to access the communication system.";
  const TEXT_EVIDENCE = "You have seen the life Edith lived. Whether you truly found what people call the truth no longer matters. She has already left everything behind, and my purpose ends here as well. I can no longer keep anything for her. \nOne last thing: submit the reference numbers of the two most important pieces of evidence. After that, you may leave this place and collect your payment. Goodbye, cleaner.";

  const unlockedAuths = new Set();

  // ================= 元素引用 =================
  const authScreen = document.getElementById('auth-screen');
  const appScreen = document.getElementById('app-screen');
  
  const loginForm = document.getElementById('login-form');
  const passcodeInput = document.getElementById('passcode');
  const loginBtn = document.getElementById('login-btn');
  const authMessage = document.getElementById('auth-message');
  const toggleVisBtn = document.getElementById('toggle-visibility');
  const iconEye = document.getElementById('icon-eye');
  const iconEyeOff = document.getElementById('icon-eye-off');

  const navItems = document.querySelectorAll('.nav-item[data-target]');
  const views = document.querySelectorAll('.view-layer');
  const logoutBtn = document.getElementById('logout-btn');

  const uniLockOverlay = document.getElementById('universal-lock-overlay');
  const uniLockTitle = document.getElementById('uni-lock-title');
  const uniLockSub = document.getElementById('uni-lock-sub');
  const uniLoginForm = document.getElementById('uni-login-form');
  const uniPasscodeInput = document.getElementById('uni-passcode');
  const uniAuthMessage = document.getElementById('uni-auth-message');
  const accessBtns = document.querySelectorAll('.access-btn');
  let currentExpectedAuth = "";
  let currentAuthTargetText = "";

  const commsLockOverlay = document.getElementById('comms-lock-overlay');
  const commsPrematureGate = document.getElementById('comms-premature-gate');
  const chatLayoutMain = document.getElementById('chat-layout-main');
  const commsLoginForm = document.getElementById('comms-login-form');
  const commsPasscodeWrap = document.getElementById('comms-passcode-wrap');
  const commsPasscodeSlots = document.getElementById('comms-passcode-slots');
  const commsAuthMessage = document.getElementById('comms-auth-message');
  const COMMS_CODE_LEN = PASS_COMMS.length;

  function getCommsSlotInputs() {
    return commsPasscodeSlots ? [...commsPasscodeSlots.querySelectorAll('.comms-slot-input')] : [];
  }

  function updateCommsSlotChars() {
    getCommsSlotInputs().forEach((inp) => {
      const cell = inp.closest('.comms-slot-cell');
      if (!cell) return;
      let v = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (v.length > 1) v = v.slice(0, 1);
      inp.value = v;
      cell.classList.toggle('has-char', !!v);
    });
  }

  function clearCommsSlots() {
    getCommsSlotInputs().forEach((inp) => {
      inp.value = '';
      const cell = inp.closest('.comms-slot-cell');
      if (cell) cell.classList.remove('has-char');
    });
  }

  function getCommsPasscodeValue() {
    return getCommsSlotInputs().map((inp) => inp.value).join('');
  }

  function wireCommsSlotInputs() {
    const inputs = getCommsSlotInputs();
    inputs.forEach((inp, i) => {
      inp.addEventListener('input', () => {
        let v = inp.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        if (v.length > 1) {
          const spread = v.slice(0, COMMS_CODE_LEN);
          spread.split('').forEach((ch, j) => {
            if (inputs[i + j]) inputs[i + j].value = ch;
          });
          updateCommsSlotChars();
          const nextFocus = Math.min(i + spread.length - 1, COMMS_CODE_LEN - 1);
          inputs[nextFocus].focus();
        } else {
          inp.value = v;
          updateCommsSlotChars();
          if (v && i < inputs.length - 1) inputs[i + 1].focus();
        }
        if (commsPasscodeWrap) commsPasscodeWrap.classList.remove('shake-error');
        commsAuthMessage.textContent = '';
      });
      inp.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !inp.value && i > 0) {
          e.preventDefault();
          inputs[i - 1].value = '';
          const prevCell = inputs[i - 1].closest('.comms-slot-cell');
          if (prevCell) prevCell.classList.remove('has-char');
          inputs[i - 1].focus();
          updateCommsSlotChars();
        }
      });
      inp.addEventListener('paste', (e) => {
        if (i !== 0) return;
        e.preventDefault();
        const raw = (e.clipboardData || window.clipboardData).getData('text') || '';
        const chars = raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, COMMS_CODE_LEN);
        inputs.forEach((field, j) => {
          field.value = chars[j] || '';
        });
        updateCommsSlotChars();
        const focusIdx = Math.min(Math.max(chars.length - 1, 0), COMMS_CODE_LEN - 1);
        inputs[focusIdx].focus();
        if (commsPasscodeWrap) commsPasscodeWrap.classList.remove('shake-error');
        commsAuthMessage.textContent = '';
      });
    });
  }

  function triggerCommsError() {
    playErrorSound();
    commsAuthMessage.textContent = "Access Denied";
    if (commsPasscodeWrap) void commsPasscodeWrap.offsetWidth;
    if (commsPasscodeWrap) commsPasscodeWrap.classList.add('shake-error');
    clearCommsSlots();
    const first = getCommsSlotInputs()[0];
    if (first) first.focus();
  }

  function updateCommsGateState() {
    const lv3Unlocked = unlockedAuths.has(AUTH_LV3);
    if (commsPrematureGate) {
      commsPrematureGate.classList.toggle('hidden', lv3Unlocked);
    }
    if (commsLockOverlay) {
      commsLockOverlay.style.display = lv3Unlocked ? '' : 'none';
    }
  }

  const evidenceLockOverlay = document.getElementById('security-lock-overlay');
  const securityPrematureGate = document.getElementById('security-premature-gate');

  function updateTruthReportGateState() {
    const commsUnlocked = commsLockOverlay && commsLockOverlay.classList.contains('unlocked');
    if (securityPrematureGate) {
      securityPrematureGate.classList.toggle('hidden', commsUnlocked);
    }
    if (evidenceLockOverlay) {
      evidenceLockOverlay.style.display = commsUnlocked ? '' : 'none';
    }
  }
  const evidenceLoginForm = document.getElementById('evidence-login-form');
  const evidenceInput1 = document.getElementById('evidence-passcode-1');
  const evidenceInput2 = document.getElementById('evidence-passcode-2');
  const evidenceAuthMessage = document.getElementById('evidence-auth-message');

  const navTruth = document.querySelector('[data-target="security-view"]');

  const audioMain = document.getElementById('audio-main');
  const audioDashboard = document.getElementById('audio-dashboard');
  const dashboardAiWrapper = document.getElementById('dashboard-ai-wrapper');
  const securityVideoArea = document.getElementById('security-video-area');
  const securityFinalVideo = document.getElementById('security-final-video');

  const DASHBOARD_SCENES = {
    prologue: { text: TEXT_MAIN, audioId: 'main', src: 'sounds/Prologue.mp3' },
    '0423': { text: TEXT_AUTH_1, audioId: 'dash', src: 'sounds/Lv1.mp3' },
    '3721': { text: TEXT_AUTH_2, audioId: 'dash', src: 'sounds/Lv2.mp3' },
    '1425': { text: TEXT_AUTH_3, audioId: 'dash', src: 'sounds/Lv3.mp3' },
  };

  let dashboardActiveScene = null;
  let dashboardReplayReady = false;
  let dashboardIsPlaying = false;

  let securityReplayReady = false;
  let securityIsPlaying = false;

  function handleDashboardAudioEnded(e) {
    const scene = dashboardActiveScene ? DASHBOARD_SCENES[dashboardActiveScene] : null;
    if (!scene) return;
    const expectedEl = scene.audioId === 'main' ? audioMain : audioDashboard;
    if (e.target !== expectedEl) return;
    dashboardIsPlaying = false;
    dashboardReplayReady = true;
    if (dashboardAiWrapper) dashboardAiWrapper.classList.add('ai-replay-ready');
  }

  function playDashboardScene(sceneKey) {
    const scene = DASHBOARD_SCENES[sceneKey];
    if (!scene || !dashboardAiWrapper) return;
    dashboardIsPlaying = true;
    dashboardReplayReady = false;
    dashboardActiveScene = sceneKey;
    dashboardAiWrapper.classList.remove('ai-replay-ready');

    if (audioMain) {
      audioMain.pause();
      audioMain.currentTime = 0;
    }
    if (audioDashboard) {
      audioDashboard.pause();
      audioDashboard.currentTime = 0;
    }

    const audioEl = scene.audioId === 'main' ? audioMain : audioDashboard;
    if (audioEl) {
      audioEl.src = scene.src;
      audioEl.currentTime = 0;
      const p = audioEl.play();
      if (p !== undefined) p.catch(() => {});
    }
    typeWriterEffect('dashboard-typewriter', scene.text);
  }

  if (audioMain) audioMain.addEventListener('ended', handleDashboardAudioEnded);
  if (audioDashboard) audioDashboard.addEventListener('ended', handleDashboardAudioEnded);

  if (dashboardAiWrapper) {
    dashboardAiWrapper.addEventListener('click', (e) => {
      if (!dashboardReplayReady || dashboardIsPlaying || !dashboardActiveScene) return;
      e.stopPropagation();
      playDashboardScene(dashboardActiveScene);
    });
  }

  function handleSecurityVideoEnded() {
    securityIsPlaying = false;
    securityReplayReady = true;
    if (securityVideoArea) securityVideoArea.classList.add('ai-replay-ready');
  }

  function playEvidenceSequence() {
    securityIsPlaying = true;
    securityReplayReady = false;
    if (securityVideoArea) securityVideoArea.classList.remove('ai-replay-ready');

    if (securityFinalVideo) {
      securityFinalVideo.style.display = 'block';
      securityFinalVideo.pause();
      securityFinalVideo.currentTime = 0;
      const p = securityFinalVideo.play();
      if (p !== undefined) p.catch(() => {});
    }
  }

  if (securityFinalVideo) securityFinalVideo.addEventListener('ended', handleSecurityVideoEnded);

  if (securityVideoArea) {
    securityVideoArea.addEventListener('click', (e) => {
      if (!securityReplayReady || securityIsPlaying) return;
      e.stopPropagation();
      playEvidenceSequence();
    });
  }

  chatLayoutMain.classList.add('locked-blur');

  wireCommsSlotInputs();
  updateCommsSlotChars();
  updateCommsGateState();
  updateTruthReportGateState();

  [uniLockOverlay, commsLockOverlay, evidenceLockOverlay].forEach(overlay => {
    overlay.addEventListener('mousedown', (e) => {
      if (e.target === overlay) {
        overlay.classList.add('unlocked');
        if (overlay === evidenceLockOverlay) stopGlitch();
        if (overlay === commsLockOverlay) {
          clearCommsSlots();
          if (commsPasscodeWrap) commsPasscodeWrap.classList.remove('shake-error');
        } else {
          overlay.querySelectorAll('input').forEach((input) => {
            input.value = '';
            input.classList.remove('shake-error');
          });
        }
        const msgs = overlay.querySelectorAll('.error-text');
        msgs.forEach((msg) => (msg.textContent = ''));
      }
    });
  });

  toggleVisBtn.addEventListener('click', () => {
    if (passcodeInput.type === 'password') {
      passcodeInput.type = 'text'; iconEyeOff.style.display = 'none'; iconEye.style.display = 'block';
    } else {
      passcodeInput.type = 'password'; iconEye.style.display = 'none'; iconEyeOff.style.display = 'block';
    }
  });

  const clearShake = (input, msgObj) => { input.classList.remove('shake-error'); msgObj.textContent = ""; };
  passcodeInput.addEventListener('input', () => clearShake(passcodeInput, authMessage));
  uniPasscodeInput.addEventListener('input', () => clearShake(uniPasscodeInput, uniAuthMessage));

  const triggerError = (input, msgObj) => {
    playErrorSound();
    msgObj.textContent = "Access Denied";
    void input.offsetWidth;
    input.classList.add('shake-error');
    input.value = "";
    input.focus();
  };

  // ================= 1. 登录验证 =================
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passcodeInput.value.trim() === PASS_MAIN) {
      authMessage.textContent = ""; loginBtn.textContent = "Unlocking...";
      setTimeout(() => {
        authScreen.classList.remove('screen-active');
        appScreen.classList.add('screen-active');
        passcodeInput.value = ""; passcodeInput.type = 'password';
        iconEye.style.display = 'none'; iconEyeOff.style.display = 'block';
        loginBtn.textContent = "Unlock Residence";
        if (audioCtx.state === 'suspended') audioCtx.resume();
        
        document.getElementById('dashboard-stream').style.display = 'block';
        initCodeStream('dashboard-stream');
        document.getElementById('dashboard-ai-wrapper').style.display = 'flex';
        document.getElementById('dashboard-ai-wrapper').classList.add('speaking');
        document.querySelectorAll('#dashboard-video-area .placeholder-icon, #dashboard-video-area .placeholder-text').forEach(i => i.style.display = 'none');
        
        document.querySelector('[data-auth="0423"]').classList.add('guide-pulse');

        playDashboardScene('prologue');
      }, 400);
    } else triggerError(passcodeInput, authMessage);
  });

  // ================= 2. 主控台权限操作 =================
  accessBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentExpectedAuth = btn.getAttribute('data-auth');
      
      if (currentExpectedAuth === "0423") {
          uniLockTitle.textContent = "WAITING FOR SYNC: LAYER 1";
          uniLockSub.textContent = "To proceed with the sync, I need the code you used to open the Refrigerator’s First Layer.";
          currentAuthTargetText = TEXT_AUTH_1;
      } else if (currentExpectedAuth === "3721") {
          uniLockTitle.textContent = "DATA ARCHIVING: LAYER 2";
          uniLockSub.textContent = "The code combined from the videos unlocks both this iPad and the Refrigerator's Second Layer.";
          currentAuthTargetText = TEXT_AUTH_2;
      } else if (currentExpectedAuth === "1425") {
          uniLockTitle.textContent = "CALIBRATION: LAYER 3";
          uniLockSub.textContent = "Place the 4 items on the scale. Use the projected logic formulas to calculate the final value.";
          currentAuthTargetText = TEXT_AUTH_3;
      }
      
      if (unlockedAuths.has(currentExpectedAuth)) {
          playDashboardScene(currentExpectedAuth);
      } else {
          uniLockOverlay.classList.remove('unlocked');
          uniPasscodeInput.focus();
      }
    });
  });

  uniLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (uniPasscodeInput.value.trim() === currentExpectedAuth) {
      uniAuthMessage.textContent = "";
      uniLockOverlay.classList.add('unlocked');
      uniPasscodeInput.value = "";
      unlockedAuths.add(currentExpectedAuth);
      playDashboardScene(currentExpectedAuth);

      if (currentExpectedAuth === "0423") {
          document.querySelector('[data-auth="0423"]').classList.remove('guide-pulse');
          document.querySelector('[data-auth="3721"]').classList.add('guide-pulse');
      } else if (currentExpectedAuth === "3721") {
          document.querySelector('[data-auth="3721"]').classList.remove('guide-pulse');
          document.querySelector('[data-auth="1425"]').classList.add('guide-pulse');
      } else if (currentExpectedAuth === AUTH_LV3) {
          document.querySelector('[data-auth="' + AUTH_LV3 + '"]').classList.remove('guide-pulse');
          document.querySelector('[data-target="comms-view"]').classList.add('guide-pulse');
      }

      updateCommsGateState();
      updateTruthReportGateState();

    } else triggerError(uniPasscodeInput, uniAuthMessage);
  });

  // ================= 3. Comms 解锁 =================
  commsLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (getCommsPasscodeValue() === PASS_COMMS) {
      commsAuthMessage.textContent = "";
      commsLockOverlay.classList.add('unlocked');
      chatLayoutMain.classList.remove('locked-blur');
      clearCommsSlots();
      if (commsPasscodeWrap) commsPasscodeWrap.classList.remove('shake-error');
      updateTruthReportGateState();

      document.querySelector('[data-target="comms-view"]').classList.remove('guide-pulse');
      navTruth.classList.add('guide-pulse');
    } else triggerCommsError();
  });

  // ================= 4. Truth Report 证据提交 =================
  evidenceInput1.addEventListener('input', (e) => {
    evidenceInput1.classList.remove('shake-error');
    evidenceInput2.classList.remove('shake-error');
    evidenceAuthMessage.textContent = "";
    if (e.target.value.length === 2) evidenceInput2.focus(); 
  });

  evidenceInput2.addEventListener('input', () => {
    evidenceInput1.classList.remove('shake-error');
    evidenceInput2.classList.remove('shake-error');
    evidenceAuthMessage.textContent = "";
  });

  evidenceLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = evidenceInput1.value.trim() + "/" + evidenceInput2.value.trim();
    if (val === PASS_EVIDENCE) {
      evidenceAuthMessage.textContent = "";
      evidenceLockOverlay.classList.add('unlocked');
      evidenceInput1.value = ""; evidenceInput2.value = "";
      
      stopGlitch(); 
      navTruth.classList.remove('guide-pulse');
      
      document.querySelectorAll('#security-video-area .placeholder-icon, #security-video-area .placeholder-text').forEach(i => i.style.display = 'none');
      
      playEvidenceSequence();

    } else {
      playErrorSound();
      evidenceAuthMessage.textContent = "Access Denied";
      void evidenceInput1.offsetWidth; void evidenceInput2.offsetWidth;
      evidenceInput1.classList.add('shake-error'); evidenceInput2.classList.add('shake-error');
      evidenceInput1.value = ""; evidenceInput2.value = "";
      evidenceInput1.focus();
    }
  });

  // 侧边栏导航控制
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      const targetId = item.getAttribute('data-target');
      views.forEach(view => {
        if (view.id === targetId) view.classList.add('view-active');
        else view.classList.remove('view-active');
      });

      if (targetId === 'security-view' && !evidenceLockOverlay.classList.contains('unlocked')) {
          startGlitch();
      } else {
          stopGlitch();
      }

      updateCommsGateState();
      updateTruthReportGateState();
    });
  });

  logoutBtn.addEventListener('click', () => {
    appScreen.classList.remove('screen-active');
    authScreen.classList.add('screen-active');
    navItems.forEach(n => n.classList.remove('active'));
    document.querySelector('.nav-item[data-target="home-view"]').classList.add('active');
    views.forEach(view => {
      if (view.id === 'home-view') view.classList.add('view-active');
      else view.classList.remove('view-active');
    });
    
    stopGlitch();
    dashboardActiveScene = null;
    dashboardReplayReady = false;
    dashboardIsPlaying = false;
    securityReplayReady = false;
    securityIsPlaying = false;
    if (dashboardAiWrapper) dashboardAiWrapper.classList.remove('ai-replay-ready');
    if (securityVideoArea) securityVideoArea.classList.remove('ai-replay-ready');
    if (audioMain) {
      audioMain.pause();
      audioMain.currentTime = 0;
    }
    if (audioDashboard) {
      audioDashboard.pause();
      audioDashboard.currentTime = 0;
    }
    if (securityFinalVideo) {
      securityFinalVideo.pause();
      securityFinalVideo.currentTime = 0;
      securityFinalVideo.style.display = 'none';
    }
    document.getElementById('dashboard-typewriter').innerHTML = '';
    unlockedAuths.clear();

    commsLockOverlay.classList.remove('unlocked');
    evidenceLockOverlay.classList.remove('unlocked'); 
    uniLockOverlay.classList.add('unlocked');
    chatLayoutMain.classList.add('locked-blur');
    clearCommsSlots();
    if (commsPasscodeWrap) commsPasscodeWrap.classList.remove('shake-error');
    updateCommsGateState();
    updateTruthReportGateState();
    document.getElementById('chat-empty-state').style.display = 'flex';
    document.getElementById('chat-active-window').style.display = 'none';
  });
  
  // ================= 聊天数据渲染 =================
  const chatContactsList = document.getElementById('chat-contacts-list');
  const chatEmptyState = document.getElementById('chat-empty-state');
  const chatActiveWindow = document.getElementById('chat-active-window');
  const activeChatAvatar = document.getElementById('active-chat-avatar');
  const activeChatName = document.getElementById('active-chat-name');
  const chatHistoryContainer = document.getElementById('chat-history-container');
  const chatInputText = document.getElementById('chat-input-text');
  const chatSendBtn = document.getElementById('chat-send-btn');

  const chatData = {
    martha: [
      { type: 'text', text: "Edith, did you see the news? Another one from the old staff is missing. Just vanished.", time: "14:32" },
      { type: 'text', text: "Harrington’s running for council. They’re cleaning up anyone who remembers the old days.", time: "14:35" },
      { type: 'text', text: "I saw some strange men near my flat yesterday.", time: "14:37" },
      { type: 'text', text: "Please be careful. They’ve been asking about you specifically. Don't trust anyone.", time: "14:39" }
    ],
    arthur: [
      { type: 'text', text: "Did you take Harrington’s jewellery, Edith? It's all over the news.", time: "16:12" },
      { type: 'text', text: "Don’t lie to me. You worked there for years, I know you kept something to yourself.", time: "16:15" },
      { type: 'text', text: "I need my cut. I'm drowning in debt here.", time: "16:16" },
      { type: 'text', text: "Open the damn door. I’m coming over right now.", time: "16:18" }
    ],
    leo: [
      { type: 'text', text: "Mum, I need to talk to you. Why aren’t you answering your phone?", time: "16:56" },
      { type: 'text', text: "Is Arthur bothering you again? I saw him around the neighbourhood.", time: "17:14" },
      { type: 'text', text: "If he's giving you trouble, you need to tell me. I can call the police.", time: "17:25" },
      { type: 'text', text: "Please reply. I’m getting really worried. I might come over to check on you.", time: "17:30" }
    ],
    unknown: [
      { type: 'image', title: "Severed_Toe.jpg", img: "picture/Toe.PNG", text: "Your son thought he could play with our money. He was wrong.", time: "00:08" },
      { type: 'image', title: "Ultrasound_Scan.jpg", img: "picture/Baby.jpg", text: "Such a happy little family. A baby on the way.", time: "00:09" },
      { type: 'text', text: "Pay his debt, or the next piece we take won't be a toe. Don’t make us ruin it.", time: "00:11" }
    ]
  };

  const readContacts = new Set();
  let elenaTriggered = false;
  const elenaMessages = [
    "I heard fierce arguing and violent impacts, and then the current snapped and everything went dark. When I came back online, she was struggling and crying inside my body, and there was nothing I could do.",
    "When it finally fell quiet, I was opened again. Someone took something out of me, and an old man’s laughter crackled through the phone.",
    "At least, in the deepest part of me, we were in each other’s arms again.",
    "The truth is buried beneath the grime. The floor near the refrigerator still holds the echo of those footsteps.",
    "Use the mop to clear the area; I will recover the surveillance data from the shadows.",
    "After reviewing the surveillance footage and the envelope on the carpet, please enter the Evidence Envelope ID and the Surveillance Clip ID into the submission window to identify the true killer."
  ];

  function renderChatHistory(contactId) {
    const messages = chatData[contactId] || [];
    chatHistoryContainer.innerHTML = '<div class="chat-date-pill">Today, March 20, 2026</div>';
    messages.forEach(msg => {
      const bubble = document.createElement('div');
      bubble.className = `chat-bubble ${msg.type === 'sent' ? 'sent' : 'received'} glass-thick`;
      let contentHtml = '';
      if (msg.type === 'image') {
        if (msg.img) {
          contentHtml = `
          <div class="chat-image-placeholder chat-image-with-photo">
            <img src="${msg.img}" alt="${msg.title || ''}" class="zoomable-image" />
          </div>`;
        } else {
          contentHtml = `
          <div class="chat-image-placeholder">
            <svg class="icon-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
            <span class="text-caption">${msg.title} (Placeholder)</span>
          </div>`;
        }
      }
      contentHtml += `<p class="text-body">${msg.text}</p><span class="chat-time">${msg.time}</span>`;
      bubble.innerHTML = contentHtml;
      chatHistoryContainer.appendChild(bubble);
    });
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
  }

  function sendUserMessage() {
    const text = chatInputText.value.trim();
    if (!text) return;
    const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble sent glass-thick';
    bubble.innerHTML = `<p class="text-body">${text}</p><span class="chat-time">${timeStr}</span>`;
    chatHistoryContainer.appendChild(bubble);
    chatHistoryContainer.scrollTop = chatHistoryContainer.scrollHeight;
    
    const activeBtn = document.querySelector('.chat-contact-item.active');
    if(activeBtn) {
        const cId = activeBtn.getAttribute('data-contact');
        if(chatData[cId]) chatData[cId].push({ type: 'sent', text: text, time: timeStr });
    }
    chatInputText.value = '';
    playClickSound();
  }

  chatSendBtn.addEventListener('click', sendUserMessage);
  chatInputText.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendUserMessage(); });

  async function triggerElenaSequence() {
    const elenaBtn = document.createElement('button');
    elenaBtn.className = 'chat-contact-item glass-thick spring-btn unread';
    elenaBtn.setAttribute('data-contact', 'elena');
    elenaBtn.innerHTML = `
      <div class="contact-avatar" style="background-color: #00bfff;">E</div>
      <div class="contact-info">
        <div class="contact-top">
          <span class="text-title-sm">E.L.E.N.A</span>
          <div class="time-and-badge"><span class="text-caption time-stamp">Now</span><span class="unread-badge">1</span></div>
        </div>
        <span class="text-caption text-preview">...</span>
      </div>
    `;
    chatContactsList.appendChild(elenaBtn);
    chatData['elena'] = [];

    elenaBtn.addEventListener('click', () => {
      document.querySelectorAll('.chat-contact-item').forEach(b => b.classList.remove('active'));
      elenaBtn.classList.add('active'); elenaBtn.classList.remove('unread');
      chatEmptyState.style.display = 'none'; chatActiveWindow.style.display = 'flex';
      activeChatName.textContent = "E.L.E.N.A";
      activeChatAvatar.innerHTML = "E"; activeChatAvatar.style.backgroundColor = "#00bfff";
      renderChatHistory('elena');
    });

    for (let i = 0; i < elenaMessages.length; i++) {
      await new Promise(r => setTimeout(r, 4000));
      const timeStr = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      chatData['elena'].push({ type: 'text', text: elenaMessages[i], time: timeStr });
      
      playTypingSound(); 
      
      elenaBtn.querySelector('.text-preview').textContent = elenaMessages[i];
      elenaBtn.querySelector('.time-stamp').textContent = timeStr;
      
      if (activeChatName.textContent !== 'E.L.E.N.A') {
          elenaBtn.classList.add('unread');
          elenaBtn.querySelector('.unread-badge').textContent = chatData['elena'].length;
      } else {
          renderChatHistory('elena');
      }
      chatContactsList.scrollTop = chatContactsList.scrollHeight;
    }
  }

  document.querySelectorAll('.chat-contact-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.chat-contact-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      btn.classList.remove('unread');
      
      chatEmptyState.style.display = 'none';
      chatActiveWindow.style.display = 'flex';
      
      activeChatName.textContent = btn.querySelector('.text-title-sm').textContent;
      activeChatAvatar.innerHTML = btn.querySelector('.contact-avatar').innerHTML;
      activeChatAvatar.style.backgroundColor = btn.querySelector('.contact-avatar').style.backgroundColor;

      const contactId = btn.getAttribute('data-contact');
      
      if (contactId !== 'elena') readContacts.add(contactId);
      if (readContacts.size === 4 && !elenaTriggered) {
          elenaTriggered = true;
          triggerElenaSequence();
      }
      renderChatHistory(contactId);
    });
  });

  // ================= 图片点击放大（再次点击或点背景关闭；双指缩放 / 单指拖动） =================
  const imageZoomOverlay = document.getElementById('image-zoom-overlay');
  const imageZoomBackdrop = imageZoomOverlay?.querySelector('.image-zoom-backdrop');
  const imageZoomStage = document.getElementById('image-zoom-stage');
  const imageZoomInner = document.getElementById('image-zoom-inner');
  const imageZoomImg = document.getElementById('image-zoom-img');

  if (imageZoomOverlay && imageZoomBackdrop && imageZoomStage && imageZoomInner && imageZoomImg) {
    let zoomTx = 0;
    let zoomTy = 0;
    let zoomScale = 1;
    let minScale = 1;
    let maxScale = 8;
    let pinchBaseDistance = 0;
    let pinchBaseScale = 1;
    let suppressCloseUntil = 0;
    let lastPanX = 0;
    let lastPanY = 0;
    const activePointers = new Map();

    function applyZoomTransform() {
      imageZoomInner.style.transform = `translate(calc(-50% + ${zoomTx}px), calc(-50% + ${zoomTy}px)) scale(${zoomScale})`;
    }

    function clampPan() {
      const w = imageZoomImg.offsetWidth * zoomScale;
      const h = imageZoomImg.offsetHeight * zoomScale;
      const pad = 32;
      const maxX = Math.max(0, (w - window.innerWidth) / 2 + pad);
      const maxY = Math.max(0, (h - window.innerHeight) / 2 + pad);
      zoomTx = Math.max(-maxX, Math.min(maxX, zoomTx));
      zoomTy = Math.max(-maxY, Math.min(maxY, zoomTy));
    }

    function pointerDistance() {
      const pts = [...activePointers.values()];
      if (pts.length < 2) return 0;
      return Math.hypot(pts[0].clientX - pts[1].clientX, pts[0].clientY - pts[1].clientY);
    }

    function layoutZoomImage() {
      const nw = imageZoomImg.naturalWidth;
      const nh = imageZoomImg.naturalHeight;
      if (!nw || !nh) return;
      const pad = 0.96;
      const vw = window.innerWidth * pad;
      const vh = window.innerHeight * pad;
      const fit = Math.min(vw / nw, vh / nh);
      imageZoomImg.style.width = `${nw * fit}px`;
      imageZoomImg.style.height = 'auto';
      zoomScale = 1;
      zoomTx = 0;
      zoomTy = 0;
      minScale = 1;
      maxScale = 8;
      applyZoomTransform();
    }

    function openImageZoom(src) {
      zoomTx = 0;
      zoomTy = 0;
      zoomScale = 1;
      pinchBaseDistance = 0;
      activePointers.clear();
      imageZoomImg.src = src;
      imageZoomOverlay.hidden = false;
      document.body.style.overflow = 'hidden';
      if (imageZoomImg.complete && imageZoomImg.naturalWidth) layoutZoomImage();
    }

    function closeImageZoom() {
      imageZoomOverlay.hidden = true;
      imageZoomImg.src = '';
      document.body.style.overflow = '';
      zoomTx = 0;
      zoomTy = 0;
      zoomScale = 1;
      pinchBaseDistance = 0;
      activePointers.clear();
      imageZoomStage.classList.remove('is-panning');
    }

    imageZoomImg.addEventListener('load', () => {
      layoutZoomImage();
    });

    window.addEventListener('resize', () => {
      if (!imageZoomOverlay.hidden) layoutZoomImage();
    });

    imageZoomBackdrop.addEventListener('click', closeImageZoom);

    imageZoomStage.addEventListener('click', (e) => {
      if (e.target === imageZoomStage) closeImageZoom();
    });

    imageZoomStage.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      activePointers.set(e.pointerId, e);
      try {
        imageZoomStage.setPointerCapture(e.pointerId);
      } catch (_) {}
      if (activePointers.size === 2) {
        pinchBaseDistance = pointerDistance();
        pinchBaseScale = zoomScale;
        suppressCloseUntil = Date.now() + 400;
      } else if (activePointers.size === 1) {
        lastPanX = e.clientX;
        lastPanY = e.clientY;
      }
    });

    imageZoomStage.addEventListener('pointermove', (e) => {
      if (!activePointers.has(e.pointerId)) return;
      activePointers.set(e.pointerId, e);
      if (activePointers.size === 2) {
        e.preventDefault();
        const d = pointerDistance();
        if (pinchBaseDistance > 0) {
          zoomScale = Math.max(minScale, Math.min(maxScale, pinchBaseScale * (d / pinchBaseDistance)));
          suppressCloseUntil = Date.now() + 450;
          applyZoomTransform();
          clampPan();
        }
      } else if (activePointers.size === 1 && zoomScale > 1.02) {
        e.preventDefault();
        zoomTx += e.clientX - lastPanX;
        zoomTy += e.clientY - lastPanY;
        lastPanX = e.clientX;
        lastPanY = e.clientY;
        clampPan();
        applyZoomTransform();
      }
    }, { passive: false });

    imageZoomStage.addEventListener('pointerup', (e) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) {
        pinchBaseDistance = 0;
      }
      if (activePointers.size === 1) {
        const pts = [...activePointers.values()];
        if (pts[0]) {
          lastPanX = pts[0].clientX;
          lastPanY = pts[0].clientY;
        }
      }
      if (activePointers.size === 0) {
        imageZoomStage.classList.remove('is-panning');
      }
    });

    imageZoomStage.addEventListener('pointercancel', (e) => {
      activePointers.delete(e.pointerId);
      if (activePointers.size < 2) pinchBaseDistance = 0;
    });

    let imgLightTapStart = null;
    imageZoomImg.addEventListener('pointerdown', (e) => {
      imgLightTapStart = { x: e.clientX, y: e.clientY };
    });
    imageZoomImg.addEventListener('pointerup', (e) => {
      e.stopPropagation();
      if (!imgLightTapStart) return;
      const dist = Math.hypot(e.clientX - imgLightTapStart.x, e.clientY - imgLightTapStart.y);
      imgLightTapStart = null;
      if (dist > 20) return;
      if (Date.now() < suppressCloseUntil) return;
      closeImageZoom();
    });

    document.addEventListener(
      'click',
      (e) => {
        const t = e.target;
        if (t.matches && t.matches('img.zoomable-image')) {
          e.preventDefault();
          e.stopPropagation();
          openImageZoom(t.currentSrc || t.src);
        }
      },
      true
    );

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !imageZoomOverlay.hidden) {
        closeImageZoom();
      }
    });
  }
});