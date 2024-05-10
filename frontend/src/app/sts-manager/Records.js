import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getSTSRecords } from "../api/sts";
import { formatDateFromTimestamp } from "./VehicleEntry";

export default function STSRecords() {
  const [page, setPage] = useState(1);
  const [records, setRecords] = useState([]);

  const loadMore = () => {
    if (page === null) return;
    toast.promise(
      getSTSRecords(page).then((data) => {
        setRecords([...records, ...data]);
        if (data.length === 0) setPage(null);
        else setPage(page + 1);
      }),
      {
        loading: "Loading records...",
        success: "Records loaded!",
        error: "Failed to load records!",
      }
    );
  };

  useEffect(loadMore, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> STS Records</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                STS
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Records
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        {records.map((record) => (
          <div key={record.id} className="col-md-6 col-lg-4">
            <div className="card my-4">
              <div className="card-body">
                <h4 className="card-title mb-4">
                  {record.vehicle_id
                    ? `Vehicle: ${record.registration}`
                    : `Dump Entry`}
                </h4>
                <p className="card-text">
                  <strong>Entered By:</strong>{" "}
                  {record.manager_name || "Unknown"}
                </p>
                <p className="card-text">
                  <strong>Entry Time:</strong>{" "}
                  {formatDateFromTimestamp(record.entry_time)}
                </p>
                {record.departure_time && (
                  <p className="card-text">
                    <strong>Departure Time:</strong>{" "}
                    {formatDateFromTimestamp(record.departure_time)}
                  </p>
                )}
                {record.contract_company_id && (
                  <>
                    <p className="card-text">
                      <strong>Contractor ID:</strong> {record.contract_company_id}
                    </p>
                    <p className="card-text">
                      <strong>Waste Type:</strong> {record.waste_type}
                    </p>
                    <p className="card-text">
                      <strong>Vehicle:</strong> {record.contract_vehicle}
                    </p>
                  </>
                )}
                <p
                  className={
                    "card-text " +
                    (record.volume == 0
                      ? " text-dark "
                      : record.volume > 0
                      ? "text-success"
                      : "text-danger")
                  }
                >
                  <strong>Volume:</strong>{" "}
                  {record.volume === 0
                    ? "Waiting for departure"
                    : record.volume > 0
                    ? `${1000 * record.volume} kg`
                    : `${-record.volume} ton`}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="col-12 mt-4">
          <button
            className="btn btn-primary btn-block"
            onClick={loadMore}
            disabled={page === null}
          >
            Load More
          </button>
        </div>
      </div>
    </div>
  );
}
