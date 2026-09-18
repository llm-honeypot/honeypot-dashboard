# VaultBank Honeypot — Dashboard

A two-in-one Next.js application: a pixel-perfect fake Indian banking portal (the public trap) and a hidden Security Operations Centre that streams live attack telemetry from the honeypot backend.

---

## Two Surfaces, One App

### Public Surface — VaultBank Portal (`:8080`)

What attackers and casual visitors see. A convincing replica of an Indian bank's NetBanking portal:

| Route | What it looks like |
|---|---|
| `/` | Landing page — loans, UPI, schemes, branch locator |
| `/dashboard` | Authenticated NetBanking dashboard with account balances |
| `/accounts` | Account details with IFSC, account type, balance |
| `/transactions` | Transaction history with UPI references, NEFT details |
| `/cards` | Debit/credit card management |
| `/statements` | Account statements |
| `/loans` | Loan products page |
| `/upi` | UPI payments page |
| `/emi-calculator` | EMI calculator |
| `/branches` | Branch and ATM locator |

Design details that make it convincing:
- DICGC insurance badge ("Insured up to ₹5 Lakhs")
- RBI regulatory footer ("CIN: L65191MH1994PLC080618")
- 256-bit SSL indicator
- Toll-free number: 1800-400-VAULT
- Realistic Indian customer data (Bavana Sruthi, VB-8940192)

### Hidden Surface — SOC Dashboard (`/007/bond`)

The real-time attack monitoring console. Only accessible if you know the URL.

**Three tabs:**

**1. SOC Telemetry**
- Live attack event feed — every hit on the honeypot backend appears here instantly
- Threat profile cards per attacker — IP, stage, cumulative score, attack types seen, tags (`#sqli`, `#rce`, `#cred-hunt`)
- Raw request viewer — method, path, query params, payload
- Stats panel — active sessions, attacks intercepted, total time wasted

**2. System Diagnostics**
- Fake system info served from `/admin/debug` on the backend
- Shows what attackers see when they probe the server

**3. Microservices Directory**
- Fake internal service map from `/internal/services`
- Lists fake core banking microservices with internal hostnames

---

## How the SOC Works

The SOC connects to `ws://[server]/ws` on load and receives 4 message types:

```
Backend (FastAPI /ws)
        │
        │  WebSocket
        ▼
  useHoneypotWS.ts  ──▶  React state updates
        │
        ├──▶  AttackFeed.tsx     — scrolling event list
        ├──▶  ThreatProfile.tsx  — per-attacker profile card
        ├──▶  StatsPanel.tsx     — aggregate counters
        └──▶  RequestViewer.tsx  — raw HTTP request detail
```

**Message types:**

| Type | Payload | Triggers |
|---|---|---|
| `init` | Full history array | On first connect — populates feed |
| `event` | Single attack event | New row in AttackFeed |
| `profile_update` | Attacker profile | Updates ThreatProfile card |
| `stats` | Aggregate counters | Updates StatsPanel |

---

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS**
- **lucide-react** icons
- **Static export** (`output: "export"`) — served by nginx from `/var/www/dashboard`
- **WebSocket** — native browser WS, no socket.io

---

## Local Development

```bash
npm install

# Point at your backend WebSocket
NEXT_PUBLIC_WS_URL=ws://13.235.233.165/ws npm run dev
```

Open `http://localhost:3000` for the VaultBank portal.
Open `http://localhost:3000/007/bond` for the SOC dashboard.

## Build (static export)

```bash
NEXT_PUBLIC_WS_URL=ws://your-server-ip/ws npm run build
# Output in ./out/ — deploy to nginx root
```

---

## Project Structure

```
src/
├── app/
│   ├── 007/bond/page.tsx          # SOC dashboard (secret)
│   ├── components/
│   │   ├── VaultBankLayout.tsx    # Wraps all pages, handles public/auth/SOC routing
│   │   ├── AttackFeed.tsx         # Live event list
│   │   ├── ThreatProfile.tsx      # Attacker profile card
│   │   ├── StatsPanel.tsx         # Aggregate stats
│   │   ├── RequestViewer.tsx      # Raw request detail
│   │   ├── PublicHeader.tsx       # Landing page nav
│   │   └── SiteFooter.tsx         # RBI/DICGC footer
│   ├── dashboard/                 # Authenticated NetBanking pages
│   ├── accounts/ cards/ transactions/ statements/ ...
│   └── loans/ upi/ branches/ emi-calculator/ ...  # Public marketing pages
├── lib/
│   ├── mockData.ts                # Fake customer, account, transaction data
│   ├── mockTypes.ts               # TypeScript types for mock data
│   ├── types.ts                   # WebSocket message types (wire-compatible with backend)
│   └── useHoneypotWS.ts           # WebSocket hook — connects to backend /ws
```

---

## Deployment

nginx config (port 8080):

```nginx
server {
    listen 8080;
    root /var/www/dashboard;
    index index.html;
    location / {
        rewrite ^/(.+)/$ /$1 permanent;
        try_files $uri $uri.html $uri/index.html /index.html;
    }
    location /_next/static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

The `rewrite` + `try_files $uri.html` handles Next.js static export paths (e.g. `/007/bond` → `007/bond.html`).

---

## Companion

**Backend** → [`llm-honeypot/honeypot-backend`](https://github.com/llm-honeypot/honeypot-backend) — FastAPI deception engine with LLM-generated fake responses
