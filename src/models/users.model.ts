import datasource from "@/datasource";
import { randomUUID, UUID } from "node:crypto";
import { Model, DataTypes, Optional } from "sequelize";

type UserRole = 'admin' | 'user';

interface UserAttributes {
  id: UUID;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'active' | 'role'>;;

class User extends Model<UserAttributes, UserCreationAttributes> {
  public static async findByEmail(email: string): Promise<User | null> {
    return User.findOne({ where: { email } });
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: randomUUID(),
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  role: {
    type: DataTypes.ENUM('admin', 'user'),
    defaultValue: 'user',
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        msg: 'A senha deve ter entre 6 e 100 caracteres',
        args: [8, 100],
      },
    },
  }
}, {
  sequelize: datasource,
  tableName: "users",
});

User.sync();

export default User;