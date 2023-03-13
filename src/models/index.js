import Sequelize from 'sequelize'
import User from '../models/user.js'
import dotenv from 'dotenv'
dotenv.config()

const sequelize = new Sequelize(
  process.env.DB,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.HOST,
    port: process.env.DB_PORT, //5432
    dialect: 'postgres',

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
)

const models = {
  User: User.init(sequelize, Sequelize),
}

try {
  sequelize.authenticate()
  console.info('Connection has been established successfully.')
} catch (error) {
  console.error('Unable to connect to the database:', error)
}

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

export default models
