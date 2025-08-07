import { BaseRepository } from './base.repository'
import type { Student } from '@/payload-types'
import type { Where } from 'payload'

export class StudentRepository extends BaseRepository<Student> {
  constructor() {
    super('students')
  }

  async findByParentId(parentId: string | number): Promise<Student[]> {
    const result = await this.findMany({
      where: { parents: { in: [parentId] } },
      depth: 2, // Include parent and school relationships
      limit: 50,
    })

    return result.docs
  }

  async findBySchool(
    schoolId: string | number,
    options: {
      page?: number
      limit?: number
      grade?: string
      status?: string
    } = {},
  ): Promise<{ docs: Student[]; totalDocs: number; totalPages: number }> {
    const where: Where = { school: { equals: schoolId } }

    if (options.grade) {
      where.grade = { equals: options.grade }
    }

    if (options.status) {
      where.enrollmentStatus = { equals: options.status }
    }

    const result = await this.findMany({
      where,
      page: options.page || 1,
      limit: options.limit || 50,
      sort: 'lastName',
      depth: 2,
    })

    return result
  }

  async findByGrade(schoolId: string | number, grade: string): Promise<Student[]> {
    const result = await this.findMany({
      where: {
        school: { equals: schoolId },
        grade: { equals: grade },
        enrollmentStatus: { equals: 'ENROLLED' },
      },
      depth: 2,
      limit: 100,
    })

    return result.docs
  }

  async getStudentStats(schoolId: string | number): Promise<{
    total: number
    enrolled: number
    pending: number
    waitlisted: number
    byGrade: Record<string, number>
  }> {
    const baseWhere = { school: { equals: schoolId } }

    const [total, enrolled, pending, waitlisted] = await Promise.all([
      this.count(baseWhere),
      this.count({ ...baseWhere, enrollmentStatus: { equals: 'ENROLLED' } }),
      this.count({ ...baseWhere, enrollmentStatus: { equals: 'PENDING' } }),
      this.count({ ...baseWhere, enrollmentStatus: { equals: 'WAITLISTED' } }),
    ])

    // Get grade distribution
    const enrolledStudents = await this.findBySchool(schoolId, { limit: 1000 })
    const byGrade = enrolledStudents.docs.reduce(
      (acc, student) => {
        const grade = student.grade || 'Unknown'
        acc[grade] = (acc[grade] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return { total, enrolled, pending, waitlisted, byGrade }
  }

  async searchStudents(
    schoolId: string | number,
    searchTerm: string,
    limit = 20,
  ): Promise<Student[]> {
    const result = await this.findMany({
      where: {
        school: { equals: schoolId },
        or: [
          { firstName: { contains: searchTerm } },
          { lastName: { contains: searchTerm } },
          { studentId: { contains: searchTerm } },
        ],
      },
      limit,
      depth: 1,
    })

    return result.docs
  }
}
