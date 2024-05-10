import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addSTSDumpEntry, getMySTS, getSTSContractors } from "../api/sts";
import { Typeahead } from "react-bootstrap-typeahead";
import { formatDateFromTimestamp } from "./VehicleEntry";

const WASTE_TYPES = ["Domestic", "Plastic", "Construction"];

export default function DumpEntry() {
  const [mySTS, setMySTS] = useState(null);
  const [volume, setVolume] = useState(0);
  const [entryTime, setEntryTime] = useState(
    new Date().getTime() + 1000 * 60 * 60 * 6
  );
  const [wasteType, setWasteType] = useState(WASTE_TYPES[0]);
  const [contractCompany, setContractCompany] = useState(null);
  const [contractVehicle, setContractVehicle] = useState("");

  const [conntractors, setContractors] = useState([]);

  useEffect(() => {
    toast.promise(
      getMySTS().then((sts) => setMySTS(sts)),
      {
        loading: "Loading STS Details...",
        success: "STS Details loaded!",
        error: "Failed to load STS Details",
      }
    );
    toast.promise(
      getSTSContractors().then((contractors) => setContractors(contractors)),
      {
        loading: "Loading Contractors...",
        success: "Contractors loaded!",
        error: "Failed to load Contractors",
      }
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Contractor Dump Entry </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                STS
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Contractor Dump Entry
            </li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-center mb-5">
        <div className="col-md-6">
          <div className="d-flex justify-content-center">
            <Typeahead
              onChange={(selected) => {
                if (selected.length === 0) return;
                setContractCompany(selected[0]);
              }}
              options={conntractors}
              labelKey={(option) =>
                `[${option?.contract_company_id}] ${option?.name} (${option?.contact_number})`
              }
              filterBy={["text", "name"]}
              placeholder="Choose contractor..."
              className="flex-grow-1"
            />
          </div>
        </div>
      </div>

      {mySTS && contractCompany && (
        <div className="row">
          <div className={`col-md-6 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{mySTS.name}</h4>
                <p className="card-description">STS Details</p>
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-muted">Ward # </p>
                    <p>{mySTS.ward_no}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">Zone # </p>
                    <p>{mySTS.zone_no}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">Amount (Tons)</p>
                    <p>{mySTS.amount}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">Capacity (Tons)</p>
                    <p>{mySTS.capacity}</p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-muted">Location</p>
                    <p>{mySTS.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`col-md-6 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  {contractCompany.name} - {contractCompany.contact_number} Dump
                  Entry
                </h4>
                <p className="card-description">
                  Area - {contractCompany.collection_area}
                </p>
                <div className="row">
                  <div className="col-md-12">
                    <p className="text-muted">Entry Time</p>
                    <p>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={new Date(entryTime).toISOString().slice(0, 16)}
                        onChange={(e) =>
                          setEntryTime(
                            new Date(e.target.value).getTime() +
                              1000 * 60 * 60 * 6
                          )
                        }
                      />
                    </p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-muted">Volume (Kgs)</p>
                    <p>
                      <input
                        type="number"
                        className="form-control"
                        value={volume * 1000}
                        onChange={(e) =>
                          setVolume(Number.parseFloat(e.target.value / 1000))
                        }
                      />
                    </p>
                  </div>

                  {/* Waste Type */}
                  <div className="col-md-12">
                    <p className="text-muted">Waste Type</p>
                    <select
                      className="form-control"
                      value={wasteType}
                      onChange={(e) => setWasteType(e.target.value)}
                    >
                      {WASTE_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Vehicle Info */}
                  <div className="col-md-12 mt-3">
                    <p className="text-muted">Vehicle Info</p>
                    <p>
                      <input
                        type="text"
                        className="form-control"
                        value={contractVehicle}
                        onChange={(e) => setContractVehicle(e.target.value)}
                      />
                    </p>
                  </div>

                  <div className="col-md-6">
                    <p className="text-muted"> </p>
                    <p>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault();

                          if (volume <= 0) {
                            toast.error("Volume must be greater than 0");
                            return;
                          } else if (
                            entryTime >
                            new Date().getTime() + 1000 * 60 * 60 * 6
                          ) {
                            toast.error(
                              "Exit time must be less than current time"
                            );
                            return;
                          } else if (volume > mySTS.capacity - mySTS.amount) {
                            toast.error(
                              "Volume must be less than capacity - amount"
                            );
                            return;
                          }

                          toast.promise(
                            addSTSDumpEntry(
                              entryTime - 1000 * 60 * 60 * 6,
                              volume,
                              wasteType,
                              contractCompany.contract_company_id,
                              contractVehicle
                            ).then(() => {
                              setVolume(0);
                              setEntryTime(
                                new Date().getTime() + 1000 * 60 * 60 * 6
                              );
                              setMySTS({
                                ...mySTS,
                                amount: mySTS.amount + volume,
                              });
                              setContractVehicle("");
                              setContractCompany(null);
                            }),
                            {
                              loading: "Adding entry...",
                              success: "Entry added successfully",
                              error: "Failed to add entry",
                            }
                          );
                        }}
                      >
                        Dump Entry
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
