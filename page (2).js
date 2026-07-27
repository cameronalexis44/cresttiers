@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

:root{
  --bg: #0c0e11;
  --surface: #15181d;
  --surface-2: #1c2027;
  --line: #2a2f38;
  --text: #e8e9ec;
  --muted: #8b9099;
  --t1: #5fd9e0;
  --t2: #e8b923;
  --t3: #c9cad0;
  --t4: #c1503a;
  --t5: #6b6e78;
  --danger: #d9534f;
}
*{ box-sizing: border-box; }
html,body{ margin:0; padding:0; }
body{
  background: radial-gradient(1200px 600px at 50% -10%, #171b21 0%, var(--bg) 55%) fixed;
  color: var(--text);
  font-family: 'IBM Plex Sans', sans-serif;
  min-height: 100vh;
}
a{ color: inherit; }
.pixel{ font-family:'Press Start 2P', monospace; }

header.top{
  display:flex; align-items:center; justify-content:space-between;
  gap:16px; flex-wrap:wrap; padding:22px 28px;
  border-bottom:1px solid var(--line);
  background: linear-gradient(180deg, #14171c 0%, #0f1216 100%);
}
.brand{ display:flex; align-items:center; gap:14px; }
.crest{
  width:42px; height:42px; background:linear-gradient(145deg,var(--t1),#2b8e94);
  clip-path: polygon(20% 0%,80% 0%,100% 20%,100% 80%,80% 100%,20% 100%,0% 80%,0% 20%);
  display:flex;align-items:center;justify-content:center;
  box-shadow: 0 0 0 2px #0c0e11, 0 0 14px rgba(95,217,224,0.45);
}
.crest span{ font-size:14px; color:#06121a; font-weight:700; }
.brand h1{ font-size:15px; margin:0; letter-spacing:0.5px; }
.brand p{ margin:2px 0 0; font-size:11.5px; color:var(--muted); }

.idbar{ display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
input, select, button, textarea{
  font-family:'IBM Plex Sans', sans-serif;
  background:var(--surface-2); color:var(--text);
  border:1px solid var(--line); border-radius:3px;
  padding:8px 10px; font-size:13px;
}
button{ cursor:pointer; transition:transform .08s ease, border-color .15s ease; }
button:hover{ border-color:#454b57; }
button:active{ transform: translateY(1px); }
button.primary{ background:linear-gradient(180deg,#2a3038,#1c2026); border-color:var(--t1); color:#dffcff; }
button.danger{ border-color:var(--danger); color:#ffd9d7; }
button.ghost{ background:transparent; }
a.button-link{ text-decoration:none; display:inline-block; }
.pill{ font-size:11px; padding:4px 9px; border-radius:20px; border:1px solid var(--line); color:var(--muted); }
.pill.admin{ border-color:var(--t2); color:var(--t2); }

nav.tabs{ display:flex; gap:6px; padding:16px 28px 0; flex-wrap:wrap; border-bottom:1px solid var(--line); }
nav.tabs button{
  background:transparent; border:1px solid transparent; border-bottom:none;
  border-radius:4px 4px 0 0; padding:9px 16px; color:var(--muted); font-size:13px; font-weight:500;
}
nav.tabs button.active{ color:var(--text); background:var(--surface); border-color:var(--line); }

main{ padding:24px 28px 60px; max-width:1100px; margin:0 auto; }
.toolbar{ display:flex; justify-content:space-between; gap:12px; flex-wrap:wrap; margin-bottom:18px; }
.toolbar input[type=text]{ min-width:220px; }

.tier-group{ margin-bottom:26px; }
.tier-head{ display:flex; align-items:center; gap:10px; margin-bottom:10px; }
.tier-chip{ font-family:'IBM Plex Mono', monospace; font-size:12px; font-weight:600; padding:5px 10px; border-radius:3px; color:#06121a; }
.tier-line{ flex:1; height:1px; background:var(--line); }

.cards{ display:flex; flex-wrap:wrap; gap:10px; }
.card{
  display:flex; align-items:center; gap:10px;
  background:var(--surface); border:1px solid var(--line); border-left:4px solid var(--t3);
  border-radius:4px; padding:9px 14px; min-width:180px;
}
.rank-crest{
  width:26px; height:26px; flex:none;
  clip-path: polygon(20% 0%,80% 0%,100% 20%,100% 80%,80% 100%,20% 100%,0% 80%,0% 20%);
  display:flex; align-items:center; justify-content:center;
  font-family:'IBM Plex Mono', monospace; font-size:11px; font-weight:700; color:#06121a;
}
.card .name{ font-weight:600; font-size:14px; }
.card .meta{ font-size:11px; color:var(--muted); font-family:'IBM Plex Mono', monospace; }

.empty{ color:var(--muted); font-size:13px; padding:30px 0; text-align:center; border:1px dashed var(--line); border-radius:6px; }

.panel{ background:var(--surface); border:1px solid var(--line); border-top:2px solid var(--t2); border-radius:6px; padding:20px; margin-bottom:24px; }
.panel h2{ font-size:14px; margin:0 0 4px; color:var(--t2); }
.panel .sub{ color:var(--muted); font-size:12px; margin-bottom:16px; }

.admin-tabs{ display:flex; gap:8px; margin-bottom:16px; }
.admin-tabs a{ font-size:12px; padding:7px 12px; border:1px solid var(--line); border-radius:3px; text-decoration:none; color:var(--muted); }
.admin-tabs a.active{ border-color:var(--t2); color:var(--t2); }

table.mgmt{ width:100%; border-collapse:collapse; font-size:12.5px; }
table.mgmt th, table.mgmt td{ text-align:left; padding:8px 6px; border-bottom:1px solid var(--line); }
table.mgmt th{ color:var(--muted); font-weight:500; font-size:11px; text-transform:uppercase; letter-spacing:0.4px; }
table.mgmt select{ padding:5px 6px; font-size:12px; }
table.mgmt input[type=text]{ padding:6px 8px; font-size:12.5px; width:110px; }

.new-row{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:16px; padding:12px; background:var(--surface-2); border-radius:4px; }

.admins-list{ display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.admin-item{ display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--surface-2); border-radius:4px; font-size:13px; }
.add-admin-row{ display:flex; gap:8px; }

.auth-card{ max-width:380px; margin:60px auto; background:var(--surface); border:1px solid var(--line); border-radius:6px; padding:28px; }
.auth-card h1{ font-size:14px; margin:0 0 18px; }
.auth-card form{ display:flex; flex-direction:column; gap:10px; }
.auth-card label{ font-size:12px; color:var(--muted); }
.auth-tabs{ display:flex; gap:16px; margin-bottom:18px; }
.auth-tabs a{ text-decoration:none; color:var(--muted); font-size:13px; padding-bottom:6px; border-bottom:2px solid transparent; }
.auth-tabs a.active{ color:var(--text); border-color:var(--t1); }

.error-msg{ color:#ffb4b1; font-size:12.5px; background:rgba(217,83,79,0.12); border:1px solid rgba(217,83,79,0.4); border-radius:4px; padding:8px 10px; }
.success-msg{ color:#b7f0d4; font-size:12.5px; background:rgba(95,217,224,0.08); border:1px solid rgba(95,217,224,0.3); border-radius:4px; padding:8px 10px; }

.footer-note{ text-align:center; color:var(--muted); font-size:11.5px; margin-top:40px; }
