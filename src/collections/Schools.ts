import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSameSchool } from '../lib/access'

export const Schools: CollectionConfig = {
  slug: 'schools',
  access: {
    read: ({ req }) => adminOrSameSchool('id')({ req }) || false,
    create: adminOnly,
    update: adminOnly,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'phone', 'email'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'School Name',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'Used for multi-tenant routing (e.g., oakwood-academy)',
      },
    },
    {
      name: 'address',
      type: 'textarea',
      label: 'School Address',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Contact Email',
    },
    {
      name: 'website',
      type: 'text',
      label: 'Website URL',
    },
    {
      name: 'logo',
      type: 'relationship',
      relationTo: 'media',
      label: 'School Logo',
    },
    {
      name: 'establishedYear',
      type: 'number',
      label: 'Year Established',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'School Description',
    },
    {
      name: 'settings',
      type: 'group',
      label: 'School Settings',
      fields: [
        {
          name: 'allowOnlineApplications',
          type: 'checkbox',
          defaultValue: true,
          label: 'Allow Online Applications',
        },
        {
          name: 'applicationDeadline',
          type: 'date',
          label: 'Application Deadline',
        },
        {
          name: 'gradeClasses',
          type: 'array',
          label: 'Grade Classes',
          fields: [
            {
              name: 'grade',
              type: 'text',
              required: true,
              label: 'Grade (e.g., Pre-K, K, 1st, 2nd)',
            },
            {
              name: 'capacity',
              type: 'number',
              label: 'Student Capacity',
            },
          ],
        },
      ],
    },
  ],
}
