'use client'
import { useState } from 'react'
import { AvatarCall } from '@runwayml/avatars-react'
import '@runwayml/avatars-react/styles.css'

export default function Home() {
  const [started, setStarted] = useState(false)

  if (started) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#0D1B3E' }}>
        <AvatarCall
          avatarId="b7a061e4-8ebe-439e-b21e-437ab4d6781d"
          connectUrl="/api/avatar/session"
          onEnd={() => setStarted(false)}
          onError={(e) => { console.error(e); setStarted(false) }}
        />
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', background: '#0D1B3E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 20px',
    }}>
      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(48px, 7vw, 80px)',
        fontWeight: 300, color: '#fff',
        letterSpacing: '0.04em', margin: '0 0 16px',
      }}>
        Cap'tain <em style={{ fontStyle: 'italic', color: '#F2A923' }}>Baage</em>
      </h1>

      <p style={{
        fontSize: 18, color: 'rgba(255,255,255,0.55)',
        marginBottom: 48, maxWidth: 480,
      }}>
        Racontez à notre concierge votre projet de voyage,
        il s'occupe de tout.
      </p>

      <img
        src="https://raw.githubusercontent.com/KissEmAll/Baage-preview/main/baage-preview/Captain%20Baage%20-%20WEB%20HD.png"
        alt="Captain Baage"
        onClick={() => setStarted(true)}
        style={{
          width: 'clamp(280px, 42vw, 500px)', height: 'auto',
          mixBlendMode: 'screen', cursor: 'pointer',
          marginBottom: 40,
        }}
      />

      <button
        onClick={() => setStarted(true)}
        style={{
          background: '#F2A923', border: 'none', borderRadius: 100,
          padding: '16px 44px', fontSize: 15, fontWeight: 500,
          color: '#0D1B3E', cursor: 'pointer',
        }}
      >
        Parler à Captain Baage ✈️
      </button>
    </div>
  )
}
