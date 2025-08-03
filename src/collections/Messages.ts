import type { CollectionConfig } from 'payload'

export const Messages: CollectionConfig = {
  slug: 'messages',
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
      type: 'checkbox-group',
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
}
