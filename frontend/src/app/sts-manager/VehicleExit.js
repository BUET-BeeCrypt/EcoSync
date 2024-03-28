import { Typeahead } from "react-bootstrap-typeahead";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  addSTSDeparture,
  addSTSEntry,
  getSTSEntries,
  getSTSVehicles,
} from "../api/sts";
import { formatDateFromTimestamp } from "./VehicleEntry";

export default function VehicleExit() {
  const [entries, setEntries] = useState([]);
  const [entry, setEntry] = useState(null);
  const [volume, setVolume] = useState(0);
  const [exitTime, setExitTime] = useState(
    new Date().getTime() + 1000 * 60 * 60 * 6
  );

  useEffect(() => {
    toast.promise(
      getSTSVehicles().then((vehicles) => {
        getSTSEntries().then((entries) => {
          setEntries(
            entries.map((e) => ({
              ...e,
              vehicle: vehicles.find((v) => v.vehicle_id === e.vehicle_id),
            }))
          );
        });
      }),
      {
        loading: "Loading entriess...",
        success: "Entries loaded!",
        error: "Failed to load entries",
      }
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Vehicle Exit </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Vehicle
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Exit Entry
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
                setEntry(selected[0]);
              }}
              options={entries}
              labelKey={(option) =>
                `[${formatDateFromTimestamp(option?.entry_time)}] ${
                  option?.vehicle?.registration
                } (${option?.vehicle?.type})`
              }
              filterBy={["text", "name"]}
              placeholder="Choose vehicle..."
              className="flex-grow-1"
            />
          </div>
        </div>
      </div>

      {entry && (
        <div className="row">
          <div className={`col-md-6 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{entry.vehicle.registration}</h4>
                <p className="card-description">Vehicle Details</p>
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-muted">Type</p>
                    <p>{entry.vehicle.type}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">Capacity (Tons)</p>
                    <p>{entry.vehicle.capacity}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">Loaded Cost/km</p>
                    <p>{entry.vehicle.fuel_cost_per_km_loaded}</p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">Unloaded Cost/km</p>
                    <p>{entry.vehicle.fuel_cost_per_km_unloaded}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`col-md-6 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Vehicle Departure</h4>
                <p className="card-description">Add Vehicle exit details</p>
                <div className="row">
                  <div className="col-md-12">
                    <p className="text-muted">Entry Time</p>
                    <p>{formatDateFromTimestamp(entry.entry_time)}</p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-muted">Exit Time</p>
                    <p>
                      <input
                        type="datetime-local"
                        className="form-control"
                        value={new Date(exitTime).toISOString().slice(0, 16)}
                        onChange={(e) =>
                          setExitTime(
                            new Date(e.target.value).getTime() +
                              1000 * 60 * 60 * 6
                          )
                        }
                      />
                    </p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-muted">Volume (Tons)</p>
                    <p>
                      <input
                        type="number"
                        className="form-control"
                        value={volume}
                        onChange={(e) =>
                          setVolume(Number.parseFloat(e.target.value))
                        }
                      />
                    </p>
                  </div>
                  <div className="col-md-3">
                    <p className="text-muted"> </p>
                    <p>
                      <button
                        className="btn btn-primary"
                        onClick={(e) => {
                          e.preventDefault();

                          if (volume <= 0) {
                            toast.error("Volume must be greater than 0");
                            return;
                          } else if (exitTime <= entry.entry_time) {
                            toast.error(
                              "Exit time must be greater than entry time"
                            );
                            return;
                          } else if (
                            exitTime >
                            new Date().getTime() + 1000 * 60 * 60 * 6
                          ) {
                            toast.error(
                              "Exit time must be less than current time"
                            );
                            return;
                          } else if (
                            exitTime - entry.entry_time >
                            1000 * 60 * 60 * 24
                          ) {
                            toast.error(
                              "Exit time must be within 24 hours of entry time"
                            );
                            return;
                          } else if (volume > entry.vehicle.capacity) {
                            toast.error(
                              "Volume must be less than vehicle capacity"
                            );
                            return;
                          }

                          toast.promise(
                            addSTSDeparture(
                              entry.sts_entry_id,
                              exitTime - 1000 * 60 * 60 * 6,
                              volume
                            ).then(() => {
                              setEntry(null);
                              setVolume(0);
                              setExitTime(
                                new Date().getTime() + 1000 * 60 * 60 * 6
                              );
                              setEntries(
                                entries.filter(
                                  (e) => e.sts_entry_id !== entry.sts_entry_id
                                )
                              );
                            }),
                            {
                              loading: "Adding entry...",
                              success: "Entry added successfully",
                              error: "Failed to add entry",
                            }
                          );
                        }}
                      >
                        Record Entry
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
