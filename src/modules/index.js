import * as path from 'path'
import { makeExecutableSchema } from '@graphql-tools/schema'

import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { loadFilesSync } from '@graphql-tools/load-files'
import {
  typeDefs as scalarsTypeDefs,
  resolvers as scalarsResolvers,
} from 'graphql-scalars'


const typesArray = [
  ...loadFilesSync(path.join(__dirname, './**/*.graphql')),
  ...scalarsTypeDefs,
]

const resolverArray = [
  ...loadFilesSync(path.join(__dirname, './**/*.resolvers.*')),
  scalarsResolvers,
]

export const typeDefs = mergeTypeDefs(typesArray)
export const resolvers = mergeResolvers(resolverArray)
export const moduleMiddlewares = loadFilesSync(
  path.join(__dirname, './**/*.middleware.js'),
)

const schemaWithoutMiddleware = makeExecutableSchema({
  typeDefs,
  resolvers: { ...resolvers },
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})

export default schemaWithoutMiddleware
