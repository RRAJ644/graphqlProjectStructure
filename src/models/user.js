import { DataTypes, Model } from "sequelize"

export default class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        firstName: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        lastName: {
          type: DataTypes.STRING,
          allowNull: false,
        },

        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },

        password: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        paranoid: true,
        underscored: true,
      }
    )
  }
}
