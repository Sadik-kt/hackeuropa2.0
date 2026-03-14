# AnonSentra — Anonymous Drug Reporting Platform

AnonSentra is a secure, anonymous reporting platform that allows citizens to report drug-related or other civic incidents without exposing their identity. It features an integrated AI (Google Gemini) that automatically verifies evidence photos, a secure backend that bypasses database row-level security (RLS) for anonymous reports, and automated email and Twilio alerts to authorities.

## Project Structure

The project is split into two main parts:
- **`frontend/`**: A React application built with Vite and Tailwind CSS.
- **`backend/`**: A Node.js/Express server that handles secure database interactions, AI verification, and notifications.

---

## 🚀 How to Run Locally

You need to run both the frontend and backend servers simultaneously for the application to work correctly.

### 1. Start the Backend Server
The backend handles securely saving reports to the Supabase database, verifying photos using AI, and sending email/phone alerts.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node index.js
   ```
   > **Note:** The backend runs on **http://localhost:3001**. Keep this terminal window open.

### 2. Start the Frontend Server
The frontend is the visual user interface where users can submit anonymous reports.

1. Open a **new, separate** terminal and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   > **Note:** The frontend runs on **http://localhost:5173**. Keep this terminal window open.

---

## 🧪 Testing the Application

Once both servers are running:
1. Open your web browser and go to: **[http://localhost:5173](http://localhost:5173)**
2. Click the **"Submit an Anonymous Report"** button.
3. Fill out the details (Incident Type, Location, Description).
4. *(Optional)* Upload a test image on the "Evidence" step to see the AI verification in action.
5. Click **"Submit Report Anonymously"**.

If everything is connected correctly, you will see an **"AI Verified — Alert Sent"** success message on the screen, and the backend terminal will log the successful database save and email alert.
