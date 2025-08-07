import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'

export default async function TeacherDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'TEACHER') {
    redirect('/')
  }

  const payload = await getPayload({ config })

  // Ensure user has a valid school ID
  const schoolId = typeof user.school === 'object' ? user.school?.id : user.school

  if (!schoolId) {
    // If no school is assigned, redirect to an error page or show empty state
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

  // Get teacher-specific data
  const [myStudents, recentMessages, pendingInquiries] = await Promise.all([
    payload.count({
      collection: 'students',
      where: { school: { equals: schoolId } },
    }),
    payload.count({
      collection: 'messages',
      where: {
        sender: { equals: user.id },
        createdAt: { greater_than: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    payload.count({
      collection: 'inquiries',
      where: {
        school: { equals: schoolId },
        status: { equals: 'NEW' },
      },
    }),
  ])

  const stats = [
    { name: 'My Students', value: myStudents.totalDocs, color: 'bg-blue-500' },
    { name: 'Messages This Week', value: recentMessages.totalDocs, color: 'bg-green-500' },
    { name: 'New Inquiries', value: pendingInquiries.totalDocs, color: 'bg-yellow-500' },
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your students and communicate with parents</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-8 h-8 rounded-md ${stat.color}`}></div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-medium text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                href="/dashboard/teacher/attendance"
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Take Attendance
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
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Send Message
              </Link>
              <Link
                href="/admin/collections/messageTemplates"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Use Templates
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Admissions Support</h3>
            <div className="space-y-3">
              <Link
                href="/admin/collections/inquiries"
                className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Review Inquiries
              </Link>
              <Link
                href="/admin/collections/applications"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Application Reviews
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
