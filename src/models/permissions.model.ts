import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";
import Access from "./accesses.model";

export const PERMISSION_TYPES = ['revoke_access', 'grant_access', 'update_access_expiration', 'create_user', 'update_user', 'get_users', 'change_user_activation'] as const;

export type PermissionType = typeof PERMISSION_TYPES[number];

interface PermissionAttributes {
  id: number;
  type: PermissionType;
  description: string;
  accesses?: Access[];
}

type PermissionCreationAttributes = Optional<PermissionAttributes, 'id' | 'accesses'>;

export class Permission extends Model<PermissionAttributes, PermissionCreationAttributes> { }

Permission.init({
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

Access.belongsTo(Permission, {
  targetKey: 'id',
  foreignKey: 'permissionId',
  as: 'permission'
});

Permission.hasMany(Access, {
  sourceKey: 'id',
  foreignKey: 'permissionId',
  as: 'accesses'
});

Permission.sync();

export default Permission;