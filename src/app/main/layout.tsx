import '../globals.css'

// This layout will be applied to non-admin routes

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-background">{children}</main>
}
