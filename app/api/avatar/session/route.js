import { NextResponse } from 'next/server'

export const maxDuration = 60

const AVATAR_ID = 'b7a061e4-8ebe-439e-b21e-437ab4d6781d'

export async function POST() {
  try {
    const RunwayML = (await import('@runwayml/sdk')).default
    const client = new RunwayML({ apiKey: process.env.RUNWAYML_API_SECRET })

    const { id: sessionId } = await client.realtimeSessions.create({
      model: 'gwm1_avatars',
      avatar: { type: 'custom', avatarId: AVATAR_ID },
    })

    let sessionKey
    const deadline = Date.now() + 55_000
    while (Date.now() < deadline) {
      const session = await client.realtimeSessions.retrieve(sessionId)
      if (session.status === 'READY') {
        sessionKey = session.sessionKey
        break
      }
      if (session.status === 'FAILED') {
        return NextResponse.json({ error: 'Session failed' }, { status: 500 })
      }
      await new Promise(r => setTimeout(r, 1000))
    }

    if (!sessionKey) {
      return NextResponse.json({ error: 'Timeout' }, { status: 504 })
    }

    const consumeResponse = await fetch(
      `${client.baseURL}/v1/realtime_sessions/${sessionId}/consume`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionKey}`,
          'X-Runway-Version': '2024-11-06',
        },
      }
    )

    const credentials = await consumeResponse.json()

    return NextResponse.json({
      sessionId,
      serverUrl: credentials.url,
      token: credentials.token,
      roomName: credentials.roomName,
    })

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
