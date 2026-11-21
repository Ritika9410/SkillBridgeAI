type GeminiOptions = { temperature?: number; maxOutputTokens?: number };

export async function generateGeminiJson(
  prompt: string,
  { temperature = 0.2, maxOutputTokens = 3000 }: GeminiOptions = {}
): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new Error('Gemini is not configured. Add GEMINI_API_KEY to .env.local.');

  const primary = process.env.GEMINI_MODEL?.trim() || 'gemini-3.8-flash';
  const fallback = process.env.GEMINI_FALLBACK_MODEL?.trim() || 'gemini-3.5-flash-lite';
  let response = await request(primary);
  if (response.status === 503 && fallback !== primary) response = await request(fallback);

  if (!response.ok) {
    if (response.status === 429) throw new Error('Gemini quota reached. Please try again later.');
    if (response.status === 401 || response.status === 403)
      throw new Error('Gemini rejected the API key. Check GEMINI_API_KEY and its API access.');
    if (response.status === 404)
      throw new Error('The configured Gemini model was not found. Check GEMINI_MODEL in .env.local.');
    throw new Error(`Gemini request failed (HTTP ${response.status}). Please try again.`);
  }

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text = payload.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();
  if (!text) throw new Error('Gemini returned an empty response. Please try again.');
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error('Gemini returned invalid JSON. Please try again.');
  }

  function request(model: string) {
    return fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-goog-api-key': apiKey },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: 'application/json',
            temperature,
            maxOutputTokens,
          },
        }),
        signal: AbortSignal.timeout(30000),
      }
    );
  }
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

export function boundedInteger(value: unknown, min: number, max: number): number | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? Math.round(Math.max(min, Math.min(max, value)))
    : null;
}
