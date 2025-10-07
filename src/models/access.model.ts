import datasource from "@/datasource";
import { randomUUID, UUID } from "node:crypto";
import { DataTypes, Model, Optional } from "sequelize";
import { UserModel } from "./user.model";
import { PermissionModel, PermissionType } from "./permission.model";

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
  user?: UserModel;
  permission?: PermissionModel;
}

type AccessCreationAttributes = Optional<AccessAttributes, 'id' | 'status' | 'revokedAt' | 'user' | 'permission'>;

class AccessModel extends Model<AccessAttributes, AccessCreationAttributes> {

  static async countGrantedByPermissionTypeAndUserId(userId: UUID, type: PermissionType): Promise<number> {
    return AccessModel.count({
      where: {
        userId,
        status: 'granted',
      },
      include: {
        model: PermissionModel,
        as: 'permission',
        where: { type }
      }
    });
  }
}

AccessModel.init({
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

AccessModel.sync();

export { AccessModel };