import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";

interface ResourceAttributes {
  id: number;
  label: string
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
  }
}, {
  sequelize: datasource,
  tableName: "resources",
});

Resource.sync();

export default Resource;