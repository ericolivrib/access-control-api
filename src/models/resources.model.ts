import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";

interface ResourceAttributes {
  id: number;
  label: string;
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
  label: {
    type: DataTypes.STRING(20),
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