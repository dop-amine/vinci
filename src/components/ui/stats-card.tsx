import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: ReactNode
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  trend?: {
    value: number
    isPositive: boolean
    period: string
  }
  className?: string
}

const colorClasses = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-500',
}

export function StatsCard({
  title,
  value,
  description,
  icon,
  color = 'blue',
  trend,
  className,
}: StatsCardProps) {
  return (
    <div className={cn('bg-white overflow-hidden shadow rounded-lg', className)}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {icon && (
              <div
                className={cn(
                  'w-8 h-8 rounded-md flex items-center justify-center',
                  colorClasses[color],
                )}
              >
                <div className="text-white text-lg">{icon}</div>
              </div>
            )}
          </div>
          <div className={cn('flex-1', icon ? 'ml-5' : '')}>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {trend && (
                <p
                  className={cn(
                    'ml-2 flex items-baseline text-sm font-semibold',
                    trend.isPositive ? 'text-green-600' : 'text-red-600',
                  )}
                >
                  <span className="sr-only">{trend.isPositive ? 'Increased' : 'Decreased'} by</span>
                  {trend.isPositive ? '+' : ''}
                  {trend.value}%
                </p>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
            {description && <p className="text-xs text-gray-400 mt-1">{description}</p>}
            {trend && <p className="text-xs text-gray-400 mt-1">vs {trend.period}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
