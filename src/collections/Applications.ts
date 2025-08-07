import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSameSchool } from '../lib/access'

export const Applications: CollectionConfig = {
  slug: 'applications',
  access: {
    read: ({ req }) => adminOrSameSchool('school')({ req }) || false,
    create: ({ req }) => !!req.user, // must be logged in to start an application
    update: ({ req }) => adminOrSameSchool('school')({ req }) || false,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'applicationNumber',
    defaultColumns: ['applicationNumber', 'school', 'status', 'submittedAt'],
  },
  fields: [
    {
      name: 'inquiry',
      type: 'relationship',
      relationTo: 'inquiries',
      label: 'Related Inquiry',
      admin: {
        description: 'Link to the original inquiry if applicable',
      },
    },
    {
      name: 'applicationNumber',
      type: 'text',
      unique: true,
      required: true,
      label: 'Application Number',
      admin: {
        description: 'Unique application identifier',
      },
    },
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'School',
    },
    {
      name: 'studentInfo',
      type: 'group',
      label: 'Student Information',
      fields: [
        {
          name: 'firstName',
          type: 'text',
          required: true,
          label: 'First Name',
        },
        {
          name: 'lastName',
          type: 'text',
          required: true,
          label: 'Last Name',
        },
        {
          name: 'dateOfBirth',
          type: 'date',
          required: true,
          label: 'Date of Birth',
        },
        {
          name: 'grade',
          type: 'text',
          required: true,
          label: 'Grade Applying For',
        },
        {
          name: 'gender',
          type: 'select',
          options: [
            { label: 'Male', value: 'MALE' },
            { label: 'Female', value: 'FEMALE' },
            { label: 'Other', value: 'OTHER' },
            { label: 'Prefer not to say', value: 'NOT_SPECIFIED' },
          ],
          label: 'Gender',
        },
        {
          name: 'previousSchool',
          type: 'text',
          label: 'Previous School',
        },
        {
          name: 'currentGPA',
          type: 'number',
          label: 'Current GPA',
          admin: {
            step: 0.01,
          },
        },
      ],
    },
    {
      name: 'parentInfo',
      type: 'group',
      label: 'Parent/Guardian Information',
      fields: [
        {
          name: 'primaryParent',
          type: 'group',
          label: 'Primary Parent/Guardian',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              required: true,
              label: 'First Name',
            },
            {
              name: 'lastName',
              type: 'text',
              required: true,
              label: 'Last Name',
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              label: 'Email',
            },
            {
              name: 'phone',
              type: 'text',
              required: true,
              label: 'Phone',
            },
            {
              name: 'occupation',
              type: 'text',
              label: 'Occupation',
            },
            {
              name: 'relationship',
              type: 'select',
              options: [
                { label: 'Mother', value: 'MOTHER' },
                { label: 'Father', value: 'FATHER' },
                { label: 'Guardian', value: 'GUARDIAN' },
                { label: 'Other', value: 'OTHER' },
              ],
              label: 'Relationship to Student',
            },
          ],
        },
        {
          name: 'secondaryParent',
          type: 'group',
          label: 'Secondary Parent/Guardian (Optional)',
          fields: [
            {
              name: 'firstName',
              type: 'text',
              label: 'First Name',
            },
            {
              name: 'lastName',
              type: 'text',
              label: 'Last Name',
            },
            {
              name: 'email',
              type: 'email',
              label: 'Email',
            },
            {
              name: 'phone',
              type: 'text',
              label: 'Phone',
            },
            {
              name: 'occupation',
              type: 'text',
              label: 'Occupation',
            },
            {
              name: 'relationship',
              type: 'select',
              options: [
                { label: 'Mother', value: 'MOTHER' },
                { label: 'Father', value: 'FATHER' },
                { label: 'Guardian', value: 'GUARDIAN' },
                { label: 'Other', value: 'OTHER' },
              ],
              label: 'Relationship to Student',
            },
          ],
        },
        {
          name: 'address',
          type: 'group',
          label: 'Family Address',
          fields: [
            {
              name: 'street',
              type: 'text',
              required: true,
              label: 'Street Address',
            },
            {
              name: 'city',
              type: 'text',
              required: true,
              label: 'City',
            },
            {
              name: 'state',
              type: 'text',
              required: true,
              label: 'State',
            },
            {
              name: 'zipCode',
              type: 'text',
              required: true,
              label: 'ZIP Code',
            },
          ],
        },
      ],
    },
    {
      name: 'documents',
      type: 'array',
      label: 'Application Documents',
      fields: [
        {
          name: 'documentType',
          type: 'select',
          options: [
            { label: 'Birth Certificate', value: 'BIRTH_CERTIFICATE' },
            { label: 'Previous School Records', value: 'SCHOOL_RECORDS' },
            { label: 'Immunization Records', value: 'IMMUNIZATION' },
            { label: 'Photo ID', value: 'PHOTO_ID' },
            { label: 'Recommendation Letter', value: 'RECOMMENDATION' },
            { label: 'Other', value: 'OTHER' },
          ],
          required: true,
          label: 'Document Type',
        },
        {
          name: 'document',
          type: 'relationship',
          relationTo: 'media',
          required: true,
          label: 'Document File',
        },
        {
          name: 'notes',
          type: 'text',
          label: 'Notes',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Submitted', value: 'SUBMITTED' },
        { label: 'Under Review', value: 'UNDER_REVIEW' },
        { label: 'Interview Scheduled', value: 'INTERVIEW_SCHEDULED' },
        { label: 'Accepted', value: 'ACCEPTED' },
        { label: 'Waitlisted', value: 'WAITLISTED' },
        { label: 'Rejected', value: 'REJECTED' },
        { label: 'Withdrawn', value: 'WITHDRAWN' },
      ],
      defaultValue: 'DRAFT',
      required: true,
      label: 'Application Status',
    },
    {
      name: 'submittedAt',
      type: 'date',
      label: 'Submission Date',
    },
    {
      name: 'reviewedBy',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          in: ['ADMIN', 'TEACHER'],
        },
      },
      label: 'Reviewed By',
    },
    {
      name: 'reviewNotes',
      type: 'richText',
      label: 'Review Notes',
      admin: {
        description: 'Internal notes for admissions committee',
      },
    },
    {
      name: 'interviewDate',
      type: 'date',
      label: 'Interview Date',
    },
    {
      name: 'tuitionAidRequested',
      type: 'checkbox',
      label: 'Financial Aid Requested',
    },
    {
      name: 'enrollmentDeadline',
      type: 'date',
      label: 'Enrollment Response Deadline',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Ensure school is set from user when creating
        if (operation === 'create') {
          if (!data) return data
          const user = req.user as { school?: number | string } | undefined
          if (user?.school && !data.school) {
            data.school = user.school
          }
        }
        return data
      },
    ],
  },
}
