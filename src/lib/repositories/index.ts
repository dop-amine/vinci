// Repository exports for easy imports
export { BaseRepository } from './base.repository'
export { UserRepository } from './user.repository'
export { StudentRepository } from './student.repository'
export { MessageRepository } from './message.repository'

// Import repository classes for instantiation
import { UserRepository } from './user.repository'
import { StudentRepository } from './student.repository'
import { MessageRepository } from './message.repository'

// Repository instances (singletons)
export const userRepository = new UserRepository()
export const studentRepository = new StudentRepository()
export const messageRepository = new MessageRepository()
