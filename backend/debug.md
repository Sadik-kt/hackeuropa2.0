# 🛡️ AnonSentra — Backend Dev Summary (Dev 2)

## What I Built

A **Node.js + Express** backend with 2 servers handling all backend logic for the civic crime reporting platform.

---

## Files Created

### `index.js` — Main Backend Server (Port 3001)
Handles email alerts, emergency voice calls, and AI photo verification.

### `ai-brain.js` — AI Brain Server (Port 4000)
Teammate's AI report validation server — uses Gemini to verify if a report is genuine before saving to the database.

---

## API Routes & Test Results

### Server 1 — `index.js` on Port 3001

| Route | Method | Purpose | Test Result |
|-------|--------|---------|-------------|
| `/` | GET | Health check | ✅ Passed |
| `/send-email` | POST | Sends HTML alert email to authorities via Gmail + Nodemailer | ✅ Email delivered |
| `/alert` | POST | Triggers Twilio emergency voice call to officer | ✅ Call SID returned: `CAc9fd9d7...` |
| `/verify-photo` | POST | Sends photo to Gemini Vision AI — returns `is_relevant`, `confidence`, `reason` | ✅ AI responding |

### Server 2 — `ai-brain.js` on Port 4000

| Route | Method | Purpose | Test Result |
|-------|--------|---------|-------------|
| `/` | GET | Health check | ✅ Passed |
| `/submit-report` | POST | Gemini AI reads report text → YES/NO → saves to Supabase | ✅ Passed |

---

## Technologies Used

| Technology | Purpose |
|-----------|---------|
| **Node.js + Express** | Backend server framework |
| **Nodemailer** | Sending HTML email alerts to authorities |
| **Twilio** | Emergency voice call to duty officer |
| **Google Gemini AI** (`gemini-2.5-flash`) | AI text validation of reports |
| **Google Gemini Vision** (`gemini-1.5-flash`) | AI photo verification (real evidence vs spam) |
| **Supabase** (Service Role Key) | Database — saving verified/rejected reports |
| **Multer** | Handling file/image uploads |
| **dotenv** | Secure environment variable management |

---

## Live Test Evidence

### ✅ Email Test
```
POST http://localhost:3001/send-email
→ { "success": true, "message": "Email alert sent to authorities" }
```
Email delivered to `fadiahamed10@gmail.com` with full HTML report layout.

### ✅ AI Report Validation Test (Legitimate report)
```
POST http://localhost:4000/submit-report
Body: { "description": "I saw someone selling drugs near the bus stand at MG Road...", "walletAddress": "0xTestWallet123" }
→ { "success": true, "message": "Emergency verified and recorded.", "reportId": "d8ccf04a-46fd-43c6-81ff-dd7f3d8eda3e" }
```
Gemini AI said **YES** → Report saved in Supabase with `status: verified`.

### ✅ AI Spam Rejection Test
```
POST http://localhost:4000/submit-report
Body: { "description": "haha this is a prank lol nothing is happening here" }
→ { "success": false, "message": "Report rejected by AI validation." }
```
Gemini AI said **NO** → Report saved with `status: rejected`. Spam blocked.

### ✅ Twilio Emergency Call
```
POST http://localhost:3001/alert
→ { "success": true, "callSid": "CAc9fd9d7ad8a9778d8a6c26cd4f09d881", "message": "Emergency call triggered" }
```
Call logged in Twilio console. Trial account restricts unverified numbers — in production this calls any number worldwide.

---

## Security Practices

- All API keys stored in `.env` (never committed to GitHub via `.gitignore`)
- Supabase **Service Role Key** used only in backend (never exposed to frontend)
- Frontend uses only the **Anon Public Key**
- CORS enabled for cross-origin frontend requests

---

## How to Run

```bash
# Install dependencies
npm install

# Start main backend (port 3001)
node index.js

# Start AI brain server (port 4000) — in a new terminal
node ai-brain.js
```

---

## Environment Variables Required

```
EMAIL_USER, EMAIL_PASSWORD, EMAIL_RECIPIENT
TWILIO_SID, TWILIO_TOKEN, TWILIO_PHONE, OFFICER_PHONE
GEMINI_API_KEY
SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_SERVICE_ROLE_KEY
PORT
```
