import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function StudentDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'STUDENT') {
    redirect('/')
  }

  const payload = await getPayload({ config })

  // Get student-specific data
  const [studentRecord, recentMessages, unreadMessages] = await Promise.all([
    payload.find({
      collection: 'students',
      where: {
        // Assuming students are linked via email or a user relationship
        'parents.email': { equals: user.email },
      },
      limit: 1,
    }),
    payload.count({
      collection: 'messages',
      where: {
        recipients: { in: [user.id] },
        createdAt: { greater_than: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
    payload.count({
      collection: 'messages',
      where: {
        recipients: { in: [user.id] },
        'readReceipts.user': { not_in: [user.id] },
      },
    }),
  ])

  const student = studentRecord.docs[0]

  const stats = [
    { name: 'Current Grade', value: student?.grade || 'N/A', color: 'bg-blue-500' },
    { name: 'Messages This Week', value: recentMessages.totalDocs, color: 'bg-green-500' },
    { name: 'Unread Messages', value: unreadMessages.totalDocs, color: 'bg-red-500' },
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back! Stay up to date with your classes and school activities
        </p>
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

      {/* Student Information */}
      {student && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">My Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Your current academic information
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Full name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {student.firstName} {student.lastName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Grade</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {student.grade}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Enrollment Status</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      student.enrollmentStatus === 'ENROLLED'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {student.enrollmentStatus}
                  </span>
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Student ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {student.studentId || 'Not assigned'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Academics</h3>
            <div className="space-y-3">
              <button className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                View Grades
              </button>
              <button className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                Class Schedule
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Communications</h3>
            <div className="space-y-3">
              <a
                href="/admin/collections/messages"
                className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                View Messages
              </a>
              <button className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                Contact Teacher
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">School Life</h3>
            <div className="space-y-3">
              <button className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                School Calendar
              </button>
              <button className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                Activities & Clubs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
