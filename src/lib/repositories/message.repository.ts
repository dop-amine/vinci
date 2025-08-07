import { BaseRepository } from './base.repository'
import type { Message } from '@/payload-types'
import type { Where } from 'payload'

export class MessageRepository extends BaseRepository<Message> {
  constructor() {
    super('messages')
  }

  async findByRecipient(
    recipientId: string | number,
    options: {
      unreadOnly?: boolean
      page?: number
      limit?: number
      dateRange?: { start?: Date; end?: Date }
    } = {},
  ): Promise<{ docs: Message[]; totalDocs: number; unreadCount: number }> {
    const where: Where = {
      recipients: { in: [recipientId] },
    }

    if (options.unreadOnly) {
      where['readReceipts.user'] = { not_in: [recipientId] }
    }

    if (options.dateRange?.start) {
      where.createdAt = { greater_than: options.dateRange.start }
    }

    if (options.dateRange?.end) {
      where.createdAt = {
        ...where.createdAt,
        less_than: options.dateRange.end,
      }
    }

    const [messages, unreadCount] = await Promise.all([
      this.findMany({
        where,
        page: options.page || 1,
        limit: options.limit || 20,
        sort: '-createdAt',
        depth: 2,
      }),
      this.count({
        recipients: { in: [recipientId] },
        'readReceipts.user': { not_in: [recipientId] },
      }),
    ])

    return {
      docs: messages.docs,
      totalDocs: messages.totalDocs,
      unreadCount,
    }
  }

  async findBySender(
    senderId: string | number,
    page = 1,
    limit = 20,
  ): Promise<{ docs: Message[]; totalDocs: number }> {
    const result = await this.findMany({
      where: { sender: { equals: senderId } },
      page,
      limit,
      sort: '-createdAt',
      depth: 2,
    })

    return result
  }

  async findBySchool(
    schoolId: string | number,
    options: {
      messageType?: string
      priority?: string
      dateRange?: { start?: Date; end?: Date }
      page?: number
      limit?: number
    } = {},
  ): Promise<{ docs: Message[]; totalDocs: number }> {
    const where: Where = { school: { equals: schoolId } }

    if (options.messageType) {
      where.messageType = { equals: options.messageType }
    }

    if (options.priority) {
      where.priority = { equals: options.priority }
    }

    if (options.dateRange?.start) {
      where.createdAt = { greater_than: options.dateRange.start }
    }

    const result = await this.findMany({
      where,
      page: options.page || 1,
      limit: options.limit || 50,
      sort: '-createdAt',
      depth: 2,
    })

    return result
  }

  async getMessageStats(
    schoolId: string | number,
    timeframe: 'week' | 'month' | 'year' = 'week',
  ): Promise<{
    total: number
    sent: number
    draft: number
    scheduled: number
    byType: Record<string, number>
    byPriority: Record<string, number>
  }> {
    const now = new Date()
    let startDate: Date

    switch (timeframe) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
    }

    const baseWhere = {
      school: { equals: schoolId },
      createdAt: { greater_than: startDate },
    }

    const [total, sent, draft, scheduled] = await Promise.all([
      this.count(baseWhere),
      this.count({ ...baseWhere, status: { equals: 'SENT' } }),
      this.count({ ...baseWhere, status: { equals: 'DRAFT' } }),
      this.count({ ...baseWhere, status: { equals: 'SCHEDULED' } }),
    ])

    // Get messages for type and priority breakdown
    const messages = await this.findBySchool(schoolId, {
      dateRange: { start: startDate },
      limit: 1000,
    })

    const byType = messages.docs.reduce(
      (acc, msg) => {
        const type = msg.messageType || 'UNKNOWN'
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const byPriority = messages.docs.reduce(
      (acc, msg) => {
        const priority = msg.priority || 'NORMAL'
        acc[priority] = (acc[priority] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return { total, sent, draft, scheduled, byType, byPriority }
  }

  async markAsRead(messageId: string | number, userId: string | number): Promise<boolean> {
    try {
      const message = await this.findById(messageId, 1)
      if (!message) return false

      type ReadReceipt = NonNullable<Message['readReceipts']>[number]
      const readReceipts: ReadReceipt[] = Array.isArray(message.readReceipts)
        ? (message.readReceipts as ReadReceipt[])
        : []
      const numericUserId = typeof userId === 'string' ? Number(userId) : userId
      const hasRead = readReceipts.some((receipt) => receipt.user === numericUserId)

      if (!hasRead) {
        readReceipts.push({ user: numericUserId as number, readAt: new Date().toISOString() })

        await this.update(messageId, { readReceipts })
      }

      return true
    } catch (error) {
      console.error(`Error marking message ${messageId} as read:`, error)
      return false
    }
  }
}
