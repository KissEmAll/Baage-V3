'use client'
import { useState } from 'react'
import { AvatarSession, AvatarVideo, ControlBar } from '@runwayml/avatars-react'
import '@runwayml/avatars-react/styles.css'

export default function Home() {
  const [credentials, setCredentials] = useState(null)
  const [loading, setLoading] = useState(false)

  const start = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/avatar/session', { method: 'POST' })
      const data = await res.json()
      setCredentials(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (credentials) {
    return (
      <div style={{ width: '100vw', height: '100vh', background: '#0D1B3E' }}>
        <AvatarSession
          credentials={credentials}
          audio
          video
          onEnd={() => setCredentials(null)}
          onError={(e) => { console.error(e); setCredentials(null) }}
        >
          <AvatarVideo style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <ControlBar />
        </AvatarSession>
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
        fontSize: 'clamp(48px, 7vw, 80px)',
        fontWeight: 300, color: '#fff',
        margin: '0 0 16px',
      }}>
        Cap'tain <em style={{ fontStyle: 'italic', color: '#F2A923' }}>Baage</em>
      </h1>

      <p style={{
        fontSize: 18, color: 'rgba(255,255,255,0.55)',
        marginBottom: 48, maxWidth: 480,
      }}>
        Racontez à notre concierge votre projet de voyage, il s'occupe de tout.
      </p>

      <img
        src="https://raw.githubusercontent.com/KissEmAll/Baage-preview/main/baage-preview/Captain%20Baage%20-%20WEB%20HD.png"
        alt="Captain Baage"
        onClick={!loading ? start : undefined}
        style={{
          width: 'clamp(280px, 42vw, 500px)',
          mixBlendMode: 'screen', cursor: 'pointer',
          marginBottom: 40,
        }}
      />

      <button onClick={start} disabled={loading} style={{
        background: loading ? 'rgba(242,169,35,0.5)' : '#F2A923',
        border: 'none', borderRadius: 100,
        padding: '16px 44px', fontSize: 15, fontWeight: 500,
        color: '#0D1B3E', cursor: loading ? 'not-allowed' : 'pointer',
      }}>
        {loading ? 'Captain Baage arrive...' : 'Parler à Captain Baage ✈️'}
      </button>
    </div>
  )
}
