import type { CollectionConfig } from 'payload'

export const MessageTemplates: CollectionConfig = {
  slug: 'messageTemplates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'school', 'isActive'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Template Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Template Description',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Welcome Messages', value: 'WELCOME' },
        { label: 'Admissions', value: 'ADMISSIONS' },
        { label: 'Academic Updates', value: 'ACADEMIC' },
        { label: 'Behavioral Reports', value: 'BEHAVIORAL' },
        { label: 'Event Notifications', value: 'EVENTS' },
        { label: 'Emergency Alerts', value: 'EMERGENCY' },
        { label: 'Newsletter', value: 'NEWSLETTER' },
        { label: 'Reminders', value: 'REMINDERS' },
        { label: 'General Communication', value: 'GENERAL' },
      ],
      required: true,
      label: 'Category',
    },
    {
      name: 'school',
      type: 'relationship',
      relationTo: 'schools',
      label: 'School',
      admin: {
        description: 'Leave empty for system-wide templates',
      },
    },
    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Default Subject Line',
      admin: {
        description:
          'Use {{variables}} for dynamic content (e.g., {{studentName}}, {{schoolName}})',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'Template Content',
      admin: {
        description:
          'Use {{variables}} for dynamic content. Available variables depend on the message context.',
      },
    },
    {
      name: 'variables',
      type: 'array',
      label: 'Available Variables',
      admin: {
        description: 'Define the variables that can be used in this template',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Variable Name',
          admin: {
            description: 'Use without brackets (e.g., studentName, parentName)',
          },
        },
        {
          name: 'description',
          type: 'text',
          required: true,
          label: 'Description',
        },
        {
          name: 'example',
          type: 'text',
          label: 'Example Value',
        },
        {
          name: 'required',
          type: 'checkbox',
          label: 'Required Variable',
          defaultValue: false,
        },
      ],
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
      label: 'Default Message Type',
    },
    {
      name: 'defaultPriority',
      type: 'select',
      options: [
        { label: 'Low', value: 'LOW' },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'High', value: 'HIGH' },
        { label: 'Urgent', value: 'URGENT' },
      ],
      defaultValue: 'NORMAL',
      required: true,
      label: 'Default Priority',
    },
    {
      name: 'defaultDeliveryMethods',
      type: 'checkbox-group',
      options: [
        { label: 'In-App Notification', value: 'IN_APP' },
        { label: 'Email', value: 'EMAIL' },
        { label: 'SMS', value: 'SMS' },
        { label: 'Push Notification', value: 'PUSH' },
      ],
      defaultValue: ['IN_APP', 'EMAIL'],
      label: 'Default Delivery Methods',
    },
    {
      name: 'recipientRoles',
      type: 'checkbox-group',
      options: [
        { label: 'Parents', value: 'PARENT' },
        { label: 'Teachers', value: 'TEACHER' },
        { label: 'Students', value: 'STUDENT' },
        { label: 'Admins', value: 'ADMIN' },
      ],
      label: 'Intended Recipient Roles',
      admin: {
        description: 'Who typically receives messages using this template',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      label: 'Template Active',
    },
    {
      name: 'usage',
      type: 'group',
      label: 'Usage Statistics',
      admin: {
        description: 'Automatically tracked usage statistics',
      },
      fields: [
        {
          name: 'timesUsed',
          type: 'number',
          defaultValue: 0,
          label: 'Times Used',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'lastUsed',
          type: 'date',
          label: 'Last Used',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      admin: {
        description: 'Tags to help organize and search templates',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
          label: 'Tag',
        },
      ],
    },
  ],
}
