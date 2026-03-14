require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE (uses SUPABASE_SERVICE_ROLE_KEY — same value as SUPABASE_SERVICE_KEY)
// ─────────────────────────────────────────────────────────────────────────────
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ─────────────────────────────────────────────────────────────────────────────
// GEMINI AI
// ─────────────────────────────────────────────────────────────────────────────
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─────────────────────────────────────────────────────────────────────────────
// MULTER (file uploads stored temporarily)
// ─────────────────────────────────────────────────────────────────────────────
const upload = multer({ dest: 'uploads/' });

// ─────────────────────────────────────────────────────────────────────────────
// HEALTH CHECK
// ─────────────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
    res.json({
        status: '🧠 AI Brain Server running ✅',
        port: 4000,
        routes: ['POST /submit-report → AI validates report text & saves to Supabase'],
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /submit-report
// Body (multipart/form-data): description (text), walletAddress (text), image (file, optional)
// ─────────────────────────────────────────────────────────────────────────────
app.post('/submit-report', upload.single('image'), async (req, res) => {
    try {
        const { description, walletAddress } = req.body;
        const file = req.file;

        // BUG FIX: original code was missing backticks around template literal
        console.log(`Analyzing report from: ${walletAddress}`);

        if (!description) {
            return res.status(400).json({ success: false, message: 'description is required' });
        }

        // ── Step 1: Ask Gemini to validate the report text ──────────────────────
        const prompt = `You are an emergency dispatcher for the AnonSentra anti-drug system. 
Analyze this user report. Is this a legitimate civic emergency or drug tip, or is it spam/prank? 
Answer nothing else but YES or NO.
Report: "${description}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const isLegitText = response.text.trim().toUpperCase();
        const isLegit = isLegitText.includes('YES');

        console.log(`🤖 Gemini verdict: ${isLegitText} → isLegit=${isLegit}`);

        // ── Step 2: If rejected, save rejection record and return ────────────────
        if (!isLegit) {
            await supabase.from('reports').insert([
                {
                    reporter_wallet: walletAddress,
                    description: description,
                    is_legit: false,
                    status: 'rejected',
                },
            ]);
            return res
                .status(400)
                .json({ success: false, message: 'Report rejected by AI validation.' });
        }

        console.log('✅ AI Validation Passed. Saving to database...');

        // ── Step 3: Save verified report to Supabase ─────────────────────────────
        const { data, error } = await supabase
            .from('reports')
            .insert([
                {
                    reporter_wallet: walletAddress,
                    description: description,
                    is_legit: true,
                    status: 'verified',
                },
            ])
            .select();

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: 'Emergency verified and recorded.',
            reportId: data[0].id,
        });
    } catch (error) {
        console.error('❌ Error processing report:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ─────────────────────────────────────────────────────────────────────────────
// START
// ─────────────────────────────────────────────────────────────────────────────
app.listen(4000, () => {
    console.log('\n🧠 AI Integration Brain Server running on port 4000');
    console.log(`🗄️  Supabase: ${process.env.SUPABASE_URL ? '✅ Connected' : '⚠️  Not configured'}`);
    console.log(`🤖 Gemini: ${process.env.GEMINI_API_KEY ? '✅ Set' : '⚠️  Not set'}\n`);
});
