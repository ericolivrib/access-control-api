import datasource from "@/datasource";
import { randomUUID, UUID } from "node:crypto";
import { DataTypes, Model, Optional } from "sequelize";
import User from "./users.model";
import Permission, { PermissionType } from "./permissions.model";

export const ACCESS_STATUSES = ['granted', 'revoked', 'expired'] as const;

export type AccessStatus = typeof ACCESS_STATUSES[number];

interface AccessAttributes {
  id: UUID;
  userId: UUID;
  permissionId: number;
  status: AccessStatus;
  expiresAt: Date;
  grantedAt: Date;
  revokedAt: Date;
  user?: User;
  permission?: Permission;
}

type AccessCreationAttributes = Optional<AccessAttributes, 'id' | 'status' | 'revokedAt' | 'user' | 'permission'>;

class Access extends Model<AccessAttributes, AccessCreationAttributes> {

  static async countGrantedByPermissionTypeAndUserId(userId: UUID, type: PermissionType): Promise<number> {
    return Access.count({
      attributes: { exclude: ['revokedAt'] },
      where: {
        userId,
        status: 'granted',
      },
      include: {
        model: Permission,
        as: 'permission',
        where: { type }
      }
    });
  }
}

Access.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: randomUUID(),
  },
  status: {
    type: DataTypes.ENUM('granted', 'revoked', 'expired'),
    defaultValue: 'granted',
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  permissionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  grantedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  revokedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  sequelize: datasource,
  tableName: "accesses",
});

Access.sync();

export default Access;