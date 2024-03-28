import { Typeahead } from "react-bootstrap-typeahead";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { addSTSEntry, getFleet, getSTSVehicles } from "../api/sts";

export default function FleetGenerate() {
  const [fleet, setFleet] = useState(null);

  useEffect(() => {
    toast.promise(
      getFleet().then((fleet) => setFleet(fleet)),
      {
        loading: "Generating fleet...",
        success: "Fleet generated!",
        error: "Failed to generate fleet",
      }
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Fleet Generate </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                STS
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Fleet
            </li>
          </ol>
        </nav>
      </div>

      {fleet && (
        <div className="row">
          <div className={`col-md-9 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">{fleet.landfill.name}</h4>
                <p className="card-description">Route Details</p>
                <div className="row">
                  <div className="col-md-6">
                    <p className="text-muted">Location</p>
                    <p>
                      ({fleet.landfill.latitude}, {fleet.landfill.longitude})
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p className="text-muted">Distance (KM)</p>
                    <p>{fleet.direction.distance}</p>
                  </div>
                  <div className="col-md-12">
                    <p className="text-muted">Route</p>
                    <p>{fleet.direction.direction}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={`col-md-3 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Vehicles</h4>
                <p className="card-description">Vehicles with trip time</p>
                <div className="row">
                  {fleet.vehicles.map((vehicle) => (
                    <div className="col-md-12">
                      <p className="text-muted">
                        Times: {vehicle.total_trip} | Capacity:{" "}
                        {vehicle.capacity}
                      </p>
                      <p>
                        [{vehicle.registration}] - {vehicle.type}
                      </p>
                    </div>
                  ))}
                  <div className="col-md-12">
                    <p className="text-muted"> </p>
                    <p>
                      <button
                        className="btn btn-primary btn-block"
                        onClick={(e) => {
                          e.preventDefault();
                        }}
                      >
                        Confirm
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
