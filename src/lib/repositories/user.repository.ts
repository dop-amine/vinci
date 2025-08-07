import { BaseRepository } from './base.repository'
import type { User } from '@/payload-types'
import type { Where } from 'payload'

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super('users')
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.findMany({
        where: { email: { equals: email } },
        limit: 1,
        depth: 2, // Include school relationship
      })
      return result.docs[0] || null
    } catch (error) {
      console.error(`Error finding user by email ${email}:`, error)
      return null
    }
  }

  async findByRole(role: string, schoolId?: string | number): Promise<User[]> {
    const where: Where = { role: { equals: role } }

    if (schoolId) {
      where.school = { equals: schoolId }
    }

    const result = await this.findMany({
      where,
      depth: 2,
      limit: 100,
    })

    return result.docs
  }

  async findBySchool(schoolId: string | number): Promise<User[]> {
    const result = await this.findMany({
      where: { school: { equals: schoolId } },
      depth: 2,
      limit: 200,
    })

    return result.docs
  }

  async getUserStats(schoolId?: string | number): Promise<{
    total: number
    admins: number
    teachers: number
    parents: number
    students: number
  }> {
    const baseWhere = schoolId ? { school: { equals: schoolId } } : undefined

    const [total, admins, teachers, parents, students] = await Promise.all([
      this.count(baseWhere),
      this.count(
        baseWhere ? { ...baseWhere, role: { equals: 'ADMIN' } } : { role: { equals: 'ADMIN' } },
      ),
      this.count(
        baseWhere ? { ...baseWhere, role: { equals: 'TEACHER' } } : { role: { equals: 'TEACHER' } },
      ),
      this.count(
        baseWhere ? { ...baseWhere, role: { equals: 'PARENT' } } : { role: { equals: 'PARENT' } },
      ),
      this.count(
        baseWhere ? { ...baseWhere, role: { equals: 'STUDENT' } } : { role: { equals: 'STUDENT' } },
      ),
    ])

    return { total, admins, teachers, parents, students }
  }
}
