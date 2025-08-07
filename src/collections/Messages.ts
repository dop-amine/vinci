import type { CollectionConfig, Where } from 'payload'
import { adminOnly, messagesReadableWhere } from '../lib/access'

export const Messages: CollectionConfig = {
  slug: 'messages',
  access: {
    read: messagesReadableWhere,
    create: ({ req }) => !!req.user,
    update: ({ req }) => {
      // Only admin or original sender can update (e.g., mark scheduled), recipients can update readReceipts on their own
      const userId = req.user?.id
      if (adminOnly({ req })) return true
      if (!userId) return false

      const where: Where = {
        or: [{ sender: { equals: userId } }, { recipients: { in: [userId] } }],
      }
      return where
    },
    delete: adminOnly,
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'sender', 'recipients', 'status', 'createdAt'],
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Subject',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Message Content',
    },
    {
      name: 'sender',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Sender',
    },
    {
      name: 'recipients',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      required: true,
      label: 'Recipients',
    },
    {
      name: 'messageType',
      type: 'select',
      options: [
        { label: 'Individual Message', value: 'INDIVIDUAL' },
        { label: 'Group Message', value: 'GROUP' },
        { label: 'Class Announcement', value: 'CLASS_ANNOUNCEMENT' },
        { label: 'School-wide Announcement', value: 'SCHOOL_ANNOUNCEMENT' },
        { label: 'Emergency Alert', value: 'EMERGENCY' },
        { label: 'Newsletter', value: 'NEWSLETTER' },
      ],
      required: true,
      label: 'Message Type',
    },
    {
      name: 'priority',
      type: 'select',
      options: [
        { label: 'Low', value: 'LOW' },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Urgent', value: 'URGENT' },
      ],
      defaultValue: 'NORMAL',
      required: true,
      label: 'Priority Level',
    },
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      required: true,
      label: 'School',
    },
    {
      name: 'relatedStudent',
      type: 'relationship',
      relationTo: 'students',
      label: 'Related Student',
      admin: {
        description: 'If this message is about a specific student',
      },
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Sent', value: 'SENT' },
        { label: 'Scheduled', value: 'SCHEDULED' },
        { label: 'Failed', value: 'FAILED' },
      ],
      defaultValue: 'DRAFT',
      required: true,
      label: 'Status',
    },
    {
      name: 'sentAt',
      type: 'date',
      label: 'Sent Date/Time',
    },
    {
      name: 'scheduledFor',
      type: 'date',
      label: 'Scheduled Send Time',
      admin: {
        description: 'Schedule this message to be sent at a future date/time',
      },
    },
    {
      name: 'readReceipts',
      type: 'array',
      label: 'Read Receipts',
      admin: {
        description: 'Track who has read this message',
      },
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
          label: 'User',
        },
        {
          name: 'readAt',
          type: 'date',
          required: true,
          label: 'Read At',
        },
      ],
    },
    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
      label: 'Attachments',
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'messageTemplates',
      label: 'Message Template Used',
      admin: {
        description: 'If this message was created from a template',
      },
    },
    {
      name: 'parentThread',
      type: 'relationship',
      relationTo: 'messages',
      label: 'Reply To Message',
      admin: {
        description: 'If this is a reply to another message',
      },
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'In-App Notification', value: 'IN_APP' },
        { label: 'Email', value: 'EMAIL' },
        { label: 'SMS', value: 'SMS' },
        { label: 'Push Notification', value: 'PUSH' },
      ],
      defaultValue: ['IN_APP', 'EMAIL'],
      label: 'Delivery Methods',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        if (!data) return data
        if (operation === 'create') {
          // Force sender to current user and set school if not provided
          if (req.user?.id) {
            data.sender = req.user.id
          }
          if (req.user?.school && !data.school) {
            data.school = req.user.school
          }
        }
        return data
      },
    ],
  },
}
