import { getPayload } from 'payload'
import config from '@/payload.config'
import type { PaginatedDocs, Where, CollectionSlug } from 'payload'

export abstract class BaseRepository<T extends object = object> {
  protected payload!: Awaited<ReturnType<typeof getPayload>>

  constructor(protected collection: CollectionSlug) {}

  protected async getPayloadInstance() {
    if (!this.payload) {
      this.payload = await getPayload({ config })
    }
    return this.payload
  }

  async findById(id: string | number, depth = 1): Promise<T | null> {
    try {
      const payload = await this.getPayloadInstance()
      const result = await payload.findByID({
        collection: this.collection,
        id,
        depth,
      })
      return result as T
    } catch (error) {
      console.error(`Error finding ${this.collection} by ID ${id}:`, error)
      return null
    }
  }

  async findMany(
    options: {
      where?: Where
      limit?: number
      page?: number
      sort?: string
      depth?: number
    } = {},
  ): Promise<PaginatedDocs<T>> {
    try {
      const payload = await this.getPayloadInstance()
      const result = await payload.find({
        collection: this.collection,
        where: options.where,
        limit: options.limit || 50,
        page: options.page || 1,
        sort: options.sort,
        depth: options.depth || 1,
      })
      return result as PaginatedDocs<T>
    } catch (error) {
      console.error(`Error finding ${this.collection}:`, error)
      throw new Error(`Failed to fetch ${this.collection}`)
    }
  }

  async count(where?: Where): Promise<number> {
    try {
      const payload = await this.getPayloadInstance()
      const result = await payload.count({
        collection: this.collection,
        where,
      })
      return result.totalDocs
    } catch (error) {
      console.error(`Error counting ${this.collection}:`, error)
      return 0
    }
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const payload = await this.getPayloadInstance()
      const result = await payload.create({
        collection: this.collection,
        data,
      })
      return result as T
    } catch (error) {
      console.error(`Error creating ${this.collection}:`, error)
      throw new Error(`Failed to create ${this.collection}`)
    }
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    try {
      const payload = await this.getPayloadInstance()
      const result = await payload.update({
        collection: this.collection,
        id,
        data,
      })
      return result as T
    } catch (error) {
      console.error(`Error updating ${this.collection} ${id}:`, error)
      throw new Error(`Failed to update ${this.collection}`)
    }
  }

  async delete(id: string | number): Promise<boolean> {
    try {
      const payload = await this.getPayloadInstance()
      await payload.delete({
        collection: this.collection,
        id,
      })
      return true
    } catch (error) {
      console.error(`Error deleting ${this.collection} ${id}:`, error)
      return false
    }
  }
}
