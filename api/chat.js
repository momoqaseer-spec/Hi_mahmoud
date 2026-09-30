export default async function handler(req, res) {
  // استقبال طلبات POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const userText = (prompt && prompt.trim()) ? prompt.trim() : "مرحباً";

  try {
    // استدعاء مباشر وسريع بدون مفتاح API وبدون قيود صلاحيات
    const response = await fetch("https://text.pollinations.ai/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { 
            role: "system", 
            content: "أنت المساعد الذكي في منصة 'هاي محمود'. أجب باللغة العربية باختصار وسرعة." 
          },
          { 
            role: "user", 
            content: userText 
          }
        ],
        model: "openai",
        seed: 42
      })
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: `خطأ من الخادم: ${response.status}` });
    }

    const reply = await response.text();
    return res.status(200).json({ reply: reply.trim() });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
