import { NextResponse } from 'next/server'

export const maxDuration = 60

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const avatarId = body.avatarId || 'b7a061e4-8ebe-439e-b21e-437ab4d6781d'

    const RunwayML = (await import('@runwayml/sdk')).default
    const client = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET })

    const { id: sessionId } = await client.realtimeSessions.create({
      model: 'gwm1_avatars',
      avatar: { type: 'custom', avatarId },
    })

    const deadline = Date.now() + 55_000
    while (Date.now() < deadline) {
      const session = await client.realtimeSessions.retrieve(sessionId)
      if (session.status === 'READY') {
        return NextResponse.json({ sessionId, sessionKey: session.sessionKey })
      }
      if (session.status === 'FAILED') {
        return NextResponse.json({ error: 'Session failed' }, { status: 500 })
      }
      await new Promise(r => setTimeout(r, 1000))
    }

    return NextResponse.json({ error: 'Timeout' }, { status: 504 })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
