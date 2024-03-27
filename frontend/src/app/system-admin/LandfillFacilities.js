import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Modal, ProgressBar } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  addLandfill,
  addManagerToLandfill,
  addManagerToSTS,
  addSTS,
  deleteLandfill,
  deleteSTS,
  getLandfills,
  getManagersOfLandfill,
  getManagersOfSTS,
  getSTSs,
  getUsers,
  removeManagerFromLandfill,
  removeManagerFromSTS,
  updateLandfill,
  updateSTS,
} from "../api/admin";
import { USER_ROLES } from "../App";

const defaultLandfillFacility = {
  landfill_id: 0,
  name: "",
  latitude: 0,
  longitude: 0,
  manager_count: 0,
  amount: 0,
};

export default function LandfillFacilities() {
  // const [query, location] = useQuery();
  // const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [landfills, setLandfills] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [selectedEditLandfill, setSelectedEditLandfill] = useState(null);
  const [selectedDeleteLandfill, setSelectedDeleteLandfill] = useState(null);
  const [selectedLandfillManagers, setSelectedLandfillManagers] =
    useState(null);

  const [landfillManagers, setLandfillManagers] = useState([]);

  useEffect(() => {
    toast.promise(
      getLandfills().then((lfs) => {
        setLandfills(lfs);
      }),
      {
        loading: "Loading Landfills",
        success: "Loaded Landfills",
        error: "Failed loading Landfills",
      }
    );

    getUsers().then((users) => {
      setLandfillManagers(
        users.filter((u) => u.role_name === USER_ROLES.LANDFILL_MANAGER)
      );
    });
  }, []);

  const closeManagerModal = () =>
    setSelectedLandfillManagers((m) => {
      setLandfills(
        landfills.map((s) =>
          s.landfill_id === m.landfill_id
            ? { ...s, manager_count: `${m.managers.length}` }
            : s
        )
      );
      return null;
    });

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Waste Landfill Sites </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Facilities
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Landfill
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Landfill
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
                  <button
                    className={"btn btn-outline-success btn-sm icon-btn"}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedEditLandfill(defaultLandfillFacility);
                    }}
                  >
                    <i className="mdi mdi-plus mr-2"></i>
                    <span>Add New</span>
                  </button>
                </span>
              </h4>
              <p className="card-description">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th> Name </th>
                      <th> Amount </th>
                      <th> Location </th>
                      <th> No of Managers </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {landfills.map((s) => (
                      <tr key={s.landfill_id} className={"text-dark"}>
                        <td> {s.name} </td>
                        <td> {s.amount} </td>
                        <td>
                          ({s.latitude}, {s.longitude})
                        </td>
                        <td>
                          <span
                            className={
                              "mdi mdi-account mr-2 " +
                              (s.manager_count === "0"
                                ? " text-danger"
                                : "text-dark")
                            }
                          >
                            {" "}
                            {s.manager_count}{" "}
                            <button
                              className="btn btn-outline-primary btn-sm ml-4"
                              onClick={(e) => {
                                e.preventDefault();
                                toast.promise(
                                  getManagersOfLandfill(s.landfill_id).then(
                                    (managers) => {
                                      setSelectedLandfillManagers({
                                        landfill_id: s.landfill_id,
                                        name: s.name,
                                        managers,
                                      });
                                    }
                                  ),
                                  {
                                    loading: "Loading Managers",
                                    success: "Loaded Managers",
                                    error: "Failed loading Managers",
                                  }
                                );
                              }}
                            >
                              Manage
                            </button>
                          </span>
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedEditLandfill(s);
                            }}
                          >
                            Edit
                          </button>{" "}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => {
                              setSelectedDeleteLandfill(s);
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
        show={selectedDeleteLandfill}
        onHide={() => setSelectedDeleteLandfill(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete Landfill - "
            {selectedDeleteLandfill?.name}"?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedDeleteLandfill(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  toast.promise(
                    deleteLandfill(selectedDeleteLandfill.landfill_id).then((e) => {
                      setLandfills(
                        landfills.filter(
                          (u) =>
                            u.landfill_id !== selectedDeleteLandfill.landfill_id
                        )
                      );
                      setSelectedDeleteLandfill(null);
                    }),
                    {
                      loading: "Deleting Landfill",
                      success: "Deleted Landfill",
                      error: "Failed deleting Landfill",
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
        show={selectedEditLandfill}
        onHide={() => setSelectedEditLandfill(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEditLandfill?.landfill_id === 0
              ? "Add Landfill"
              : `Edit Landfill - "${selectedEditLandfill?.name}"`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEditLandfill?.name}
                  onChange={(e) => {
                    setSelectedEditLandfill({
                      ...selectedEditLandfill,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Latitude</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditLandfill?.latitude}
                  onChange={(e) => {
                    setSelectedEditLandfill({
                      ...selectedEditLandfill,
                      latitude: Number.parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Longitude</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditLandfill?.longitude}
                  onChange={(e) => {
                    setSelectedEditLandfill({
                      ...selectedEditLandfill,
                      longitude: Number.parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedEditLandfill(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  toast.promise(
                    selectedEditLandfill?.landfill_id === 0
                      ? addLandfill(
                          selectedEditLandfill.name,
                          selectedEditLandfill.latitude,
                          selectedEditLandfill.longitude
                        ).then((e) => {
                          setLandfills([
                            ...landfills,
                            { ...selectedEditLandfill, ...e },
                          ]);
                          setSelectedEditLandfill(null);
                        })
                      : updateLandfill(
                          selectedEditLandfill.landfill_id,
                          selectedEditLandfill.name,
                          selectedEditLandfill.capacity,
                          selectedEditLandfill.latitude,
                          selectedEditLandfill.longitude
                        ).then((e) => {
                          setLandfills(
                            landfills.map((u) =>
                              u.landfill_id === e.landfill_id
                                ? selectedEditLandfill
                                : u
                            )
                          );
                          setSelectedEditLandfill(null);
                        }),
                    {
                      loading: `${
                        selectedEditLandfill?.landfill_id === 0
                          ? "Adding"
                          : "Updating"
                      } Landfill`,
                      success: `${
                        selectedEditLandfill?.landfill_id === 0
                          ? "Added"
                          : "Updated"
                      } Landfill`,
                      error: `Failed ${
                        selectedEditLandfill?.landfill_id === 0
                          ? "adding"
                          : "updating"
                      } Landfill`,
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
      <Modal
        show={selectedLandfillManagers}
        onHide={closeManagerModal}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Managers of Landfill - "{selectedLandfillManagers?.name}"
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Add New Landfill Manager</label>
                <Typeahead
                  onChange={(selected) => {
                    toast.promise(
                      addManagerToLandfill(
                        selectedLandfillManagers.landfill_id,
                        selected[0].user_id
                      ).then((e) => {
                        setSelectedLandfillManagers((m) => ({
                          ...m,
                          managers: [
                            ...m.managers,
                            selected[0],
                          ],
                        }));
                      }),
                      {
                        loading: "Adding Manager",
                        success: "Added Manager",
                        error: "Failed adding Manager",
                      }
                    );
                  }}
                  options={landfillManagers}
                  labelKey={(option) =>
                    `[${option.username}] ${option.name} (${option.email})`
                  }
                  filterBy={["name", "email", "username"]}
                  placeholder="Add new..."
                />
              </div>
            </div>
            <div className="col-md-12 mb-4">
              <table className="table table-outline table-hover">
                <thead>
                  <tr>
                    <th> Username </th>
                    <th> Email </th>
                    <th> Name </th>
                    <th> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {selectedLandfillManagers?.managers.map((u) => (
                    <tr key={u.user_id} className={"text-dark"}>
                      <td> {u.username} </td>
                      <td> {u.email} </td>
                      <td> {u.name} </td>
                      <td>
                        {" "}
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={(e) => {
                            e.preventDefault();
                            toast.promise(
                              removeManagerFromLandfill(
                                selectedLandfillManagers.landfill_id,
                                u.user_id
                              ).then((e) => {
                                setSelectedLandfillManagers({
                                  ...selectedLandfillManagers,
                                  managers:
                                    selectedLandfillManagers.managers.filter(
                                      (m) => m.user_id !== u.user_id
                                    ),
                                });
                              }),
                              {
                                loading: "Removing Manager",
                                success: "Removed Manager",
                                error: "Failed removing Manager",
                              }
                            );
                          }}
                        >
                          Remove
                        </button>{" "}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={closeManagerModal}
              >
                Close
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
