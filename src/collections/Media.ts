import type { CollectionConfig } from 'payload'
import { adminOnly, allowIfLoggedIn } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    // For MVP: allow authenticated users to read; restrict writes to logged in; deletions to admin
    read: allowIfLoggedIn,
    create: allowIfLoggedIn,
    update: adminOnly,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
