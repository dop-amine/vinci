import { BaseService } from './base.service'
import { studentRepository, messageRepository } from '@/lib/repositories'
import type { User } from '@/payload-types'

interface DashboardStats {
  users: {
    total: number
    admins: number
    teachers: number
    parents: number
    students: number
  }
  students: {
    total: number
    enrolled: number
    pending: number
    waitlisted: number
    byGrade: Record<string, number>
  }
  messages: {
    total: number
    sent: number
    draft: number
    scheduled: number
    unreadCount?: number
  }
}

interface UserDashboardData {
  user: User
  stats: Partial<DashboardStats>
  recentActivity: Array<Partial<import('@/payload-types').Message>>
}

export class DashboardService extends BaseService {
  // Removed getAdminDashboard - admins now use Payload admin panel directly

  async getTeacherDashboard(user: User): Promise<UserDashboardData> {
    try {
      if (!user.school) {
        throw new Error('Teacher not assigned to a school')
      }

      const schoolId = typeof user.school === 'object' ? user.school.id : user.school

      const [studentStats, messageStats, recentMessages] = await Promise.all([
        studentRepository.getStudentStats(schoolId),
        messageRepository.getMessageStats(schoolId, 'week'),
        messageRepository.findBySchool(schoolId, {
          limit: 5,
          dateRange: { start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        }),
      ])

      return {
        user,
        stats: {
          students: studentStats,
          messages: messageStats,
        },
        recentActivity: recentMessages.docs,
      }
    } catch (error) {
      this.handleError('getTeacherDashboard', error)
    }
  }

  async getParentDashboard(user: User): Promise<UserDashboardData> {
    try {
      const [myChildren, messageData] = await Promise.all([
        studentRepository.findByParentId(user.id),
        messageRepository.findByRecipient(user.id, {
          limit: 10,
          dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
      ])

      const stats = {
        students: {
          total: myChildren.length,
          enrolled: myChildren.filter((s) => s.enrollmentStatus === 'ENROLLED').length,
          pending: myChildren.filter((s) => s.enrollmentStatus === 'PENDING').length,
          waitlisted: myChildren.filter((s) => s.enrollmentStatus === 'WAITLISTED').length,
          byGrade: myChildren.reduce(
            (acc, student) => {
              const grade = student.grade || 'Unknown'
              acc[grade] = (acc[grade] || 0) + 1
              return acc
            },
            {} as Record<string, number>,
          ),
        },
        messages: {
          total: messageData.totalDocs,
          unreadCount: messageData.unreadCount,
          sent: 0,
          draft: 0,
          scheduled: 0,
        },
      }

      return {
        user,
        stats,
        recentActivity: messageData.docs,
      }
    } catch (error) {
      this.handleError('getParentDashboard', error)
    }
  }

  async getStudentDashboard(user: User): Promise<UserDashboardData> {
    try {
      const [messageData] = await Promise.all([
        messageRepository.findByRecipient(user.id, {
          limit: 10,
          dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        }),
      ])

      // Find student record by linking to user
      const studentRecords = await studentRepository.findMany({
        where: {
          or: [{ 'parents.email': { equals: user.email } }, { 'parents.id': { equals: user.id } }],
        },
        limit: 1,
        depth: 2,
      })

      const _studentRecord = studentRecords.docs[0]

      const stats = {
        messages: {
          total: messageData.totalDocs,
          unreadCount: messageData.unreadCount,
          sent: 0,
          draft: 0,
          scheduled: 0,
        },
      }

      return {
        user,
        stats,
        recentActivity: messageData.docs,
      }
    } catch (error) {
      this.handleError('getStudentDashboard', error)
    }
  }

  async getDashboardData(user: User): Promise<UserDashboardData> {
    try {
      switch (user.role) {
        case 'ADMIN':
          // Admins are redirected to Payload admin panel, this shouldn't be called
          throw new Error('Admin users should use Payload admin panel directly')

        case 'TEACHER':
          return await this.getTeacherDashboard(user)

        case 'PARENT':
          return await this.getParentDashboard(user)

        case 'STUDENT':
          return await this.getStudentDashboard(user)

        default:
          throw new Error(`Unknown user role: ${user.role}`)
      }
    } catch (error) {
      this.handleError('getDashboardData', error)
    }
  }
}
