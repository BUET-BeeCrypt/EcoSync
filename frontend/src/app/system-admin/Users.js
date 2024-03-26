import { useState } from "react";
import { useQuery } from "../user/OwnedDocuments";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import {
  changeUserBannedStatus,
  changeUserRole,
  deleteUser,
  editUser,
  getRoles,
  getUsers,
} from "../api/admin";
import { formatDateFromTimestamp } from "../user/SharedByMe";

export default function Users() {
  // const [query, location] = useQuery();
  // const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [users, setUsers] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedDeletedUser, setSelectedDeletedUser] = useState(null);

  const [roles, setRoles] = useState([
    "SYSTEM_ADMIN",
    "STS_MANAGER",
    "LANDFILL_MANAGER",
    "UNASSIGNED",
  ]);

  useEffect(() => {
    (async () => {
      toast.promise(
        getUsers().then((res) => {
          setUsers(res);
          // setFirst(res.first);
          // setLast(res.last);
        }),
        {
          loading: "Loading users",
          success: "Loaded users",
          error: "Failed loading users",
        }
      );
    })();
    getRoles().then((res) => setRoles(res.map((r) => r.name)));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Users </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Admin
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Users
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Users
                <span className="float-right">
                  <button
                    className={
                      "btn btn-outline-primary btn-sm icon-btn" +
                      (first ? " invisible" : "")
                    }
                  >
                    <i className="mdi mdi-arrow-left-thick"></i>
                    <span>Previous</span>
                  </button>
                  <button
                    className={
                      "btn btn-outline-primary btn-sm icon-btn" +
                      (last ? " invisible" : "")
                    }
                  >
                    <span>Next</span>
                    <i className="mdi mdi-arrow-right-thick"></i>
                  </button>
                </span>
              </h4>
              <p className="card-description">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th> Username </th>
                      <th> Email </th>
                      <th> Name </th>
                      <th> Role </th>
                      <th> Active </th>
                      <th> Banned </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr
                        key={user.user_id}
                        className={user.banned ? " text-danger" : "text-dark"}
                      >
                        <td> {user.username} </td>
                        <td> {user.email} </td>
                        <td> {user.name} </td>
                        <td>
                          <select
                            className="form-control form-control-sm"
                            value={user?.role_name}
                            onChange={(e) => {
                              toast.promise(
                                changeUserRole(
                                  user.user_id,
                                  e.target.value
                                ).then((e) => {
                                  setUsers(
                                    users.map((u) => {
                                      if (u.user_id === user.user_id) {
                                        return {
                                          ...user,
                                          role_name: e.role_name,
                                        };
                                      }
                                      return u;
                                    })
                                  );
                                }),
                                {
                                  loading: "Changing role",
                                  success: "Changed role",
                                  error: "Failed changing role",
                                }
                              );
                            }}
                          >
                            {roles.map((role) => (
                              <option key={role} value={role}>
                                {role}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          {" "}
                          {user.active ? (
                            <span className="text-success">Yes</span>
                          ) : (
                            <span className="text-danger">No</span>
                          )}{" "}
                        </td>
                        <td>
                          {" "}
                          {user.banned ? (
                            <span className="text-danger">Yes</span>
                          ) : (
                            <span className="text-success">No</span>
                          )}{" "}
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedUser(user);
                            }}
                          >
                            Edit
                          </button>{" "}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => {
                              setSelectedDeletedUser(user);
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={selectedDeletedUser}
        onHide={() => setSelectedDeletedUser(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete "{selectedDeletedUser?.username}"?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedDeletedUser(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  toast.promise(
                    deleteUser(selectedDeletedUser.user_id).then((e) => {
                      setUsers(
                        users.filter(
                          (u) => u.user_id !== selectedDeletedUser.user_id
                        )
                      );
                      setSelectedDeletedUser(null);
                    }),
                    {
                      loading: "Deleting user",
                      success: "Deleted user",
                      error: "Failed deleting user",
                    }
                  );
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      <Modal
        show={selectedUser}
        onHide={() => setSelectedUser(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Change "{selectedUser?.username}" Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedUser?.username}
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      username: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={selectedUser?.email}
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      email: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedUser?.name}
                  onChange={(e) => {
                    setSelectedUser({
                      ...selectedUser,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-group">
                <div className="form-check">
                  <label className="form-check-label text-dark">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedUser?.active}
                      onChange={(e) => {
                        setSelectedUser({
                          ...selectedUser,
                          active: e.target.checked,
                        });
                      }}
                    />
                    <i className="input-helper"></i> Active (User has logged in
                    and changed password)
                  </label>
                </div>
                <div className="form-check">
                  <label className="form-check-label text-danger">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={selectedUser?.banned}
                      onChange={(e) => {
                        setSelectedUser({
                          ...selectedUser,
                          banned: e.target.checked,
                        });
                      }}
                    />
                    <i className="input-helper"></i> Banned (User cannot log in)
                  </label>
                </div>
              </div>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedUser(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  toast.promise(
                    editUser(
                      selectedUser.user_id,
                      selectedUser.username,
                      selectedUser.email,
                      selectedUser.name,
                      selectedUser.active,
                      selectedUser.banned
                    ).then((e) => {
                      setUsers(
                        users.map((u) => {
                          if (u.user_id === selectedUser.user_id) {
                            return selectedUser;
                          }
                          return u;
                        })
                      );
                      setSelectedUser(null);
                    }),
                    {
                      loading: "Saving changes",
                      success: "Saved changes",
                      error: "Failed saving changes",
                    }
                  );
                }}
              >
                Save
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
