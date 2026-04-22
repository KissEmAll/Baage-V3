'use client'
// app/page.js
// Page démo simplifiée — Captain Baage avec Runway + Claude

import { useState } from 'react'
import {
  AvatarSession,
  AvatarVideo,
  useAvatarSession,
  useLocalMedia,
} from '@runwayml/avatars-react'

// ── Interface conversation ────────────────────────────────────────────
function CallUI({ onEnd }) {
  const { state, end } = useAvatarSession()
  const { isMicEnabled, toggleMic } = useLocalMedia()

  const handleEnd = () => { end(); onEnd() }

  return (
    <div style={{
      position: 'relative', width: '100%', height: '100vh',
      background: '#0D1B3E', overflow: 'hidden',
    }}>

      {/* Halo bleu */}
      <div style={{
        position: 'absolute', width: 700, height: 700, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,123,245,0.15) 0%, transparent 70%)',
        top: -200, left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Avatar Captain Baage — plein écran */}
      <AvatarVideo style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        objectFit: 'cover', zIndex: 1,
      }} />

      {/* Gradient bas */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '35%', zIndex: 2,
        background: 'linear-gradient(to top, rgba(13,27,62,0.95) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{
        position: 'absolute', top: 28, left: 40, zIndex: 10,
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 36, fontWeight: 300, color: '#fff', letterSpacing: '0.06em',
      }}>
        <span style={{ color: '#F2A923', fontWeight: 600 }}>b</span>aage
      </div>

      {/* Connecting */}
      {state === 'connecting' && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 10, textAlign: 'center',
          fontFamily: "'Cormorant Garamond', serif",
        }}>
          <div style={{ fontSize: 28, color: 'rgba(255,255,255,0.8)', marginBottom: 12 }}>
            Captain Baage arrive...
          </div>
          <div style={{ fontSize: 14, color: '#F2A923' }}>✨</div>
        </div>
      )}

      {/* Contrôles */}
      <div style={{
        position: 'absolute', bottom: 40, left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 10, display: 'flex', gap: 16, alignItems: 'center',
      }}>
        {/* Micro */}
        <button onClick={toggleMic} style={{
          width: 56, height: 56, borderRadius: '50%',
          background: isMicEnabled
            ? 'rgba(59,123,245,0.25)'
            : 'rgba(220,50,50,0.25)',
          border: `1px solid ${isMicEnabled
            ? 'rgba(59,123,245,0.5)'
            : 'rgba(220,50,50,0.5)'}`,
          cursor: 'pointer', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', transition: 'all 0.2s',
        }}>
          {isMicEnabled ? '🎙️' : '🔇'}
        </button>

        {/* Statut */}
        <div style={{
          background: 'rgba(13,27,62,0.7)',
          border: '1px solid rgba(242,169,35,0.3)',
          borderRadius: 100, padding: '8px 20px',
          display: 'flex', alignItems: 'center', gap: 8,
          backdropFilter: 'blur(12px)',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13, color: 'rgba(255,255,255,0.6)',
        }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: state === 'connected' ? '#4ADE80' : '#F2A923',
            display: 'inline-block',
            animation: 'pulse 2s ease-in-out infinite',
          }} />
          {state === 'connected' ? 'Captain Baage écoute' : 'Connexion...'}
        </div>

        {/* Fin */}
        <button onClick={handleEnd} style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(220,50,50,0.25)',
          border: '1px solid rgba(220,50,50,0.5)',
          cursor: 'pointer', fontSize: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backdropFilter: 'blur(8px)', transition: 'all 0.2s',
          color: '#fff',
        }}>
          ✕
        </button>
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
      `}</style>
    </div>
  )
}

// ── Page d'accueil ────────────────────────────────────────────────────
export default function Home() {
  const [credentials, setCredentials] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const start = async () => {
    setLoading(true)
    setError(null)
    try {
      // 1. Créer la session Runway
      const res = await fetch('/api/avatar/session', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur session')

      // 2. Lancer le Backend RPC Claude
      await fetch('/api/avatar/rpc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: data.sessionId }),
      })

      setCredentials(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Vue conversation active
  if (credentials) {
    return (
      <AvatarSession credentials={credentials} audio video>
        <CallUI onEnd={() => setCredentials(null)} />
      </AvatarSession>
    )
  }

  // Vue accueil
  return (
    <div style={{
      minHeight: '100vh', background: '#0D1B3E',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '40px 20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Halo */}
      <div style={{
        position: 'fixed', width: 800, height: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(59,123,245,0.12) 0%, transparent 70%)',
        top: -200, left: '50%', transform: 'translateX(-50%)',
        pointerEvents: 'none',
        animation: 'breathe 6s ease-in-out infinite alternate',
      }} />

      {/* Titre */}
      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(48px, 7vw, 80px)',
        fontWeight: 300, color: '#fff',
        letterSpacing: '0.04em', margin: '0 0 16px', lineHeight: 1,
      }}>
        Cap&apos;tain <em style={{ fontStyle: 'italic', color: '#F2A923' }}>Baage</em>
      </h1>

      {/* Tagline */}
      <p style={{
        fontSize: 'clamp(15px, 2vw, 19px)', fontWeight: 300,
        color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
        maxWidth: 480, margin: '0 auto 48px',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        Racontez à notre concierge votre projet de voyage,<br />
        il s&apos;occupe de tout.
      </p>

      {/* Avatar */}
      <div style={{ marginBottom: 40 }}>
        <img
          src="https://raw.githubusercontent.com/KissEmAll/Baage-preview/main/baage-preview/Captain%20Baage%20-%20WEB%20HD.png"
          alt="Captain Baage"
          onClick={!loading ? start : undefined}
          style={{
            width: 'clamp(280px, 42vw, 540px)', height: 'auto',
            mixBlendMode: 'screen', cursor: loading ? 'default' : 'pointer',
            animation: 'floating 4s ease-in-out infinite',
            filter: 'drop-shadow(0 0 60px rgba(59,123,245,0.5))',
          }}
        />
      </div>

      {/* Bouton */}
      <button
        onClick={start}
        disabled={loading}
        style={{
          background: loading ? 'rgba(242,169,35,0.5)' : '#F2A923',
          border: 'none', borderRadius: 100,
          padding: '16px 44px', fontSize: 15, fontWeight: 500,
          color: '#0D1B3E', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          letterSpacing: '0.05em', transition: 'all 0.2s',
          marginBottom: 16,
        }}
      >
        {loading ? 'Captain Baage arrive...' : 'Parler à Captain Baage ✈️'}
      </button>

      {/* Mention micro */}
      <p style={{
        fontSize: 12, color: 'rgba(255,255,255,0.25)',
        fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic',
        marginBottom: 8,
      }}>
        🎙️ Parlez ou écrivez — Captain Baage vous répond
      </p>

      {/* Badge disponible */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(13,27,62,0.7)',
        border: '1px solid rgba(242,169,35,0.25)',
        borderRadius: 100, padding: '8px 22px',
        fontSize: 12, color: 'rgba(255,255,255,0.4)',
        fontFamily: "'DM Sans', sans-serif",
        backdropFilter: 'blur(12px)',
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%', background: '#4ADE80',
          display: 'inline-block', animation: 'pulse 2s ease-in-out infinite',
        }} />
        Disponible maintenant
      </div>

      {error && (
        <p style={{
          marginTop: 20, fontSize: 13, color: '#ff6b6b',
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {error}
        </p>
      )}

      <style>{`
        @keyframes floating {
          0%,100% { transform: translateY(0); filter: drop-shadow(0 0 40px rgba(59,123,245,0.4)); }
          50% { transform: translateY(-18px); filter: drop-shadow(0 0 80px rgba(59,123,245,0.7)); }
        }
        @keyframes breathe {
          0% { opacity:0.6; transform:translateX(-50%) scale(1); }
          100% { opacity:1; transform:translateX(-50%) scale(1.1); }
        }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.3; } }
      `}</style>
    </div>
  )
}
