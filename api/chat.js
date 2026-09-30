export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const userText = (prompt && prompt.trim()) ? prompt.trim() : "مرحباً";

  // مفتاح Groq الخاص بك
  const apiKey = "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";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        // هذا النموذج متاح مجاناً للجميع بدون قيود وصول
        model: "gemma2-9b-it",
        messages: [
          { role: "system", content: "أنت المساعد الذكي في منصة هاي محمود. أجب باللغة العربية باختصار وسرعة." },
          { role: "user", content: userText }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "خطأ في الاتصال بالنموذج" });
    }

    const reply = data.choices?.[0]?.message?.content || "لم يتم استلام رد";
    return res.status(200).json({ reply: reply.trim() });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
