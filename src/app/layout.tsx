import React from 'react'
import './globals.css'

export const metadata = {
  title: 'Vinci - School Management Platform',
  description: 'Modern school management platform for progressive education institutions',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
