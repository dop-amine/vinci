import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { dashboardService } from '@/lib/services'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import Link from 'next/link'

export default async function ParentDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'PARENT') {
    redirect('/')
  }

  try {
    const dashboardData = await dashboardService.getParentDashboard(user)

    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Stay connected with your children&apos;s educational journey.
          </p>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <StatsGrid data={dashboardData.stats} userRole={user.role} />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">My Children</h3>
              <div className="space-y-3">
                <Link
                  href="/api/students?parentId=${user.id}"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  View Children&apos;s Progress
                </Link>
                <Link
                  href="/admin/collections/applications/create"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  Submit Application
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Communications</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/collections/messages"
                  className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  View Messages
                </Link>
                <Link
                  href="/admin/collections/inquiries/create"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  Contact School
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/collections/schools"
                  className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  School Details
                </Link>
                <Link
                  href="/admin/collections/applications"
                  className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  Application Status
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Messages */}
        {dashboardData.recentActivity.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h3>
              <div className="space-y-3">
                {dashboardData.recentActivity
                  .slice(0, 5)
                  .map((message: Partial<import('@/payload-types').Message>, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-200 pb-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {message.subject || 'Message'}
                        </p>
                        <p className="text-xs text-gray-500">
                          From:{' '}
                          {typeof message.sender === 'object'
                            ? `${message.sender.firstName} ${message.sender.lastName}`
                            : 'School Staff'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {message.createdAt
                            ? new Date(message.createdAt).toLocaleDateString()
                            : 'Recent'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">{message.priority || 'Normal'}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Parent dashboard error:', error)
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Error</h1>
          <p className="text-gray-600">Unable to load dashboard data. Please try again later.</p>
        </div>
      </div>
    )
  }
}
