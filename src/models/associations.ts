import AccessModel from "./accesses.model";
import PermissionModel from "./permissions.model";
import UserModel from "./users.model";

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