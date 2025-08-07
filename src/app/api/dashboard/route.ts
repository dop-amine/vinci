import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { dashboardService } from '@/lib/services'

export async function GET(_request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    // Admins should use Payload admin panel directly
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin users should use Payload admin panel at /admin' },
        { status: 403 },
      )
    }

    const dashboardData = await dashboardService.getDashboardData(user)

    return NextResponse.json({
      success: true,
      data: dashboardData,
    })
  } catch (error) {
    console.error('Dashboard API error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false,
      },
      { status: 500 },
    )
  }
}
