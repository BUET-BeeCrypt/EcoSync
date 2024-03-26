const { hasPermission } = require('../api/rbac/repository');

function checkPermission(permissionSlug) {
  return async (request, response, next) => {

    const permission = await hasPermission(request.user.role, permissionSlug);

    if (!permission) {
      return response.status(403).json({ message: `Access Denied! ${request.user.role} role have no permission for this endpoint!` });
    }

    next();
  }
}

module.exports = checkPermission;