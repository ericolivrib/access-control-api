import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";

export enum PermissionType {
  REVOKE_ACCESS = 'revoke_access',
  GRANT_ACCESS = 'grant_access',
  UPDATE_ACCESS_EXPIRATION = 'update_access_expiration',
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  GET_USERS = 'get_users',
  CHANGE_USER_ACTIVATION = 'change_user_activation'
}

interface PermissionAttributes {
  id: number;
  type: PermissionType;
  description: string;
}

type PermissionCreationAttributes = Optional<PermissionAttributes, 'id'>;

export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> { }

Permission.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(PermissionType)),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
}, {
  sequelize: datasource,
  tableName: "permissions",
});

Permission.sync();

export default Permission;