// AnonSentra AI Integration Server - Updated with correct Git Identity
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const { GoogleGenAI } = require('@google/genai');

const app = express();
app.use(cors());
app.use(express.json());

// Setup Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Setup Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Setup Multer
const upload = multer({ dest: 'uploads/' });

app.post('/submit-report', upload.single('image'), async (req, res) => {
    try {
        const { description, walletAddress } = req.body;
        const file = req.file;

        console.log(`Analyzing report from: ${walletAddress}`);

        // 1. Ask Gemini to validate the text
        const prompt = `You are an emergency dispatcher for the AnonSentra anti-drug system. Analyze this user report. Is this a legitimate civic emergency or drug tip, or is it spam/prank? Answer nothing else but YES or NO.
        Report: "${description}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const isLegitText = response.text.trim().toUpperCase();
        const isLegit = isLegitText.includes('YES');

        if (!isLegit) {
            await supabase.from('reports').insert([
                { reporter_wallet: walletAddress, description: description, is_legit: false, status: 'rejected' }
            ]);
            return res.status(400).json({ success: false, message: 'Report rejected by AI validation.' });
        }

        console.log("AI Validation Passed. Triggering Web3 and Alerts...");

        // 4. Save to Supabase
        const { data, error } = await supabase.from('reports').insert([
            { reporter_wallet: walletAddress, description: description, is_legit: true, status: 'verified' }
        ]).select();

        if (error) throw error;

        res.status(200).json({ success: true, message: 'Emergency verified and recorded.', reportId: data[0].id });

    } catch (error) {
        console.error('Error processing report:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(4000, () => {
    console.log('🧠 AI Integration Brain Server running on port 4000');
});
