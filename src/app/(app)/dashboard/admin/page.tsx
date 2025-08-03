import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

export default async function AdminDashboard() {
  const user = await getCurrentUser()

  if (!user || user.role !== 'ADMIN') {
    redirect('/')
  }

  const payload = await getPayload({ config })

  // Get some basic statistics
  const [totalUsers, totalStudents, pendingInquiries, pendingApplications, totalSchools] =
    await Promise.all([
      payload.count({ collection: 'users' }),
      payload.count({ collection: 'students' }),
      payload.count({
        collection: 'inquiries',
        where: { status: { equals: 'NEW' } },
      }),
      payload.count({
        collection: 'applications',
        where: { status: { equals: 'SUBMITTED' } },
      }),
      payload.count({ collection: 'schools' }),
    ])

  const stats = [
    { name: 'Total Users', value: totalUsers.totalDocs, color: 'bg-blue-500' },
    { name: 'Total Students', value: totalStudents.totalDocs, color: 'bg-green-500' },
    { name: 'Pending Inquiries', value: pendingInquiries.totalDocs, color: 'bg-yellow-500' },
    { name: 'Pending Applications', value: pendingApplications.totalDocs, color: 'bg-red-500' },
    { name: 'Total Schools', value: totalSchools.totalDocs, color: 'bg-purple-500' },
  ]

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage schools, users, and oversee platform operations</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5 mb-8">
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
            <div className="space-y-3">
              <a
                href="/admin/collections/users"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Manage Users
              </a>
              <a
                href="/admin/collections/schools"
                className="block w-full bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Manage Schools
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Admissions</h3>
            <div className="space-y-3">
              <a
                href="/admin/collections/inquiries"
                className="block w-full bg-yellow-600 hover:bg-yellow-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Review Inquiries
              </a>
              <a
                href="/admin/collections/applications"
                className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Review Applications
              </a>
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
              <a
                href="/admin/collections/messageTemplates"
                className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center py-2 px-4 rounded-md text-sm font-medium"
              >
                Manage Templates
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
