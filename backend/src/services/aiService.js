// Imported required packages
const OpenAI = require("openai");

// Initialize OpenAI client using API key from environment
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

 // Analyze post text and return an authenticity score from 0-100.
async function scoreTextAuthenticity(text) {
    if (!text || !text.trim()) {
        return { score: null, label: "unverified" };
    }

    try {
        const systemPrompt =
            "You are a careful fact-checking assistant. Given a user's post, estimate how likely the content is accurate and not misleading. Return ONLY a JSON object with keys score (0-100 integer) and rationale (short string).";

        const userPrompt = `Post:\n"""${text}\n"""\nReturn JSON strictly like {"score": 0-100, "rationale": "..."}.`;

        const response = await openai.chat.completions.create({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: userPrompt },
            ],
            temperature: 0.2,
            max_tokens: 150,
        });

        const content = response?.choices?.[0]?.message?.content || "";
        let parsed = null;
        try {
            parsed = JSON.parse(content);
        } catch (_) {
            // attempt to extract JSON substring
            const match = content.match(/\{[\s\S]*\}/);
            if (match) parsed = JSON.parse(match[0]);
        }

        const rawScore = typeof parsed?.score === "number" ? parsed.score : null;
        const clamped = rawScore == null ? null : Math.max(0, Math.min(100, Math.round(rawScore)));

        const label = clamped == null
            ? "unverified"
            : clamped >= 70
                ? "verified"
                : clamped >= 40
                    ? "mixed"
                    : "suspect";

        return { score: clamped, label };
    } catch (err) {
        console.error("AI scoring failed:", err?.message || err);
        return { score: null, label: "unverified" };
    }
}

// Exported the aiService
module.exports = { scoreTextAuthenticity };


