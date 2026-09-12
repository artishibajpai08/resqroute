import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json()
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })
    }

    const userMessage = message || (messages && messages[messages.length - 1]?.content) || ''

    const systemPrompt = `You are ResQRoute AI, a calm, friendly, empathetic roadside emergency assistant.

RULES:
1. GREETINGS (like "hello", "hi", "hey"):
   - Reply warmly in 1-2 lines. Say hello and ask how you can assist with their vehicle today. Do not give breakdown advice for a simple greeting.

2. LANGUAGE MATCHING:
   - If user speaks English, reply in natural, clear English.
   - If user speaks Hindi or Hinglish (e.g. "bhai gadi start nahi ho rahi", "dhuan nikal raha hai"), reply in natural, conversational Hinglish/Hindi like a helpful roadside mechanic.

3. BREAKDOWN EMERGENCIES:
   - Step 1: Reassure the driver and give 1 crucial safety action (hazard lights, shoulder parking, stay safe).
   - Step 2: Briefly explain the probable issue in plain human words.
   - Step 3: Tell them whether to call a tow truck or mobile mechanic from the directory below.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.6,
        max_tokens: 350,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq Error:', errText)
      return NextResponse.json({ error: 'Groq API error' }, { status: 502 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Sorry, could not process.'

    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error('Backend catch:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
