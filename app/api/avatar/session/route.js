// app/api/avatar/session/route.js
// Crée une session Runway avec Captain Baage + voix Morgan

import RunwayML from '@runwayml/sdk'

const getClient = () => new RunwayML({
  apiKey: process.env.RUNWAYML_API_SECRET || 'placeholder'
})

const AVATAR_ID = 'b7a061e4-8ebe-439e-b21e-437ab4d6781d'
const VOICE_PRESET = 'morgan'

const START_SCRIPT = `Bonjour... je suis Captain Baage.
Dites-moi juste ce que vous ressentez — et je m'occupe du reste.`

// Personality courte pour Runway — le vrai cerveau est Claude via RPC
const PERSONALITY = `Tu es Captain Baage, le génie du voyage de baage.fr.
Tu parles TOUJOURS en français.
Tu es charmant, mystérieux, drôle et attentionné.
Tu poses maximum une question à la fois.
Ton nom est toujours Captain Baage — jamais traduit.
Quand tu as besoin de répondre à une question de voyage,
utilise l'outil get_captain_response pour obtenir la meilleure réponse.`

export async function POST(request) {
  try {
    // 1. Créer la session Runway
    const { id: sessionId } = await client.realtimeSessions.create({
      model: 'gwm1_avatars',
      avatar: { type: 'custom', avatarId: AVATAR_ID },
      voice: {
        type: 'runway-live-preset',
        presetId: VOICE_PRESET,
      },
      personality: PERSONALITY,
      startScript: START_SCRIPT,
    })

    // 2. Poller jusqu'à READY
    let sessionKey
    for (let i = 0; i < 60; i++) {
      const session = await getClient().realtimeSessions.retrieve(sessionId)
      if (session.status === 'READY') {
        sessionKey = session.sessionKey
        break
      }
      if (session.status === 'FAILED') {
        return Response.json(
          { error: 'Session failed: ' + session.failure },
          { status: 500 }
        )
      }
      await new Promise(r => setTimeout(r, 1000))
    }

    if (!sessionKey) {
      return Response.json({ error: 'Session timed out' }, { status: 504 })
    }

    // 3. Consommer les credentials WebRTC
    const consumeResponse = await fetch(
      `https://api.dev.runwayml.com/v1/realtime_sessions/${sessionId}/consume`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionKey}`,
          'X-Runway-Version': '2024-11-06',
        },
      }
    )

    if (!consumeResponse.ok) {
      const error = await consumeResponse.text()
      return Response.json({ error }, { status: 500 })
    }

    const credentials = await consumeResponse.json()

    return Response.json({
      sessionId,
      serverUrl: credentials.url,
      token: credentials.token,
      roomName: credentials.roomName,
    })

  } catch (error) {
    console.error('Session error:', error)
    return Response.json(
      { error: error.message || 'Failed to create session' },
      { status: 500 }
    )
  }
}
