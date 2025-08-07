import type { CollectionConfig } from 'payload'
import { adminOnly, adminOrSameSchool } from '../lib/access'

export const Inquiries: CollectionConfig = {
  slug: 'inquiries',
  access: {
    // Public can create inquiries; reading restricted by school and role
    read: ({ req }) => adminOrSameSchool('school')({ req }) || false,
    create: () => true,
    update: ({ req }) => adminOrSameSchool('school')({ req }) || false,
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'studentName',
    defaultColumns: ['studentName', 'parentEmail', 'gradeInterested', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'studentName',
      type: 'text',
      required: true,
      label: 'Student Name',
    },
    {
      name: 'parentFirstName',
      type: 'text',
      required: true,
      label: 'Parent/Guardian First Name',
    },
    {
      name: 'parentLastName',
      type: 'text',
      required: true,
      label: 'Parent/Guardian Last Name',
    },
    {
      name: 'parentEmail',
      type: 'email',
      required: true,
      label: 'Parent/Guardian Email',
    },
    {
      name: 'parentPhone',
      type: 'text',
      label: 'Parent/Guardian Phone',
    },
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'School of Interest',
    },
    {
      name: 'gradeInterested',
      type: 'text',
      required: true,
      label: 'Grade Level Interested',
    },
    {
      name: 'enrollmentYear',
      type: 'select',
      options: [
        { label: '2024-2025', value: '2024-2025' },
        { label: '2025-2026', value: '2025-2026' },
        { label: '2026-2027', value: '2026-2027' },
      ],
      required: true,
      label: 'Intended Enrollment Year',
    },
    {
      name: 'inquiryType',
      type: 'select',
      options: [
        { label: 'General Information', value: 'GENERAL' },
        { label: 'School Tour Request', value: 'TOUR' },
        { label: 'Application Process', value: 'APPLICATION' },
        { label: 'Tuition & Financial Aid', value: 'FINANCIAL' },
        { label: 'Academic Programs', value: 'ACADEMIC' },
        { label: 'Other', value: 'OTHER' },
      ],
      required: true,
      label: 'Type of Inquiry',
    },
    {
      name: 'message',
      type: 'textarea',
      label: 'Message/Questions',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'New', value: 'NEW' },
        { label: 'Contacted', value: 'CONTACTED' },
        { label: 'Tour Scheduled', value: 'TOUR_SCHEDULED' },
        { label: 'Application Sent', value: 'APPLICATION_SENT' },
        { label: 'Closed', value: 'CLOSED' },
      ],
      defaultValue: 'NEW',
      required: true,
      label: 'Status',
    },
    {
      name: 'assignedTo',
      type: 'relationship',
      relationTo: 'users',
      filterOptions: {
        role: {
          in: ['ADMIN', 'TEACHER'],
        },
      },
      label: 'Assigned Staff Member',
    },
    {
      name: 'followUpDate',
      type: 'date',
      label: 'Follow-up Date',
    },
    {
      name: 'notes',
      type: 'richText',
      label: 'Internal Notes',
      admin: {
        description: 'Internal notes for staff use only',
      },
    },
    {
      name: 'source',
      type: 'select',
      options: [
        { label: 'Website', value: 'WEBSITE' },
        { label: 'Referral', value: 'REFERRAL' },
        { label: 'Social Media', value: 'SOCIAL_MEDIA' },
        { label: 'Advertisement', value: 'ADVERTISEMENT' },
        { label: 'Event', value: 'EVENT' },
        { label: 'Other', value: 'OTHER' },
      ],
      label: 'How did you hear about us?',
    },
  ],
}
