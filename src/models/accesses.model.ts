import datasource from "@/datasource";
import { randomUUID, UUID } from "node:crypto";
import { DataTypes, Model, Optional } from "sequelize";
import User from "./users.model";
import Permission from "./permissions.model";

type AccessStatus = 'granted' | 'revoked' | 'expired';

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

class Access extends Model<AccessAttributes, AccessCreationAttributes> { }

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

Access.sync()

export default Access;