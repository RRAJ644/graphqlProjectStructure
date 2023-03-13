import { moduleMiddlewares } from '../modules/index.js'
import permission from './auth.middleware.js'
import permissions from './permissions.middleware.js'

const middlewares = [permission, permissions, ...moduleMiddlewares]
export default middlewares
