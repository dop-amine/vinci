import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import { Student } from '@/payload-types'

export default async function ParentDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'PARENT') {
    redirect('/')
  }

  const payload = await getPayload({ config })

  // Get parent-specific data
  const [myChildren, recentMessages, unreadMessages] = await Promise.all([
    payload.find({
      collection: 'students',
      where: {
        parents: { in: [user.id] },
      },
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

  const stats = [
    { name: 'My Children', value: myChildren.totalDocs, color: 'bg-blue-500' },
    { name: 'Messages This Week', value: recentMessages.totalDocs, color: 'bg-green-500' },
    { name: 'Unread Messages', value: unreadMessages.totalDocs, color: 'bg-red-500' },
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Parent Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Stay connected with your child&apos;s education and school community
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

      {/* My Children */}
      {myChildren.docs.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">My Children</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Academic information and updates for your children
            </p>
          </div>
          <ul className="divide-y divide-gray-200">
            {myChildren.docs.map((student: Student) => (
              <li key={student.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          Grade: {student.grade} • Status: {student.enrollmentStatus}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm">
                        View Details
                      </button>
                      <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm">
                        Contact Teacher
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Communications</h3>
            <div className="space-y-3">
              <Link
                href="/admin/collections/messages"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                View Messages
              </Link>
              <button className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                Message Teacher
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
            <div className="space-y-3">
              <button className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                School Calendar
              </button>
              <button className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                School Directory
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account & Settings</h3>
            <div className="space-y-3">
              <button className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                Update Profile
              </button>
              <button className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium">
                Emergency Contacts
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
