import jwt from 'jsonwebtoken'
import { AuthenticationError } from 'apollo-server-errors'
import { allow, rule, shield } from 'graphql-shield'

export const validateToken = (authToken) => {
  const token = authToken.slice(7, authToken.length)
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, decoded) => {
      if (err) {
        reject(err)
      }
      return resolve(decoded)
    })
  })
}

export const isAuthenticated = rule()(async (parents, args, ctx) => {
  try {
    const token = ctx.req.headers.authorization
    if (token) {
      let userData
      if (!token.startsWith('Bearer ')) {
        return false
      }
      userData = await validateToken(token)

      let user = await ctx.models.User.findOne({
        where: { id: userData.user.id },
      })
      if (!user) {
        return false
      }
      ctx.req.user = user

      return true
    }
  } catch (error) {
    return new AuthenticationError('Please login')
  }
})

const permission = shield(
  {

    Mutation: {
      '*': isAuthenticated,
      createUser: allow,
      loginUser: allow
    },
  },
  { debug: true }
)

export default permission
