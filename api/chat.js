export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = "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";

  try {
    // جلب قائمة الموديلات المتاحة لحسابك من Groq مباشرة
    const response = await fetch("https://api.groq.com/openai/v1/models", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || "خطأ في جلب القائمة" });
    }

    // استخراج أسماء النماذج المتاحة
    const modelIds = data.data.map(m => m.id).join("\n- ");
    const reply = `النماذج النشطة في حسابك حالياً:\n- ${modelIds}`;

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
