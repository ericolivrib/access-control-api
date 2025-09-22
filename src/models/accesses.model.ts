import datasource from "@/datasource";
import { UUID } from "node:crypto";
import { DataTypes, Model } from "sequelize";
import UserModel from "./users.model";
import ResourceModel from "./resources.model";

type AccessStatus = 'granted' | 'revoked' | 'expired';

type AccessPermission = 'read' | 'write' | 'admin';

interface AccessAttributes {
  id: UUID;
  userId: UUID;
  resourceId: number;
  permission: AccessPermission;
  status: AccessStatus;
  expiresAt: Date;
  grantedAt: Date;
  revokedAt: Date;
}

type AccessCreationAttributes = Omit<AccessAttributes, 'id' | 'status' | 'revokedAt'>;

class AccessModel extends Model<AccessAttributes, AccessCreationAttributes> { }

AccessModel.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
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
  resourceId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  permission: {
    type: DataTypes.ENUM('read', 'write', 'admin'),
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

AccessModel.belongsTo(UserModel, { foreignKey: 'userId', as: 'user' });
UserModel.hasMany(AccessModel, { foreignKey: 'userId', as: 'accesses' });

AccessModel.belongsTo(ResourceModel, { foreignKey: 'resourceId', as: 'resource' });
ResourceModel.hasMany(AccessModel, { foreignKey: 'resourceId', as: 'accesses' });

export default AccessModel;