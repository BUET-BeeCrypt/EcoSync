import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addSTSDumpEntry, getMySTS } from "../api/sts";

export default function DumpEntry() {
  const [mySTS, setMySTS] = useState(null);
  const [volume, setVolume] = useState(0);
  const [entryTime, setEntryTime] = useState(
    new Date().getTime() + 1000 * 60 * 60 * 6
  );

  useEffect(() => {
    toast.promise(
      getMySTS().then((sts) => setMySTS(sts)),
      {
        loading: "Loading STS Details...",
        success: "STS Details loaded!",
        error: "Failed to load STS Details",
      }
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Dump Entry </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                STS
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Dump Entry
            </li>
          </ol>
        </nav>
      </div>

      {mySTS && (
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
                <h4 className="card-title">Dump Entry</h4>
                <p className="card-description">Add dump information</p>
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
                              volume
                            ).then(() => {
                              setVolume(0);
                              setEntryTime(
                                new Date().getTime() + 1000 * 60 * 60 * 6
                              );
                              setMySTS({
                                ...mySTS,
                                amount: mySTS.amount + volume,
                              });
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
