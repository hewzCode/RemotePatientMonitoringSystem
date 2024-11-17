import './globals.css'

export const metadata = {
  title: 'Remote Patient Monitoring System',
  description: 'Doctor and Patient Sign In Portal',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="ripple-background">{children}</body>
    </html>
  )
}
