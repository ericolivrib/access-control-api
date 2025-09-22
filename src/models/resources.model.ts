import datasource from "@/datasource";
import { DataTypes, Model, Optional } from "sequelize";

interface ResourceAttributes {
  id: number;
  label: string
}

type ResourceCreationAttributes = Optional<ResourceAttributes, 'id'>;

export class ResourceModel extends Model<ResourceAttributes, ResourceCreationAttributes> { }

ResourceModel.init({
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

export default ResourceModel;