import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";

export enum ResourceType {
  REVOKE_ACCESS = 'revoke_access',
  GRANT_ACCESS = 'grant_access',
  UPDATE_ACCESS_EXPIRATION = 'update_access_expiration',
  CREATE_USER = 'create_user',
  UPDATE_USER = 'update_user',
  GET_USERS = 'get_users',
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