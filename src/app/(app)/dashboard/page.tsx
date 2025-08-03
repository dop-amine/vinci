import { getCurrentUser, redirectByRole } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/')
  }

  // Redirect to role-specific dashboard
  const roleBasedPath = redirectByRole(user.role)
  if (roleBasedPath !== '/dashboard') {
    redirect(roleBasedPath)
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-600">
            Role-specific dashboard will be displayed here based on your role: {user.role}
          </p>
        </div>
      </div>
    </div>
  )
}
