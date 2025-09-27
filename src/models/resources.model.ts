import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";

export enum ResourceType {
  REVOKE_ACCESS = 'revoke_access',
  GRANT_ACCESS = 'grant_access',
  CREATE_USER = 'create_user',
  CHANGE_USER_ACTIVATION = 'change_user_activation'
}

interface ResourceAttributes {
  id: number;
  type: ResourceType;
  description: string;
}

type ResourceCreationAttributes = Optional<ResourceAttributes, 'id'>;

export class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> { }

Resource.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.ENUM(...Object.values(ResourceType)),
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.STRING(100),
    allowNull: true,
  }
}, {
  sequelize: datasource,
  tableName: "resources",
});

Resource.sync();

export default Resource;