import { AccessModel } from "./access.model";
import { PermissionModel } from "./permission.model";
import { UserModel } from "./user.model";

export function createModelAssociations() {
  AccessModel.belongsTo(PermissionModel, {
    targetKey: 'id',
    foreignKey: 'permissionId',
    as: 'permission'
  });

  PermissionModel.hasMany(AccessModel, {
    sourceKey: 'id',
    foreignKey: 'permissionId',
    as: 'accesses'
  });

  AccessModel.belongsTo(UserModel, {
    targetKey: 'id',
    foreignKey: 'userId',
    as: 'user',
  });

  UserModel.hasMany(AccessModel, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'accesses'
  });
}