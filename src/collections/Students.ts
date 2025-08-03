import type { CollectionConfig } from 'payload'

export const Students: CollectionConfig = {
  slug: 'students',
  admin: {
    useAsTitle: 'firstName',
    defaultColumns: ['firstName', 'lastName', 'grade', 'school', 'enrollmentStatus'],
  },
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
      label: 'Grade Level',
    },
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'School',
    },
    {
      name: 'parents',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      filterOptions: {
        role: {
          equals: 'PARENT',
        },
      },
      label: 'Parent(s)/Guardian(s)',
    },
    {
      name: 'enrollmentStatus',
      type: 'select',
      options: [
        { label: 'Enrolled', value: 'ENROLLED' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'Waitlisted', value: 'WAITLISTED' },
        { label: 'Withdrawn', value: 'WITHDRAWN' },
        { label: 'Graduated', value: 'GRADUATED' },
      ],
      defaultValue: 'PENDING',
      required: true,
      label: 'Enrollment Status',
    },
    {
      name: 'enrollmentDate',
      type: 'date',
      label: 'Enrollment Date',
    },
    {
      name: 'studentId',
      type: 'text',
      unique: true,
      label: 'Student ID',
      admin: {
        description: 'Unique identifier for the student',
      },
    },
    {
      name: 'emergencyContact',
      type: 'group',
      label: 'Emergency Contact',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Contact Name',
        },
        {
          name: 'relationship',
          type: 'text',
          label: 'Relationship to Student',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Email Address',
        },
      ],
    },
    {
      name: 'medicalInfo',
      type: 'group',
      label: 'Medical Information',
      fields: [
        {
          name: 'allergies',
          type: 'textarea',
          label: 'Allergies',
        },
        {
          name: 'medications',
          type: 'textarea',
          label: 'Current Medications',
        },
        {
          name: 'specialNeeds',
          type: 'textarea',
          label: 'Special Needs or Accommodations',
        },
      ],
    },
    {
      name: 'academicInfo',
      type: 'group',
      label: 'Academic Information',
      fields: [
        {
          name: 'previousSchool',
          type: 'text',
          label: 'Previous School',
        },
        {
          name: 'gpa',
          type: 'number',
          label: 'GPA',
          admin: {
            step: 0.01,
          },
        },
        {
          name: 'notes',
          type: 'richText',
          label: 'Academic Notes',
        },
      ],
    },
  ],
}
