import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { dashboardService } from '@/lib/services'
import { StatsGrid } from '@/components/dashboard/stats-grid'
import Link from 'next/link'

export default async function TeacherDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'TEACHER') {
    redirect('/')
  }

  // Validate school assignment
  const schoolId = typeof user.school === 'object' ? user.school?.id : user.school
  if (!schoolId) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-red-600">
            No school assigned to your account. Please contact an administrator.
          </p>
        </div>
      </div>
    )
  }

  try {
    const dashboardData = await dashboardService.getTeacherDashboard(user)

    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Welcome back! Manage your students and communications.
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Student Management</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/collections/students"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  View My Students
                </Link>
                <Link
                  href="/admin/collections/students/create"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  Add New Student
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
                  href="/admin/collections/messages/create"
                  className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  Send Message
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reports</h3>
              <div className="space-y-3">
                <Link
                  href="/admin/collections/applications"
                  className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  Review Applications
                </Link>
                <Link
                  href="/admin/collections/inquiries"
                  className="block w-full bg-orange-600 hover:bg-orange-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
                >
                  View Inquiries
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        {dashboardData.recentActivity.length > 0 && (
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {dashboardData.recentActivity
                  .slice(0, 5)
                  .map((activity: Partial<import('@/payload-types').Message>, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b border-gray-200 pb-2"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {activity.subject || 'Activity'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {activity.createdAt
                            ? new Date(activity.createdAt).toLocaleDateString()
                            : 'Recent'}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {activity.messageType || activity.status || 'Update'}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Teacher dashboard error:', error)
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
