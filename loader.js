/* ═══════════════════════════════════════
   TERMINAL BOOT SEQUENCE
═══════════════════════════════════════ */
(function() {

const BOOT_SEQUENCE = [
  { t:'blank' },
  { t:'ascii', delay:0 },
  { t:'blank' },
  { t:'dim',   text:'BIOS v2.4.1  |  TATA-MOTORS/DET  |  GK-SYSTEM' },
  { t:'dim',   text:'Copyright (C) 2024 Tech Guys. All rights reserved.' },
  { t:'blank' },
  { t:'prompt',text:'[BOOT]  Initializing kernel modules...',       delay:80 },
  { t:'ok',    text:'[  OK  ] kernel: loaded (v6.5.0-govind)',       delay:120 },
  { t:'ok',    text:'[  OK  ] memory: 16384MB DDR5 detected',        delay:80 },
  { t:'ok',    text:'[  OK  ] entropy pool initialized',             delay:60 },
  { t:'blank' },
  { t:'info',  text:'[INIT]  Mounting encrypted volumes...',         delay:100 },
  { t:'ok',    text:'[  OK  ] /dev/sda1  -> /  (ext4, AES-256)',     delay:90 },
  { t:'ok',    text:'[  OK  ] /dev/sda2  -> /tmp  (tmpfs)',          delay:70 },
  { t:'blank' },
  { t:'info',  text:'[NET]   Scanning interfaces...',                delay:100 },
  { t:'ok',    text:'[  OK  ] eth0: 172.25.130.xx  [UP]',            delay:80 },
  { t:'ok',    text:'[  OK  ] lo:   127.0.0.1      [UP]',            delay:60 },
  { t:'warn',  text:'[WARN]  Firewall: 3 blocked probes detected',   delay:100, glitch:true },
  { t:'blank' },
  { t:'info',  text:'[PLC]   Connecting to Mitsubishi Q06HCPU...',   delay:150 },
  { t:'ok',    text:'[  OK  ] MC Protocol: 3E-Frame  port:5000',     delay:120 },
  { t:'ok',    text:'[  OK  ] SCADA: WinCC RTDB link established',   delay:90 },
  { t:'ok',    text:'[  OK  ] GX Works2: project cache loaded',      delay:80 },
  { t:'blank' },
  { t:'bar',   label:'Loading portfolio assets', duration:900 },
  { t:'blank' },
  { t:'info',  text:'[SYS]   Verifying identity...',                 delay:200 },
  { t:'ok',    text:'[  OK  ] USER: govind_kumar  [AUTHENTICATED]',  delay:150, glitch:true },
  { t:'ok',    text:'[  OK  ] ROLE: OT-Engineer / Python-Dev',       delay:80 },
  { t:'ok',    text:'[  OK  ] CLEARANCE: LEVEL-4',                   delay:80 },
  { t:'blank' },
  { t:'head',  text:'>>> SYSTEM READY. LAUNCHING PORTFOLIO <<<',     delay:200 },
  { t:'blank' },
];

const ASCII = `
  ██████╗ ██╗  ██╗    ███████╗██╗   ██╗███████╗████████╗███████╗███╗   ███╗
 ██╔════╝ ██║ ██╔╝    ██╔════╝╚██╗ ██╔╝██╔════╝╚══██╔══╝██╔════╝████╗ ████║
 ██║  ███╗█████╔╝     ███████╗ ╚████╔╝ ███████╗   ██║   █████╗  ██╔████╔██║
 ██║   ██║██╔═██╗     ╚════██║  ╚██╔╝  ╚════██║   ██║   ██╔══╝  ██║╚██╔╝██║
 ╚██████╔╝██║  ██╗    ███████║   ██║   ███████║   ██║   ███████╗██║ ╚═╝ ██║
  ╚═════╝ ╚═╝  ╚═╝    ╚══════╝   ╚═╝   ╚══════╝   ╚═╝   ╚══════╝╚═╝     ╚═╝
`.trim();

const loader   = document.getElementById('terminal-loader');
const output   = document.getElementById('term-output');
const cursorLn = document.querySelector('.term-cursor-line');
const asciiEl  = document.querySelector('.term-ascii');

if (!loader) return;

asciiEl.textContent = ASCII;

let queue = [...BOOT_SEQUENCE];
let totalDelay = 0;

function addLine(cls, text, extraDelay, glitch) {
    totalDelay += (extraDelay || 50);
    setTimeout(() => {
        const div = document.createElement('div');
        div.className = 'term-line ' + cls;
        div.textContent = text || '';
        if (glitch) { setTimeout(() => div.classList.add('glitch-burst'), 50); }
        output.appendChild(div);
        // auto-scroll
        output.scrollTop = output.scrollHeight;
    }, totalDelay);
}

function addBar(label, duration) {
    totalDelay += 100;
    const startAt = totalDelay;
    setTimeout(() => {
        const wrap = document.createElement('div');
        wrap.className = 'term-bar-wrap';
        wrap.innerHTML = `<div class="term-bar-label">[LOAD]  ${label}</div>
                          <div class="term-bar-track"><div class="term-bar-fill" id="tbar"></div></div>`;
        output.appendChild(wrap);
        output.scrollTop = output.scrollHeight;

        const fill = wrap.querySelector('#tbar');
        let pct = 0;
        const step = duration / 100;
        const iv = setInterval(() => {
            pct += 1;
            fill.style.width = pct + '%';
            if (pct >= 100) clearInterval(iv);
        }, step);
    }, startAt);
    totalDelay += duration + 200;
}

// Process queue
queue.forEach(item => {
    if (item.t === 'ascii')  { /* already set */ }
    else if (item.t === 'bar') { addBar(item.label, item.duration || 1000); }
    else { addLine(item.t, item.text, item.delay, item.glitch); }
});

// Show cursor line near end
totalDelay += 300;
setTimeout(() => { cursorLn.classList.add('show'); }, totalDelay);

// Hide loader
totalDelay += 800;
setTimeout(() => {
    loader.classList.add('hide');
    // After hidden, remove from DOM
    setTimeout(() => loader.remove(), 700);
}, totalDelay);

})();
