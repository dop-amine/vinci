// Service exports
export { BaseService } from './base.service'
export { DashboardService } from './dashboard.service'

// Import service classes for instantiation
import { DashboardService } from './dashboard.service'

// Service instances
export const dashboardService = new DashboardService()
