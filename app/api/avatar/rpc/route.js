// app/api/avatar/rpc/route.js
// Backend RPC : Claude répond, Runway anime
// C'est ici que vit toute l'intelligence de Captain Baage

import Anthropic from '@anthropic-ai/sdk'
import { createRpcHandler } from '@runwayml/avatars-node-rpc'
import { SYSTEM_PROMPT } from '@/lib/prompt'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

// Historique des conversations en mémoire par session
const sessions = new Map()

export async function POST(request) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return Response.json({ error: 'sessionId requis' }, { status: 400 })
    }

    // Initialiser l'historique
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, [])
    }

    // Créer le handler RPC connecté à la session Runway
    await createRpcHandler({
      apiKey: process.env.RUNWAYML_API_SECRET,
      sessionId,

      tools: {
        // Runway appelle cet outil quand Captain Baage a besoin de répondre
        get_captain_response: async ({ user_message }) => {
          const history = sessions.get(sessionId) || []

          // Ajouter le message utilisateur
          history.push({ role: 'user', content: user_message })

          try {
            const response = await anthropic.messages.create({
              model: 'claude-sonnet-4-20250514',
              max_tokens: 300,
              system: SYSTEM_PROMPT,
              messages: history,
            })

            const reply = response.content[0]?.text ||
              "Laissez-moi réfléchir une seconde..."

            // Ajouter la réponse à l'historique
            history.push({ role: 'assistant', content: reply })

            // Garder les 20 derniers messages
            if (history.length > 20) history.splice(0, history.length - 20)
            sessions.set(sessionId, history)

            return { response: reply }

          } catch (err) {
            console.error('Claude error:', err)
            return { response: "Je rencontre une petite turbulence... répétez ?" }
          }
        },

        // Outil pour les liens affiliés Kwanko
        get_affiliate_link: async ({ type, destination }) => {
          const links = {
            hotel: `https://booking.com/?aid=BAAGE_KWANKO&ss=${encodeURIComponent(destination || '')}`,
            vol: `https://transavia.com/?ref=baage`,
            activite: `https://getyourguide.com/?partner_id=BAAGE&q=${encodeURIComponent(destination || '')}`,
            assurance: 'https://chapka.fr/?ref=baage',
            bagage: 'https://baage.fr/shop',
          }
          return { url: links[type] || links.hotel }
        },
      },

      onConnected: () => console.log(`RPC connecté — ${sessionId}`),
      onDisconnected: () => {
        console.log(`RPC déconnecté — ${sessionId}`)
        // Nettoyer après 1 minute
        setTimeout(() => sessions.delete(sessionId), 60000)
      },
      onError: (err) => console.error(`RPC erreur — ${sessionId}:`, err),
    })

    return Response.json({ status: 'connected', sessionId })

  } catch (error) {
    console.error('RPC setup error:', error)
    return Response.json(
      { error: error.message || 'RPC setup failed' },
      { status: 500 }
    )
  }
}
