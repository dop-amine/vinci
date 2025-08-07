export abstract class BaseService {
  protected handleError(operation: string, error: unknown): never {
    console.error(`Service error in ${operation}:`, error)

    if (error instanceof Error) {
      throw new Error(`${operation} failed: ${error.message}`)
    }

    throw new Error(`${operation} failed: Unknown error`)
  }

  protected validateRequired<T>(data: T, fields: (keyof T)[]): void {
    for (const field of fields) {
      if (!data[field]) {
        throw new Error(`Required field missing: ${String(field)}`)
      }
    }
  }

  protected sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '')
  }
}
