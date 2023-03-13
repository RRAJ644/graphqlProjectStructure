import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
export default {
  Query: {
    findAllUser: async (parent, args, ctx) => {
      try {
        const {
          models: { User },
        } = ctx
        const users = await User.findAll()
        console.log(users, '======users')
        return users
      } catch (error) {
        return new Error(error)
      }
    },

  },
  Mutation: {
    createUser: async (parent, args, ctx) => {
      try {
        const {
          models: { User },
        } = ctx

        let { input } = args

        input = {
          ...input,
          password: await bcrypt.hash(input.password, 10),
        }
        const user = await User.create(input)
        return user
      } catch (error) {
        return new Error(error)
      }
    },

    loginUser: async (parent, args, ctx) => {
      try {
        const {
          models: { User },
        } = ctx

        const { email, password } = args?.input

        const user = await User.findOne({ where: { email } })
        if (!user) {
          return new Error('User not exist!')
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password)

        if (!isPasswordMatch) {
          return new Error('Invalid credentials')
        }

        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
          expiresIn: '1d',
        })

        return { token: token, email }
      } catch (error) {
        return new Error(error)
      }
    },
  },
}
