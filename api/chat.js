export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const userText = (prompt && prompt.trim()) ? prompt.trim() : "مرحباً";

  try {
    // تجهيز النص وتشفيره للرابط مباشرة بدون تعقيد
    const fullPrompt = `أجب باللغة العربية باختصار: ${userText}`;
    const encodedPrompt = encodeURIComponent(fullPrompt);
    
    // استدعاء مباشر عبر GET
    const response = await fetch(`https://text.pollinations.ai/${encodedPrompt}`);

    if (!response.ok) {
      return res.status(response.status).json({ error: `خطأ من الخادم: ${response.status}` });
    }

    const reply = await response.text();
    return res.status(200).json({ reply: reply.trim() });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
