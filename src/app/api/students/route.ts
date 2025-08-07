import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { studentRepository } from '@/lib/repositories'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const grade = searchParams.get('grade') || undefined
    const status = searchParams.get('status') || undefined
    const search = searchParams.get('search') || undefined

    let students

    if (user.role === 'ADMIN') {
      // Admin can see all students
      const schoolId = searchParams.get('schoolId')
      if (!schoolId) {
        return NextResponse.json({ error: 'School ID required for admin' }, { status: 400 })
      }

      if (search) {
        const searchResults = await studentRepository.searchStudents(schoolId, search, limit)
        students = { docs: searchResults, totalDocs: searchResults.length, totalPages: 1 }
      } else {
        students = await studentRepository.findBySchool(schoolId, { page, limit, grade, status })
      }
    } else if (user.role === 'TEACHER') {
      // Teacher can see students in their school
      if (!user.school) {
        return NextResponse.json({ error: 'Teacher not assigned to a school' }, { status: 400 })
      }

      const schoolId = typeof user.school === 'object' ? user.school.id : user.school

      if (search) {
        const searchResults = await studentRepository.searchStudents(schoolId, search, limit)
        students = { docs: searchResults, totalDocs: searchResults.length, totalPages: 1 }
      } else {
        students = await studentRepository.findBySchool(schoolId, { page, limit, grade, status })
      }
    } else if (user.role === 'PARENT') {
      // Parent can only see their own children
      const myChildren = await studentRepository.findByParentId(user.id)
      students = { docs: myChildren, totalDocs: myChildren.length, totalPages: 1 }
    } else {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    return NextResponse.json({
      success: true,
      data: students,
      pagination: {
        page,
        limit,
        totalDocs: students.totalDocs,
        totalPages: students.totalPages || Math.ceil(students.totalDocs / limit),
      },
    })
  } catch (error) {
    console.error('Students API error:', error)

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Internal server error',
        success: false,
      },
      { status: 500 },
    )
  }
}
