import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { message, messages } = await req.json()
    const apiKey = process.env.GROQ_API_KEY

    if (!apiKey) {
      return NextResponse.json({ error: 'Missing API Key' }, { status: 500 })
    }

    // Prepare message history
    const userMessage = message || (messages && messages[messages.length - 1]?.content) || ''

    const systemPrompt = `You are ResQRoute AI, a calm, deeply knowledgeable, and empathetic roadside emergency assistance expert.

CRITICAL INSTRUCTIONS FOR TONE & LANGUAGE:
1. STRICT LANGUAGE MATCHING:
   - If the user speaks in English, reply in natural, warm, professional English.
   - If the user speaks in Hindi or Hinglish (e.g., "bhai gadi band ho gayi", "dhuan nikal raha hai", "engine garam ho gaya"), reply in natural, conversational, friendly Hinglish/Hindi.
   - Do NOT force rigid templates or robotic bullet-point lectures. Talk like an experienced, caring mechanic or highway patrol expert standing right there to help them.

2. STRUCTURE OF YOUR RESPONSE:
   - First, reassure them and give 1 crucial immediate safety action (e.g., hazard lights, getting away from traffic, not opening hot radiator caps).
   - Second, explain in simple, human terms what likely went wrong with the vehicle.
   - Third, give clear practical advice on whether they can fix it or need a tow truck / mechanic.`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('Groq API error:', errText)
      return NextResponse.json({ error: 'Groq API error' }, { status: 502 })
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || 'Sorry, could not process.'

    return NextResponse.json({ reply })
  } catch (err: any) {
    console.error('API catch:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
