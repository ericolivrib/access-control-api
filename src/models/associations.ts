import Access from "./accesses.model";
import Permission from "./permissions.model";
import User from "./users.model";

export function createModelAssociations() {
  Access.belongsTo(Permission, {
    targetKey: 'id',
    foreignKey: 'permissionId',
    as: 'permission'
  });

  Permission.hasMany(Access, {
    sourceKey: 'id',
    foreignKey: 'permissionId',
    as: 'accesses'
  });

  Access.belongsTo(User, {
    targetKey: 'id',
    foreignKey: 'userId',
    as: 'user',
  });

  User.hasMany(Access, {
    sourceKey: 'id',
    foreignKey: 'userId',
    as: 'accesses'
  });
}