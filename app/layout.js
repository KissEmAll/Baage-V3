// app/layout.js
import '@runwayml/avatars-react/styles.css'

export const metadata = {
  title: "Cap'tain Baage — Génie du voyage",
  description: 'Votre conciergerie de voyage IA personnalisée.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#0D1B3E' }}>
        {children}
      </body>
    </html>
  )
}
