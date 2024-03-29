import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  addPermission,
  deletePermission,
  getPermissions,
  updatePermission,
} from "../api/admin";

const newPermission = {
  old_name: null,
  permission_name: "",
  details: "",
};

export default function RoleManagement() {
  const [permissions, setPermissions] = useState([]);
  const [editPermission, setEditPermission] = useState(null);
  const [selectedDeletePermission, setSelectedDeletePermission] =
    useState(null);

  const deleteRef = useRef();

  useEffect(() => {
    toast.promise(getPermissions().then(setPermissions), {
      loading: "Loading permissions...",
      success: "Permissions loaded!",
      error: "Failed to load permissions",
    });
  }, []);

  useEffect(() => {
    if (editPermission) {
      // focus on the first input field
      deleteRef.current.focus();
    }
  }, [selectedDeletePermission]);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Permission Management</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Admin
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Permission
            </li>
          </ol>
        </nav>
      </div>

      {selectedDeletePermission && (
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Delete Permission</h4>
                <p>
                  Are you sure you want to delete permission{" "}
                  <strong>{selectedDeletePermission.name}</strong>?
                </p>
                <button
                  className="btn btn-danger mr-2"
                  onClick={() => {
                    toast.promise(
                      deletePermission(selectedDeletePermission.name).then(() =>
                        setPermissions((permissions) =>
                          permissions.filter(
                            (permission) =>
                              permission.name !== selectedDeletePermission.name
                          )
                        )
                      ),
                      {
                        loading: "Deleting permission...",
                        success: "Permission deleted!",
                        error: "Failed to delete permission",
                      }
                    );
                    setSelectedDeletePermission(null);
                  }}
                >
                  Delete
                </button>
                <button
                  ref={deleteRef}
                  className="btn btn-light"
                  onClick={() => setSelectedDeletePermission(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editPermission && (
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">
                  {editPermission.old_name ? "Edit" : "Add"} Permission
                </h4>
                <form>
                  <div className="form-group">
                    <label htmlFor="permission_name">Permission Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="permission_name"
                      placeholder="Enter permission name"
                      value={editPermission.permission_name}
                      onChange={(event) =>
                        setEditPermission({
                          ...editPermission,
                          permission_name: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="details">Details</label>
                    <textarea
                      className="form-control"
                      id="details"
                      rows="4"
                      placeholder="Enter permission details"
                      value={editPermission.details}
                      onChange={(event) =>
                        setEditPermission({
                          ...editPermission,
                          details: event.target.value,
                        })
                      }
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary mr-2"
                    onClick={(event) => {
                      event.preventDefault();
                      if (!editPermission.permission_name) {
                        toast.error("Permission name is required");
                        return;
                      } else if (!editPermission.details) {
                        toast.error("Permission details are required");
                        return;
                      }

                      if (editPermission.old_name) {
                        toast.promise(
                          updatePermission(
                            editPermission.old_name,
                            editPermission.permission_name,
                            editPermission.details
                          ).then(() => {
                            setPermissions((permissions) =>
                              permissions.map((permission) =>
                                permission.name === editPermission.old_name
                                  ? {
                                      name: editPermission.permission_name,
                                      details: editPermission.details,
                                    }
                                  : permission
                              )
                            );
                            setEditPermission(null);
                          }),
                          {
                            loading: "Updating permission...",
                            success: "Permission updated!",
                            error: "Failed to update permission",
                          }
                        );
                      } else {
                        toast.promise(
                          addPermission(
                            editPermission.permission_name,
                            editPermission.details
                          ).then((permission) => {
                            setPermissions((permissions) => [
                              ...permissions,
                              {
                                name: editPermission.permission_name,
                                details: editPermission.details,
                              },
                            ]);
                            setEditPermission(null);
                          }),
                          {
                            loading: "Creating permission...",
                            success: "Permission created!",
                            error: "Failed to create permission",
                          }
                        );
                      }
                    }}
                  >
                    {editPermission.old_name ? "Update" : "Add"}
                  </button>
                  <button
                    className="btn btn-light"
                    onClick={() => setEditPermission(null)}
                  >
                    Cancel
                  </button>
                </form>
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
                Permissions
                <span className="float-right">
                  <button
                    className="btn btn-outline-success btn-sm"
                    onClick={() => setEditPermission(newPermission)}
                  >
                    <i className="mdi mdi-plus mr-2"></i>
                    Add Permission
                  </button>
                </span>
              </h4>
              <p className="card-description">Manage permissions</p>
              <div className="table-responsive">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th>Permission Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissions.map((permission) => (
                      <tr key={permission.name}>
                        <td>{permission.name}</td>
                        <td>{permission.details}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm"
                            onClick={() =>
                              setEditPermission({
                                old_name: permission.name,
                                permission_name: permission.name,
                                details: permission.details,
                              })
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() =>
                              setSelectedDeletePermission(permission)
                            }
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
