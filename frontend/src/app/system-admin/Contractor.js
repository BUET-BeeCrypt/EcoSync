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
import {
  addContractorCompany,
  assignManagaerToContractorCompany,
  deleteContractorCompany,
  getContractorCompanys,
  getManagersOfContractorCompany,
  removeManagerFromContractorCompany,
  updateContractorCompany,
} from "../api/contractor";

const addContractorSample = {
  contract_company_id: 0,
  name: "",
  contract_id: "",
  registration_date: new Date().toISOString().substring(0, 10),
  tin: "",
  contact_number: "",
  workforce_size: 0,
  ton_payment_rate: 0,
  required_ton: 0,
  contract_duration: 0,
  collection_area: "",
  sts_id: 0,
};

export default function ContractorCompanies() {
  // const [query, location] = useQuery();
  // const page = (Number.parseInt(query.get("page")) || 1) - 1;

  const [contractorCompanies, setContractorCompanies] = useState([]);
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [selectedEditContractor, setSelectedEditContractor] = useState(null);
  const [selectedDeleteContractor, setSelectedDeleteContractor] =
    useState(null);
  const [selectedContractorManagers, setSelectedContractorManagers] =
    useState(null);

  const [contractorManagers, setContractorManagers] = useState([]);

  useEffect(() => {
    toast.promise(
      getContractorCompanys().then((c) => {
        setContractorCompanies(c);
      }),
      {
        loading: "Loading Contractors",
        success: "Loaded Contractors",
        error: "Failed loading Contractors",
      }
    );
    getUsers().then((users) => {
      setContractorManagers(
        users.filter((u) => u.role_name === USER_ROLES.CONTRACTOR_MANAGER)
      );
    });
  }, []);

  const closeManagerModal = () =>
    setSelectedContractorManagers((m) => {
      setContractorCompanies(
        contractorCompanies.map((s) =>
          s.contract_company_id === m.contract_company_id
            ? { ...s, manager_count: `${m.managers.length}` }
            : s
        )
      );
      return null;
    });

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Contractor Companies </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Management
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Contractor
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Contractor Companies
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
                      setSelectedEditContractor(addContractorSample);
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
                      <th> Contract ID (for Months) </th>
                      <th> Reg. Date </th>
                      <th> Name </th>
                      <th> TIN # </th>
                      <th> Contact # </th>
                      <th>
                        {" "}
                        P<sub>t</sub> / W<sub>r</sub>{" "}
                      </th>
                      <th> Area </th>
                      <th> STS ID </th>
                      <th> Manage </th>
                      <th> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {contractorCompanies.map((cc) => (
                      <tr key={cc.contract_company_id} className={"text-dark"}>
                        <td>
                          {" "}
                          {cc.contract_id} ({cc.contract_duration}){" "}
                        </td>
                        <td> {cc.registration_date.substring(0, 10)} </td>
                        <td> {cc.name} </td>
                        <td> {cc.tin} </td>
                        <td> {cc.contact_number} </td>
                        <td>
                          {" "}
                          {cc.ton_payment_rate} / {cc.required_ton}{" "}
                        </td>
                        <td> {cc.collection_area} </td>
                        <td> {cc.sts_id} </td>
                        {/* <td>
                          <ProgressBar
                            now={(s.amount / s.capacity) * 100}
                            variant="success"
                          />
                        </td> */}
                        <td>
                          <span
                            className={
                              "mdi mdi-account mr-2 " +
                              (cc.manager_count === "0"
                                ? " text-danger"
                                : "text-dark")
                            }
                          >
                            {" "}
                            {cc.manager_count}{" "}
                            <button
                              className="btn btn-outline-primary btn-sm ml-4"
                              onClick={(e) => {
                                e.preventDefault();
                                toast.promise(
                                  getManagersOfContractorCompany(
                                    cc.contract_company_id
                                  ).then((managers) => {
                                    setSelectedContractorManagers({
                                      contract_company_id:
                                        cc.contract_company_id,
                                      name: cc.name,
                                      managers,
                                    });
                                  }),
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
                              setSelectedEditContractor(cc);
                            }}
                          >
                            Edit
                          </button>{" "}
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={(e) => {
                              setSelectedDeleteContractor(cc);
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
        show={selectedDeleteContractor}
        onHide={() => setSelectedDeleteContractor(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete Contractor "
            {selectedDeleteContractor?.name}"?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedDeleteContractor(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={() => {
                  toast.promise(
                    deleteContractorCompany(
                      selectedDeleteContractor.contract_company_id
                    ).then((e) => {
                      setContractorCompanies(
                        contractorCompanies.filter(
                          (u) =>
                            u.contract_company_id !==
                            selectedDeleteContractor.contract_company_id
                        )
                      );
                      setSelectedDeleteContractor(null);
                    }),
                    {
                      loading: "Deleting Contractor",
                      success: "Deleted Contractor",
                      error: "Failed deleting Contractor",
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
        show={selectedEditContractor}
        onHide={() => setSelectedEditContractor(null)}
        centered
        size="md"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedEditContractor?.contract_company_id === 0
              ? "Add Contractor"
              : `Edit Contractor with ID# ${selectedEditContractor?.contract_company_id}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            {/* Contract No */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Contract ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEditContractor?.contract_id}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      contract_id: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* Registration Date */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Registration Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedEditContractor?.registration_date?.substring(
                    0,
                    10
                  )}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      registration_date: e.target.value,
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
                  value={selectedEditContractor?.name}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      name: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* TIN */}
            <div className="col-md-6">
              <div className="form-group">
                <label>TIN</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEditContractor?.tin}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      tin: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* Contact Number */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Contact Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEditContractor?.contact_number}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      contact_number: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Payment Per Ton</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditContractor?.ton_payment_rate}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      ton_payment_rate: Number.parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-group">
                <label>Minimum Collection </label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditContractor?.required_ton}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      required_ton: Number.parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            {/* location */}
            <div className="col-md-12">
              <div className="form-group">
                <label>Area</label>
                <input
                  type="text"
                  className="form-control"
                  value={selectedEditContractor?.collection_area}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      collection_area: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            {/* STS id */}
            <div className="col-md-6">
              <div className="form-group">
                <label>STS ID</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditContractor?.sts_id}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      sts_id: Number.parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            {/* Duration */}
            <div className="col-md-6">
              <div className="form-group">
                <label>Duration (months)</label>
                <input
                  type="number"
                  className="form-control"
                  value={selectedEditContractor?.contract_duration}
                  onChange={(e) => {
                    setSelectedEditContractor({
                      ...selectedEditContractor,
                      contract_duration: Number.parseInt(e.target.value),
                    });
                  }}
                />
              </div>
            </div>

            <div className="col-md-12 text-right">
              <button
                className="btn btn-outline-danger mr-2"
                onClick={() => setSelectedEditContractor(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={async () => {
                  toast.promise(
                    selectedEditContractor?.contract_company_id === 0
                      ? addContractorCompany(
                          selectedEditContractor.name,
                          selectedEditContractor.contract_id,
                          selectedEditContractor.registration_date,
                          selectedEditContractor.tin,
                          selectedEditContractor.contact_number,
                          selectedEditContractor.workforce_size,
                          selectedEditContractor.ton_payment_rate,
                          selectedEditContractor.required_ton,
                          selectedEditContractor.contract_duration,
                          selectedEditContractor.collection_area,
                          selectedEditContractor.sts_id
                        ).then((e) => {
                          setContractorCompanies([
                            ...contractorCompanies,
                            { ...selectedEditContractor, ...e },
                          ]);
                          setSelectedEditContractor(null);
                        })
                      : updateContractorCompany(
                          selectedEditContractor.contract_company_id,
                          selectedEditContractor.name,
                          selectedEditContractor.contract_id,
                          selectedEditContractor.registration_date,
                          selectedEditContractor.tin,
                          selectedEditContractor.contact_number,
                          selectedEditContractor.workforce_size,
                          selectedEditContractor.ton_payment_rate,
                          selectedEditContractor.required_ton,
                          selectedEditContractor.contract_duration,
                          selectedEditContractor.collection_area,
                          selectedEditContractor.sts_id
                        ).then((e) => {
                          setContractorCompanies(
                            contractorCompanies.map((u) =>
                              u.contract_company_id === e.contract_company_id ? selectedEditContractor : u
                            )
                          );
                          setSelectedEditContractor(null);
                        }),
                    {
                      loading: `${
                        selectedEditContractor?.contract_company_id === 0
                          ? "Adding"
                          : "Updating"
                      } Contractor`,
                      success: `${
                        selectedEditContractor?.contract_company_id === 0
                          ? "Added"
                          : "Updated"
                      } Contractor`,
                      error: `Failed ${
                        selectedEditContractor?.sts_id === 0
                          ? "adding"
                          : "updating"
                      } Contractor`,
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
        show={selectedContractorManagers}
        onHide={closeManagerModal}
        centered
        size="xl"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Managers of Contractor "{selectedContractorManagers?.name}""
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-12">
              <div className="form-group">
                <label>Add New Contractor Manager</label>
                <Typeahead
                  onChange={(selected) => {
                    if (selected.length === 0) return;
                    toast.promise(
                      assignManagaerToContractorCompany(
                        selectedContractorManagers.contract_company_id,
                        selected[0].user_id
                      ).then((e) => {
                        setSelectedContractorManagers(
                          (selectedStsManagers) => ({
                            ...selectedStsManagers,
                            managers: [
                              ...selectedStsManagers.managers,
                              selected[0],
                            ],
                          })
                        );
                      }),
                      {
                        loading: "Adding Manager",
                        success: "Added Manager",
                        error: "Failed adding Manager",
                      }
                    );
                  }}
                  options={contractorManagers}
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
                  {selectedContractorManagers?.managers.map((u) => (
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
                              removeManagerFromContractorCompany(
                                selectedContractorManagers.contract_company_id,
                                u.user_id
                              ).then((e) => {
                                setSelectedContractorManagers({
                                  ...selectedContractorManagers,
                                  managers:
                                    selectedContractorManagers.managers.filter(
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
