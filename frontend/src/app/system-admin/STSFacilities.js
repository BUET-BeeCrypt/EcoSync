import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Modal, ProgressBar } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import {
  addManagerToSTS,
  addSTS,
  deleteSTS,
  getManagersOfSTS,
  getSTSs,
  getUsers,
  removeManagerFromSTS,
  updateSTS,
} from "../api/admin";
import { USER_ROLES } from "../App";

const addStsSample = {
  sts_id: 0,
  ward_no: 0,
  zone_no: 0,
  name: "",
  capacity: 0,
  dump_area: 0,
  location: "",
  latitude: 0,
  longitude: 0,
  coverage_area: 0,
  manager_count: 0,
  amount: 0,
};

export default function STSFacilities() {
  // const [query, location] = useQuery();
  // const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [sts, setSts] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [selectedEditSts, setSelectedEditSts] = useState(null);
  const [selectedDeleteSTS, setSelectedDeleteSTS] = useState(null);
  const [selectedStsManagers, setSelectedStsManagers] = useState(null);

  const [stsManagers, setStsManagers] = useState([]);

  useEffect(() => {
    toast.promise(
      getSTSs().then((sts) => {
        setSts(sts);
      }),
      {
        loading: "Loading STS",
        success: "Loaded STS",
        error: "Failed loading STS",
      }
    );
    getUsers().then((users) => {
      setStsManagers(
        users.filter((u) => u.role_name === USER_ROLES.STS_MANAGER)
      );
    });
  }, []);

  const closeManagerModal = () =>
    setSelectedStsManagers((m) => {
      setSts(
        sts.map((s) =>
          s.sts_id === m.sts_id
            ? { ...s, manager_count: `${m.managers.length}` }
            : s
        )
      );
      return null;
    });

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Solid Treatment Site (STS) Facilities </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Facilities
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              STS
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                STS
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
                      setSelectedEditSts(addStsSample);
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
                      <th> Ward # </th>
                      <th> Zone # </th>
                      <th> Name </th>
                      <th> Amount </th>
                      <th> Capacity </th>
                      {/* <th> Amount / Capacity </th> */}
                      <th> Coverage </th>
                      <th> Location </th>
                      <th> No of Managers </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sts.map((s) => (
                      <tr key={s.sts_id} className={"text-dark"}>
                        <td> {s.ward_no} </td>
                        <td> {s.zone_no} </td>
                        <td> {s.name} </td>
                        <td> {s.amount} </td>
                        <td> {s.capacity} </td>
                        {/* <td>
                          <ProgressBar
                            now={(s.amount / s.capacity) * 100}
                            variant="success"
                          />
                        </td> */}
                        <td> {s.coverage_area} </td>
                        <td>
                          {s.location} ({s.latitude}, {s.longitude})
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
                                  getManagersOfSTS(s.sts_id).then(
                                    (managers) => {
                                      setSelectedStsManagers({
                                        sts_id: s.sts_id,
                                        ward_no: s.ward_no,
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
                              setSelectedEditSts(s);
                            }}
                          >
                            Edit
                          </button>{" "}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => {
                              setSelectedDeleteSTS(s);
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
        show={selectedDeleteSTS}
        onHide={() => setSelectedDeleteSTS(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete STS from Ward "
            {selectedDeleteSTS?.ward_no}"?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedDeleteSTS(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  toast.promise(
                    deleteSTS(selectedDeleteSTS.sts_id).then((e) => {
                      setSts(
                        sts.filter((u) => u.sts_id !== selectedDeleteSTS.sts_id)
                      );
                      setSelectedDeleteSTS(null);
                    }),
                    {
                      loading: "Deleting STS",
                      success: "Deleted STS",
                      error: "Failed deleting STS",
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
        show={selectedEditSts}
        onHide={() => setSelectedEditSts(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEditSts?.sts_id === 0
              ? "Add STS"
              : `Edit STS in Ward #${selectedEditSts?.ward_no}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Ward #</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditSts?.ward_no}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      ward_no: Number.parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Zone #</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditSts?.zone_no}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      zone_no: Number.parseInt(e.target.value),
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
                  value={selectedEditSts?.name}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Capacity (in Tons)</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditSts?.capacity}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      capacity: Number.parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Coverage Area</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditSts?.coverage_area}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      coverage_area: Number.parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            {/* location */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEditSts?.location}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      location: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* dump area */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Dump Area</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditSts?.dump_area}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      dump_area: Number.parseInt(e.target.value),
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
                  value={selectedEditSts?.latitude}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
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
                  value={selectedEditSts?.longitude}
                  onChange={(e) => {
                    setSelectedEditSts({
                      ...selectedEditSts,
                      longitude: Number.parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedEditSts(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  toast.promise(
                    selectedEditSts?.sts_id === 0
                      ? addSTS(
                          selectedEditSts.zone_no,
                          selectedEditSts.ward_no,
                          selectedEditSts.name,
                          selectedEditSts.location,
                          selectedEditSts.latitude,
                          selectedEditSts.longitude,
                          selectedEditSts.capacity,
                          selectedEditSts.dump_area,
                          selectedEditSts.coverage_area
                        ).then((e) => {
                          setSts([...sts, { ...selectedEditSts, ...e }]);
                          setSelectedEditSts(null);
                        })
                      : updateSTS(
                          selectedEditSts.sts_id,
                          selectedEditSts.zone_no,
                          selectedEditSts.ward_no,
                          selectedEditSts.name,
                          selectedEditSts.location,
                          selectedEditSts.latitude,
                          selectedEditSts.longitude,
                          selectedEditSts.capacity,
                          selectedEditSts.dump_area,
                          selectedEditSts.coverage_area
                        ).then((e) => {
                          setSts(
                            sts.map((u) =>
                              u.sts_id === e.sts_id ? selectedEditSts : u
                            )
                          );
                          setSelectedEditSts(null);
                        }),
                    {
                      loading: `${
                        selectedEditSts?.sts_id === 0 ? "Adding" : "Updating"
                      } STS`,
                      success: `${
                        selectedEditSts?.sts_id === 0 ? "Added" : "Updated"
                      } STS`,
                      error: `Failed ${
                        selectedEditSts?.sts_id === 0 ? "adding" : "updating"
                      } STS`,
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
      <Modal show={selectedStsManagers} onHide={closeManagerModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Managers of STS in Ward #{selectedStsManagers?.ward_no}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Add New STS Manager</label>
                <Typeahead
                  onChange={(selected) => {
                    if (selected.length === 0) return;
                    toast.promise(
                      addManagerToSTS(
                        selectedStsManagers.sts_id,
                        selected[0].user_id
                      ).then((e) => {
                        setSelectedStsManagers((selectedStsManagers) => ({
                          ...selectedStsManagers,
                          managers: [
                            ...selectedStsManagers.managers,
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
                  options={stsManagers}
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
                  {selectedStsManagers?.managers.map((u) => (
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
                              removeManagerFromSTS(
                                selectedStsManagers.sts_id,
                                u.user_id
                              ).then((e) => {
                                setSelectedStsManagers({
                                  ...selectedStsManagers,
                                  managers: selectedStsManagers.managers.filter(
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
