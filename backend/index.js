const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const fetch = require('node-fetch');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// ───────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT (Service Role — for backend use only)
// ───────────────────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    status: 'CivicGuard Backend is running ✅',
    supabase: process.env.SUPABASE_URL ? '✅ Connected' : '⚠️  Not configured',
    routes: [
      'POST /send-email      → Send report alert to authorities via email',
      'POST /alert           → Trigger emergency Twilio voice call',
      'POST /verify-photo    → AI verify if uploaded photo is genuine evidence',
      'PATCH /update-report  → Update report status in Supabase (admin use)',
    ],
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 1: SEND EMAIL ALERT TO AUTHORITIES
// ─────────────────────────────────────────────────────────────────────────────
// Expected body: { title, description, location, category, imageUrl }
// ─────────────────────────────────────────────────────────────────────────────
app.post('/send-email', async (req, res) => {
  const { title, description, location, category, imageUrl } = req.body;

  if (!title || !description) {
    return res.status(400).json({ success: false, message: 'title and description are required' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"CivicGuard Alert System" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECIPIENT,
    subject: `🚨 New Civic Report: ${title}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 2px solid #e74c3c; border-radius: 8px; overflow: hidden;">
        <div style="background: #e74c3c; color: white; padding: 20px;">
          <h1 style="margin:0">🚨 CivicGuard — New Report Submitted</h1>
        </div>
        <div style="padding: 24px;">
          <h2 style="color:#c0392b">${title}</h2>
          <p><strong>📂 Category:</strong> ${category || 'Not specified'}</p>
          <p><strong>📍 Location:</strong> ${location || 'Not specified'}</p>
          <p><strong>📝 Description:</strong></p>
          <p style="background:#f8f8f8; padding:12px; border-radius:4px;">${description}</p>
          ${imageUrl ? `
          <p><strong>📷 Evidence Photo:</strong></p>
          <img src="${imageUrl}" alt="Evidence" style="max-width:100%; border-radius:6px; border:1px solid #ddd;"/>
          ` : '<p><em>No photo attached.</em></p>'}
          <hr/>
          <p style="color: #888; font-size:12px;">This report was submitted anonymously via CivicGuard. Please handle with discretion.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent for report: "${title}"`);
    res.json({ success: true, message: 'Email alert sent to authorities' });
  } catch (error) {
    console.error('❌ Email error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 2: TWILIO EMERGENCY VOICE CALL
// ─────────────────────────────────────────────────────────────────────────────
// Expected body: (optional) { reportTitle }
// ─────────────────────────────────────────────────────────────────────────────
app.post('/alert', async (req, res) => {
  const twilioClient = require('twilio')(
    process.env.TWILIO_SID,
    process.env.TWILIO_TOKEN
  );

  try {
    const call = await twilioClient.calls.create({
      // This URL reads out a voice message via Twilio's TwiML
      url: 'https://demo.twilio.com/welcome/voice/',
      to: process.env.OFFICER_PHONE,
      from: process.env.TWILIO_PHONE,
    });
    console.log(`✅ Emergency call initiated. SID: ${call.sid}`);
    res.json({ success: true, callSid: call.sid, message: 'Emergency call triggered' });
  } catch (error) {
    console.error('❌ Twilio error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to make call', error: error.message });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE 3: AI PHOTO VERIFICATION (Google Gemini Vision)
// ─────────────────────────────────────────────────────────────────────────────
// Expected body: { imageUrl } — a publicly accessible image URL
// Returns: { is_relevant, confidence, reason, detected_objects }
// ─────────────────────────────────────────────────────────────────────────────
app.post('/verify-photo', async (req, res) => {
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ success: false, message: 'imageUrl is required' });
  }

  try {
    // Fetch the image and convert to base64
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Could not fetch image: ${imageResponse.statusText}`);
    }
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const buffer = await imageResponse.buffer();
    const base64Image = buffer.toString('base64');

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are an AI moderator for a civic crime reporting platform.
Analyze this image submitted as evidence for a civic/crime report.

Respond ONLY with a valid JSON object — no markdown, no explanation outside the JSON.

Format:
{
  "is_relevant": true or false,
  "confidence": a number between 0.0 and 1.0,
  "reason": "one sentence explaining your decision",
  "detected_objects": ["list", "of", "key", "things", "you", "see"]
}

Consider the image RELEVANT (is_relevant: true) if it shows ANY of:
- Illegal substances or drug paraphernalia
- Suspicious criminal activity
- Accidents, injuries, or public safety hazards
- Property damage, vandalism, or illegal dumping
- Weapons or threatening situations
- Suspicious unattended packages

Consider the image NOT RELEVANT (is_relevant: false) if it is:
- A random selfie or portrait with no context
- An unrelated nature or landscape photo
- A blank, blurry, or completely dark image
- A meme, screenshot, or clearly irrelevant content
- An image with no visible civic/safety concern

Be fair but strict. Public safety is the priority.`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: contentType,
          data: base64Image,
        },
      },
      prompt,
    ]);

    const responseText = result.response.text().trim();
    console.log('🤖 Gemini raw response:', responseText);

    // Extract JSON from response (handles if model adds extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('AI did not return valid JSON');
    }

    const aiResult = JSON.parse(jsonMatch[0]);
    console.log(`✅ AI result: relevant=${aiResult.is_relevant}, confidence=${aiResult.confidence}`);

    // Auto-save AI result to Supabase if reportId is provided
    const { reportId } = req.body;
    if (reportId) {
      const { error: dbError } = await supabase
        .from('reports')
        .update({
          ai_verified: aiResult.is_relevant,
          ai_confidence: aiResult.confidence,
          status: aiResult.is_relevant ? 'pending' : 'rejected',
        })
        .eq('id', reportId);

      if (dbError) {
        console.warn('⚠️  Could not save AI result to DB:', dbError.message);
      } else {
        console.log(`✅ AI result saved to Supabase for report: ${reportId}`);
      }
    }

    res.json({
      success: true,
      ...aiResult,
    });
  } catch (error) {
    console.error('❌ AI verification error:', error.message);
    res.status(500).json({
      success: false,
      message: 'AI verification failed',
      error: error.message,
    });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`\n🚀 CivicGuard Backend running on http://localhost:${PORT}`);
  console.log(`📧 Email configured for: ${process.env.EMAIL_USER || '⚠️  EMAIL_USER not set in .env'}`);
  console.log(`📞 Twilio SID: ${process.env.TWILIO_SID ? '✅ Set' : '⚠️  Not set'}`);
  console.log(`🤖 Gemini API: ${process.env.GEMINI_API_KEY ? '✅ Set' : '⚠️  Not set'}\n`);
});
