import { StatsCard } from '@/components/ui/stats-card'
import { GraduationCap, MessageSquare, AlertCircle } from 'lucide-react'

interface StatsData {
  users?: {
    total: number
    admins: number
    teachers: number
    parents: number
    students: number
  }
  students?: {
    total: number
    enrolled: number
    pending: number
    waitlisted: number
    byGrade: Record<string, number>
  }
  messages?: {
    total: number
    sent: number
    draft: number
    scheduled: number
    unreadCount?: number
  }
}

interface StatsGridProps {
  data: StatsData
  userRole: string
}

export function StatsGrid({ data, userRole }: StatsGridProps) {
  const getStatsForRole = () => {
    const stats = []

    // Admin stats removed - admins use Payload admin panel directly

    if (userRole === 'TEACHER' && data.students) {
      stats.push({
        title: 'My Students',
        value: data.students.enrolled,
        description: `${data.students.pending} pending enrollment`,
        icon: <GraduationCap size={20} />,
        color: 'green' as const,
      })
    }

    if (userRole === 'PARENT' && data.students) {
      stats.push({
        title: 'My Children',
        value: data.students.total,
        description: Object.entries(data.students.byGrade)
          .map(([grade, count]) => `${count} in ${grade}`)
          .join(', '),
        icon: <GraduationCap size={20} />,
        color: 'blue' as const,
      })
    }

    // Messages stats for non-admin roles
    if (data.messages && userRole !== 'ADMIN') {
      stats.push({
        title: 'My Messages',
        value: data.messages.total,
        description: data.messages.unreadCount
          ? `${data.messages.unreadCount} unread`
          : `${data.messages.sent} sent, ${data.messages.draft} drafts`,
        icon: <MessageSquare size={20} />,
        color: 'purple' as const,
      })

      if (data.messages.unreadCount && data.messages.unreadCount > 0) {
        stats.push({
          title: 'Unread Messages',
          value: data.messages.unreadCount,
          description: 'Require attention',
          icon: <AlertCircle size={20} />,
          color: 'red' as const,
        })
      }
    }

    return stats
  }

  const statsToShow = getStatsForRole()

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {statsToShow.map((stat, index) => (
        <StatsCard
          key={index}
          title={stat.title}
          value={stat.value}
          description={stat.description}
          icon={stat.icon}
          color={stat.color}
        />
      ))}
    </div>
  )
}
