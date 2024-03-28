import { Typeahead } from "react-bootstrap-typeahead";
import { useState } from "react";

export default function VehicleEntry() {
  const [vehicles, setVehicles] = useState([
    {
      vehicle_id: 0,
      registration: "A1123GH",
      type: "Truck",
      capacity: 0.0,
      disabled: false,
      fuel_cost_per_km_loaded: 0.0,
      fuel_cost_per_km_unloaded: 0.0,
      landfill_id: null,
    },
  ]);
  const [vehicle, setVehicle] = useState(null);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Vehicle Entry </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Vehicle
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Entry
            </li>
          </ol>
        </nav>
      </div>

      <div className="d-flex justify-content-center mb-5">
        <div className="col-md-6">
          <div className="d-flex justify-content-center">
            <Typeahead
              onChange={(selected) => {
                setVehicle(selected[0]);
              }}
              options={vehicles}
              labelKey={(option) => `[${option.type}] ${option.registration}`}
              filterBy={["text", "name"]}
              placeholder="Choose vehicle..."
              className="flex-grow-1"
            />
          </div>
        </div>
      </div>

      {vehicle && (
        <div className="row">
          <div className={`col-md-6 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Vehicle Details </h4>
                    <h5 className="mr-5 my-auto">{vehicle.registration}</h5>
                    <p className="text-muted mt-2">{vehicle.type}</p>
                    {/* <div className="d-flex mb-5"> */}
                        
              </div>
            </div>
          </div>
          {/* <div className={`col-md-12 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title"> Feature Suggestions </h4>
                <h5>User Feature Suggestion</h5>
                <ul>
                  {featureSuggestions.user.map((suggestion, index) => (
                    <li key={index}>
                      <span className="font-weight-bold">{suggestion[0]}</span>:{" "}
                      {suggestion[1]}
                    </li>
                  ))}
                </ul>
                <h5>Doctor Feature Suggestion</h5>
                <ul>
                  {featureSuggestions.doctor.map((suggestion, index) => (
                    <li key={index}>
                      <span className="font-weight-bold">{suggestion[0]}</span>:{" "}
                      {suggestion[1]}
                    </li>
                  ))}
                </ul>
                <h5>Test Feature Suggestion</h5>
                <ul>
                  {featureSuggestions.test.map((suggestion, index) => (
                    <li key={index}>
                      <span className="font-weight-bold">{suggestion[0]}</span>:{" "}
                      {suggestion[1]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
}
