import type { CollectionConfig, Where } from 'payload'
import { adminOnly, adminOrSameSchool } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 2,
    verify: false, // Disable email verification for development
  },
  // Expose auth endpoints via /api by default; Next routes can proxy as needed
  access: {
    read: ({ req }) => {
      // Admin can read all users; others can read users in the same school or themselves
      const base = adminOrSameSchool('school')({ req })
      if (base === true) return true
      if (base === false) return false
      const userId = req.user?.id

      // base should be a Where object at this point
      const where: Where = {
        or: [base as Where, { id: { equals: userId ?? null } }],
      }
      return where
    },
    create: async ({ req }) => {
      // Allow creating the very first user; otherwise admin-only
      try {
        const result = await req.payload.count({ collection: 'users' })
        if (!result.totalDocs || result.totalDocs === 0) return true
      } catch {
        // On bootstrap errors, allow to avoid lockout
        return true
      }
      return adminOnly({ req })
    },
    update: ({ req }) => {
      // Admin can update all; users can update their own profile
      if (adminOnly({ req })) return true
      const where: Where = { id: { equals: req.user?.id ?? null } }
      return where
    },
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'email', 'role'],
  },
  fields: [
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Teacher', value: 'TEACHER' },
        { label: 'Parent', value: 'PARENT' },
        { label: 'Student', value: 'STUDENT' },
      ],
      defaultValue: 'STUDENT',
      required: true,
    },
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'dateOfBirth',
      type: 'date',
      label: 'Date of Birth',
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'Address',
    },
  ],
}
