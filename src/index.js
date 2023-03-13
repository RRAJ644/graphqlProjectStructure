import express from 'express'
import { createServer } from 'http'
import { applyMiddleware } from 'graphql-middleware'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import middlewares from './middlewares/index'
import schemaWithoutMiddleware from './modules/index'
import models from './models/index'

const port = process.env.PORT || 4000

;(async () => {
  // Create express
  const app = express()
  const httpServer = createServer(app)

  const schema = applyMiddleware(schemaWithoutMiddleware, ...middlewares)

  // Create apollo server
  const server = new ApolloServer({
    schema,
    context: async (ctx) => ({
      models,
      req: ctx.req,
    }),
  })

  await server.start()
  app.use('/graphql', cors())

  server.applyMiddleware({ app })

  models.sequelize.sync({}).then(() => {
    httpServer.listen(port, () => {
      console.log(`🚀 Query endpoint ready at http://localhost:${port}/graphql`)
      console.log(
        `🚀 Subscription endpoint ready at ws://localhost:${port}/graphql`
      )
    })
  })
})()
