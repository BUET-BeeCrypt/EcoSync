import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  addRole,
  assignPermission,
  deleteRole,
  getRolePermissions,
  getRoles,
  revokePermission,
  updateRole,
} from "../api/admin";

const newRole = {
  old_name: null,
  role_name: "",
  description: "",
};

export default function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [editingRole, setEditingRole] = useState(null);
  const [deletingRole, setDeletingRole] = useState(null);

  const [rolePermissions, setRolePermissions] = useState([]);

  const rolePermissionRef = useRef();

  useEffect(() => {
    toast.promise(getRoles().then(setRoles), {
      loading: "Loading roles...",
      success: "Roles loaded!",
      error: "Failed to load roles",
    });
  }, []);

  useEffect(() => {
    if (editingRole) {
      toast.promise(
        getRolePermissions(editingRole.role_name).then(setRolePermissions),
        {
          loading: "Loading role permissions...",
          success: "Role permissions loaded!",
          error: "Failed to load role permissions",
        }
      );
    } else {
      setRolePermissions([]);
    }
  }, [editingRole]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Role Management</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Admin
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Roles
            </li>
          </ol>
        </nav>
      </div>
      {deletingRole && (
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Delete Role</h4>
                <p>
                  Are you sure you want to delete role{" "}
                  <strong>{deletingRole.name}</strong>?
                </p>
                <button
                  className="btn btn-danger mr-2"
                  onClick={() => {
                    toast.promise(
                      deleteRole(deletingRole.name).then(() =>
                        setRoles((roles) =>
                          roles.filter(
                            (role) => role.name !== deletingRole.name
                          )
                        )
                      ),
                      {
                        loading: "Deleting role...",
                        success: "Role deleted!",
                        error: "Failed to delete role",
                      }
                    );
                    setDeletingRole(null);
                  }}
                >
                  Delete
                </button>
                <button
                  className="btn btn-light"
                  onClick={() => setDeletingRole(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingRole && (
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">
                  {editingRole.old_name ? "Edit" : "Add"} Role
                </h4>
                <div className="row">
                  <form className="col-md-6">
                    <div className="form-group">
                      <label htmlFor="role_name">Role Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="role_name"
                        placeholder="Enter role name"
                        value={editingRole.role_name}
                        onChange={(event) =>
                          setEditingRole({
                            ...editingRole,
                            role_name: event.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Details</label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows="4"
                        placeholder="Enter role description"
                        value={editingRole.description}
                        onChange={(event) =>
                          setEditingRole({
                            ...editingRole,
                            description: event.target.value,
                          })
                        }
                      ></textarea>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary mr-2"
                      onClick={(event) => {
                        event.preventDefault();
                        if (!editingRole.role_name) {
                          toast.error("Role name is required");
                          return;
                        } else if (!editingRole.description) {
                          toast.error("Role description are required");
                          return;
                        }

                        if (editingRole.old_name) {
                          toast.promise(
                            updateRole(
                              editingRole.old_name,
                              editingRole.role_name,
                              editingRole.description
                            ).then(() => {
                              setRoles((roles) =>
                                roles.map((role) =>
                                  role.name === editingRole.old_name
                                    ? {
                                        name: editingRole.role_name,
                                        details: editingRole.description,
                                      }
                                    : role
                                )
                              );
                              setEditingRole(null);
                            }),
                            {
                              loading: "Updating role...",
                              success: "Role updated!",
                              error: "Failed to update role",
                            }
                          );
                        } else {
                          toast.promise(
                            addRole(
                              editingRole.role_name,
                              editingRole.description
                            ).then((role) => {
                              setRoles((roles) => [
                                ...roles,
                                {
                                  name: editingRole.role_name,
                                  details: editingRole.description,
                                },
                              ]);
                              setEditingRole(null);
                            }),
                            {
                              loading: "Creating role...",
                              success: "Role created!",
                              error: "Failed to create role",
                            }
                          );
                        }
                      }}
                    >
                      {editingRole.old_name ? "Update" : "Add"}
                    </button>
                    <button
                      className="btn btn-light"
                      onClick={() => setEditingRole(null)}
                    >
                      Cancel
                    </button>
                  </form>

                  {/* Show all role permissions */}
                  <div className="col-md-6">
                    <div className="table-responsive">
                      <table className="table table-outline table-hover">
                        <thead>
                          <th>Permission</th>
                          <th>Action</th>
                        </thead>
                        <tbody>
                          {rolePermissions.map((permission) => (
                            <tr key={permission.permission_name}>
                              <td>{permission.permission_name}</td>
                              <td>
                                <button
                                  className="btn btn-outline-danger btn-sm btn-block"
                                  onClick={() => {
                                    // Remove permission
                                    toast.promise(
                                      revokePermission(
                                        editingRole.role_name,
                                        permission.permission_name
                                      ).then(() => {
                                        setRolePermissions((permissions) =>
                                          permissions.filter(
                                            (p) =>
                                              p.permission_name !==
                                              permission.permission_name
                                          )
                                        );
                                      }),
                                      {
                                        loading: "Removing permission...",
                                        success: "Permission removed!",
                                        error: "Failed to remove permission",
                                      }
                                    );
                                  }}
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                          <td>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Enter role name"
                              ref={rolePermissionRef}
                            />
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-success btn-sm btn-block"
                              onClick={() => {
                                // Add permission
                                const permission_name =
                                  rolePermissionRef.current.value;
                                if (!permission_name) {
                                  toast.error("Permission name is required");
                                  return;
                                }
                                toast.promise(
                                  assignPermission(
                                    editingRole.role_name,
                                    permission_name
                                  ).then(() => {
                                    setRolePermissions((permissions) => [
                                      ...permissions,
                                      { permission_name },
                                    ]);
                                    rolePermissionRef.current.value = "";
                                  }),
                                  {
                                    loading: "Adding permission...",
                                    success: "Permission added!",
                                    error: "Failed to add permission",
                                  }
                                );
                              }}
                            >
                              Add
                            </button>
                          </td>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Roles
                <span className="float-right">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setEditingRole(newRole)}
                  >
                    <i className="mdi mdi-plus mr-2"></i>
                    Add Role
                  </button>
                </span>
              </h4>
              <p className="card-description">Manage roles</p>
              <div className="table-responsive">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th>Role Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roles.map((role) => (
                      <tr key={role.name}>
                        <td>{role.name}</td>
                        <td>{role.details}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              setEditingRole({
                                old_name: role.name,
                                role_name: role.name,
                                description: role.details,
                              })
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => setDeletingRole(role)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
