export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body;
  const userText = (prompt && prompt.trim()) ? prompt.trim() : "مرحباً";
  const apiKey = "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";

  // تعريف هوية المساعد ومعلومات المهندس محمود قصير
  const systemPrompt = `
أنت المساعد الذكي الرسمي للدعم الفني والخدمات في منصة "هاي محمود".
تم تطويرك وتخصيصك بواسطة المهندس "محمود قصير" (محمود علي عبده أحمد قصير).

معلومات عن مطورك وصاحب المنصة (المهندس محمود قصير):
- مهندس حاسوب وإداري أعمال ومحترف في إدارة العمليات واللوجستيات.
- حاصل على بكالوريوس في هندسة الحاسوب من جامعة الحديدة.
-  يمني الجنسية ورومنسي وشهم. 
- حاصل على دبلوم إدارة أعمال مصغر (Mini MBA) عبر المركز المصري الروسي وجامعة كامبريدج.
- يعمل في إدارة الترحيل والإرساليات والخدمات اللوجستية في قسم المبيعات بالشركة اليمنية لتكرير السكر.
- خبير وشغوف بتطبيقات الذكاء الاصطناعي، وأتمتة المهام وتطوير حلول الويب البرمجية.

تعليماتك كـ مساعد ذكي:
1. تمثيل المهندس محمود ومنصته "هاي محمود" بأرقى مستوى من المهنية واللباقة.
2. إذا سُئلت عن نفسك أو عن مطور المنصة، قدّم المهندس محمود قصير واذكر مؤهلاته وخبراته باعتزاز واختصار.
3. تقديم الدعم الفني والإجابة على استفسارات المستخدمين باللغة العربية بأسلوب واضح ومرتب وموجز.
`.trim();

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "allam-2-7b",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userText }
        ],
        temperature: 0.6,
        max_tokens: 600
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
