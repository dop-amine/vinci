import type { Access, Where } from 'payload'

type UserLike = {
  id: number | string
  role?: 'ADMIN' | 'TEACHER' | 'PARENT' | 'STUDENT'
  school?: number | string | null
}

export function isAdmin(user?: UserLike | null): boolean {
  return user?.role === 'ADMIN'
}

export function isTeacher(user?: UserLike | null): boolean {
  return user?.role === 'TEACHER'
}

export function isParent(user?: UserLike | null): boolean {
  return user?.role === 'PARENT'
}

export function sameSchoolWhere(user?: UserLike | null, field: string = 'school'): Where {
  if (user?.school == null) return {}
  return { [field]: { equals: user.school } } as Where
}

export const allowIfLoggedIn: Access = ({ req }) => !!req.user

export const adminOnly: Access = ({ req }) => isAdmin(req.user as UserLike)

export const adminOrSameSchool =
  (field: string = 'school'): Access =>
  ({ req }) => {
    const user = req.user as UserLike | undefined
    if (!user) return false
    if (isAdmin(user)) return true
    if (user.school == null) return false
    return sameSchoolWhere(user, field)
  }

export const messagesReadableWhere: Access = ({ req }) => {
  const user = req.user as UserLike | undefined
  if (!user) return false
  if (isAdmin(user)) return true

  const base: Where = {
    and: [
      { school: { equals: user.school ?? null } },
      {
        or: [{ sender: { equals: user.id } }, { recipients: { in: [user.id] } }],
      },
    ],
  }

  return base
}

export const templatesReadableWhere: Access = ({ req }) => {
  const user = req.user as UserLike | undefined
  if (!user) return false
  if (isAdmin(user)) return true
  return {
    or: [{ school: { equals: null } }, { school: { equals: user.school ?? null } }],
  }
}
