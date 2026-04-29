const express = require('express');
const router = express.Router();

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'meizu9255@gmail.com'; // Changed to the correct email

// ─── Resend API арқылы email жіберу ───
const sendEmail = async ({ to, subject, html, reply_to }) => {
  if (!RESEND_API_KEY) {
    console.warn('⚠️  RESEND_API_KEY орнатылмаған — email жіберілмеді');
    return;
  }
  
  const payload = {
    from: 'SheberTab <onboarding@resend.dev>',
    to,
    subject,
    html
  };
  
  if (reply_to) {
    payload.reply_to = reply_to;
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
};

// ─── POST /api/contact ───
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Барлық өрістерді толтырыңыз' });
    }

    // Send email to admin
    await sendEmail({
      to: ADMIN_EMAIL, 
      reply_to: email, // This allows the admin to hit "Reply" and email the user directly
      subject: `SheberTab: Жаңа өтінім - ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;padding:20px;background:#f8fafc;border-radius:10px;">
          <h2 style="color:#0f172a;margin-bottom:20px;">Жаңа хабарлама түсті</h2>
          <p><strong>Аты-жөні:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Хабарлама:</strong></p>
          <div style="background:#fff;padding:15px;border-radius:8px;border:1px solid #e2e8f0;white-space:pre-wrap;">${message}</div>
          <br/>
          <p style="font-size:12px;color:#94a3b8;">SheberTab Contact Form</p>
        </div>
      `
    });

    res.json({ success: true, message: 'Хабарлама сәтті жіберілді!' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'Хабарлама жіберу мүмкін болмады' });
  }
});

module.exports = router;
