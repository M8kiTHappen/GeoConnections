/**
 * Vercel serverless function — proxies requests to the Anthropic API.
 * The API key stays server-side and is never exposed to the browser.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': process.env.VITE_ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    res.status(response.status).json(data)
  } catch (err) {
    console.error('[anthropic-proxy] error:', err)
    res.status(502).json({ error: 'proxy error' })
  }
}
