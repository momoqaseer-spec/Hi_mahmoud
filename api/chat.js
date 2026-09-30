export default async function handler(req, res) {
  // السماح بالطلبات بصيغة POST فقط
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const apiKey = "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";

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: "أنت المساعد الذكي في منصة هاي محمود. أجب باللغة العربية باختصار وسرعة." },
          { role: "user", content: prompt || "مرحباً" }
        ],
        temperature: 0.6,
        max_tokens: 800
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'خطأ من السيرفر' });
    }

    const reply = data.choices?.[0]?.message?.content || "لم يتم استلام رد";
    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
