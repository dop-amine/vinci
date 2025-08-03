import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 2,
    verify: false, // Disable email verification for development
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
