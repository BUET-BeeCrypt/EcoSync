import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import {
  addVehicle,
  deleteVehicle,
  getSTSs,
  getVehicles,
  updateVehicle,
} from "../api/admin";

const VEHICLE_TYPES = [
  "Open Truck",
  "Closed Truck",
  "Compactor",
  "Container Carrier",
];

const defaultVehicle = {
  vehicle_id: 0,
  registration: "",
  type: VEHICLE_TYPES[0],
  capacity: 0.0,
  disabled: false,
  fuel_cost_per_km_loaded: 0.0,
  fuel_cost_per_km_unloaded: 0.0,
  sts_id: null,
};

export default function Vehicles() {
  // const [query, location] = useQuery();
  // const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [vehicles, setVehicles] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [selectedEditVehicle, setSelectedEditVehicle] = useState(null);
  const [selectedDeleteVehicle, setSelectedDeleteVehicle] = useState(null);

  const [STSs, setSTSs] = useState([]);

  useEffect(() => {
    toast.promise(
      getVehicles().then((v) => {
        setVehicles(v);
      }),
      {
        loading: "Loading Vehicles",
        success: "Loaded Vehicles",
        error: "Failed loading Vehicles",
      }
    );
    getSTSs().then((sts) => {
      setSTSs(sts);
    });
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Vehicles </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                STS
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Vehicles
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Vehicles
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
                      setSelectedEditVehicle(defaultVehicle);
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
                      <th> Registration # </th>
                      <th> Type </th>
                      <th> Capacity </th>
                      <th> Cost/km (loaded / unloaded) </th>
                      <th> Disabled </th>
                      <th> Associated STS </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicles.map((s) => (
                      <tr key={s.vehicle_id} className={"text-dark"}>
                        <td> {s.registration} </td>
                        <td> {s.type} </td>
                        <td> {s.capacity} </td>
                        <td>
                          {s.fuel_cost_per_km_loaded} /{" "}
                          {s.fuel_cost_per_km_unloaded}
                        </td>
                        <td>
                          <span
                            className={
                              s.disabled ? " text-danger" : "text-success"
                            }
                          >
                            {" "}
                            {s.disabled ? "Yes" : "No"}{" "}
                          </span>
                        </td>
                        <td>
                          <span
                            className={
                              "mdi mdi-delete-variant mr-2 " +
                              (s.sts_id === null
                                ? " text-danger"
                                : "text-dark")
                            }
                          >
                            {" "}
                            {s.sts_id === null
                              ? "No STS"
                              : `${STSs.find(
                                  (l) => l.sts_id === s.sts_id
                                )?.name}`}{" "}
                          </span>
                        </td>
                        <td>
                          {" "}
                          <button
                            className="btn btn-outline-dark btn-sm"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedEditVehicle(s);
                            }}
                          >
                            Edit
                          </button>{" "}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => {
                              setSelectedDeleteVehicle(s);
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
        show={selectedDeleteVehicle}
        onHide={() => setSelectedDeleteVehicle(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete Vehicle - "
            {selectedDeleteVehicle?.registration}"?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedDeleteVehicle(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  toast.promise(
                    deleteVehicle(selectedDeleteVehicle.vehicle_id).then(() => {
                      setVehicles(
                        vehicles.filter(
                          (v) =>
                            v.vehicle_id !== selectedDeleteVehicle.vehicle_id
                        )
                      );
                      setSelectedDeleteVehicle(null);
                    }),
                    {
                      loading: "Deleting Vehicle",
                      success: "Deleted Vehicle",
                      error: "Failed deleting Vehicle",
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
        show={selectedEditVehicle}
        onHide={() => setSelectedEditVehicle(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEditVehicle?.vehicle_id === 0
              ? "Add Vehicle"
              : `Edit Vehicle - "${selectedEditVehicle?.registration}"`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6">
              <div className="form-group">
                <label>Registration</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEditVehicle?.registration}
                  onChange={(e) => {
                    setSelectedEditVehicle({
                      ...selectedEditVehicle,
                      registration: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-group">
                <label>Type</label>
                <select
                  className="form-control"
                  value={selectedEditVehicle?.type}
                  onChange={(e) => {
                    setSelectedEditVehicle({
                      ...selectedEditVehicle,
                      type: e.target.value,
                    });
                  }}
                >
                  {VEHICLE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Capacity</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditVehicle?.capacity}
                  onChange={(e) => {
                    setSelectedEditVehicle({
                      ...selectedEditVehicle,
                      capacity: Number.parseFloat(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Disabled</label>
                <select
                  className="form-control"
                  value={selectedEditVehicle?.disabled}
                  onChange={(e) => {
                    setSelectedEditVehicle({
                      ...selectedEditVehicle,
                      disabled: e.target.value === "true",
                    });
                  }}
                >
                  <option value={false}>No</option>
                  <option value={true}>Yes</option>
                </select>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Fuel Cost per km (Loaded)</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditVehicle?.fuel_cost_per_km_loaded}
                  onChange={(e) => {
                    setSelectedEditVehicle({
                      ...selectedEditVehicle,
                      fuel_cost_per_km_loaded: Number.parseFloat(
                        e.target.value
                      ),
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Fuel Cost per km (Unloaded)</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditVehicle?.fuel_cost_per_km_unloaded}
                  onChange={(e) => {
                    setSelectedEditVehicle({
                      ...selectedEditVehicle,
                      fuel_cost_per_km_unloaded: Number.parseFloat(
                        e.target.value
                      ),
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-12">
              <div className="form-group">
                <label>STS</label>
                <select
                  className="form-control"
                  value={selectedEditVehicle?.sts_id}
                  onChange={(e) => {
                    setSelectedEditVehicle({
                      ...selectedEditVehicle,
                      sts_id: Number.parseInt(e.target.value),
                    });
                  }}
                >
                  <option value={null}>No STS</option>
                  {STSs.map((l) => (
                    <option key={l.sts_id} value={l.sts_id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedEditVehicle(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  toast.promise(
                    selectedEditVehicle?.vehicle_id === 0
                      ? addVehicle(
                          selectedEditVehicle.registration,
                          selectedEditVehicle.type,
                          selectedEditVehicle.capacity,
                          selectedEditVehicle.disabled,
                          selectedEditVehicle.fuel_cost_per_km_loaded,
                          selectedEditVehicle.fuel_cost_per_km_unloaded,
                          selectedEditVehicle.sts_id
                        ).then((e) => {
                          setVehicles([...vehicles, e]);
                          setSelectedEditVehicle(null);
                        })
                      : updateVehicle(
                          selectedEditVehicle.vehicle_id,
                          selectedEditVehicle.registration,
                          selectedEditVehicle.type,
                          selectedEditVehicle.capacity,
                          selectedEditVehicle.disabled,
                          selectedEditVehicle.fuel_cost_per_km_loaded,
                          selectedEditVehicle.fuel_cost_per_km_unloaded,
                          selectedEditVehicle.sts_id
                        ).then((e) => {
                          setVehicles(
                            vehicles.map((v) =>
                              v.vehicle_id === e.vehicle_id ? e : v
                            )
                          );
                          setSelectedEditVehicle(null);
                        }),
                    {
                      loading: "Saving Vehicle",
                      success: "Saved Vehicle",
                      error: "Failed saving Vehicle",
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
