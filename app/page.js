'use client'
import { AvatarCall } from '@runwayml/avatars-react'
import '@runwayml/avatars-react/styles.css'

const AVATAR_ID = 'b7a061e4-8ebe-439e-b21e-437ab4d6781d'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0D1B3E',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
    }}>
      <h1 style={{
        color: '#fff',
        marginBottom: 8,
        fontSize: 48,
        fontWeight: 300,
      }}>
        Cap'tain <span style={{ color: '#F2A923', fontStyle: 'italic' }}>Baage</span>
      </h1>
      <p style={{
        color: 'rgba(255,255,255,0.5)',
        marginBottom: 40,
        fontSize: 16,
      }}>
        Racontez votre projet de voyage, il s'occupe de tout.
      </p>
      <AvatarCall
        avatarId={AVATAR_ID}
        connectUrl="/api/avatar/session"
        onEnd={() => console.log('Session terminée')}
        onError={(e) => console.error('Erreur:', e)}
      />
    </div>
  )
}
