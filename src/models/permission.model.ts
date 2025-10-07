import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";
import AccessModel from "./access.model";

export const PERMISSION_TYPES = ['revoke_access', 'grant_access', 'update_access_expiration', 'create_user', 'update_user', 'get_users', 'change_user_activation', 'get_user_accesses'] as const;

export type PermissionType = typeof PERMISSION_TYPES[number];

interface PermissionAttributes {
  id: number;
  type: PermissionType;
  description: string;
  accesses?: AccessModel[];
}

type PermissionCreationAttributes = Optional<PermissionAttributes, 'id' | 'accesses'>;

class PermissionModel extends Model<PermissionAttributes, PermissionCreationAttributes> {
  static findByType(type: PermissionType): Promise<PermissionModel | null> {
    return PermissionModel.findOne({
      attributes: ['id', 'type', 'description'],
      where: { type }
    });
  }
}

PermissionModel.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM(...PERMISSION_TYPES),
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

PermissionModel.sync();

export { PermissionModel };