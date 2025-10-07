import datasource from "@/datasource";
import { randomUUID, UUID } from "node:crypto";
import { Model, DataTypes, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import ms from "ms";
import { environment } from "@/schemas/env.schema";
import { hashPassword } from "@/utils/hash-password";
import { AccessModel } from "./accesses.model";
import { PermissionModel } from "./permissions.model";

export type UserRole = 'admin' | 'user';

interface UserAttributes {
  id: UUID;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  accesses?: AccessModel[];
}

type UserCreationAttributes = Optional<UserAttributes, 'id' | 'active' | 'role' | 'accesses'>;

class UserModel extends Model<UserAttributes, UserCreationAttributes> {
  public static async findByEmail(email: string): Promise<UserModel | null> {
    return UserModel.findOne({ where: { email } });
  }

  public static async findWithAccessesByPk(id: string): Promise<UserModel | null> {
    return UserModel.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: {
        model: AccessModel,
        as: 'accesses',
        required: false,
        where: {
          status: 'granted'
        },
        include: [{
          model: PermissionModel,
          as: 'permission'
        }]
      }
    });
  }

  public isPasswordValid(password: string): boolean {
    return bcrypt.compareSync(password, this.dataValues.password);
  }

  public generateAccessToken(): string {
    const payload = {
      iss: environment.JWT_ISSUER,
      sub: this.dataValues.id,
      jti: randomUUID(),
      role: this.dataValues.role
    };

    const expiresIn = environment.JWT_EXPIRES_IN as ms.StringValue;
    const secret = environment.JWT_SECRET

    const token = jwt.sign(payload, secret, { expiresIn });
    return token;
  }
}

UserModel.init({
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
        msg: 'A senha deve ter entre 8 e 100 caracteres',
        args: [8, 100],
      },
    },
    set(raw: string) {
      const hashedPassword = hashPassword(raw);
      this.setDataValue('password', hashedPassword);
    },
  }
}, {
  sequelize: datasource,
  tableName: "users",
});

UserModel.sync();

export { UserModel };