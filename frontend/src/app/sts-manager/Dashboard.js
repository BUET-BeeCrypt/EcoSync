import React, { useEffect } from "react";
import Spinner from "../shared/Spinner";
import toast from "react-hot-toast";
import { getStats } from "../api/profile";

function App() {
  const [stats, setStats] = React.useState(null);

  useEffect(() => {
    toast.promise(
      getStats().then((stats) => {
        setStats(stats);
      }),
      {
        loading: "Loading stats...",
        success: "Stats loaded!",
        error: (e) => {
          console.log(e);
          if (e.response.status === 404) {
            setStats(undefined);
            return "Failed to load stats";
          }
        },
      }
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Dashboard{" "}
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>

      {stats === null ? (
        <Spinner />
      ) : stats === undefined ? (
        <div className="alert alert-danger" role="alert">
          {/* not assigned to any STS */}
          <h4 className="alert-heading">No STS Assigned</h4>
          <p>
            You are not assigned to any STS. Please contact the system
            administrator.
          </p>
        </div>
      ) : (
        <>
          <div className="row">
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-danger card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Ward # {stats.sts.ward_no} | Zone # {stats.sts.zone_no}{" "}
                    <i className="mdi mdi-information mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{stats.sts.name}</h2>
                  <h6 className="card-text">
                    <i className="mdi mdi-map-marker"></i> {stats.sts.location}
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Capacity{" "}
                    <i className="mdi mdi-chart-line mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">
                    {stats.sts.capacity} Tons{" "}
                    <span className="mdi mdi-arrow-up"></span>
                  </h2>
                  <h6 className="card-text">
                    {" "}
                    <i className="mdi mdi-arrow-right mr-2"></i>
                    Dump Area: {stats.sts.dump_area}{" "}
                  </h6>
                  <h6>
                    {" "}
                    <i className="mdi mdi-arrow-right mr-2"></i>
                    Coverage Area: {stats.sts.coverage_area}
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-success card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    No Of Vehicles{" "}
                    <i className="mdi mdi-dump-truck mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{stats.vehicles.length} </h2>
                  <h6 className="card-text">
                    Total Capacity:{" "}
                    {stats.vehicles.reduce((a, b) => a + b.capacity, 0)} Tons
                  </h6>
                </div>
              </div>
            </div>
          </div>

          {/* Table of vehicles */}
          <div className="row">
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Vehicles</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Vehicle Registration</th>
                          <th>Capacity</th>
                          <th>Vehicle Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.vehicles.map((vehicle) => (
                          <tr key={vehicle.vehicle_id}>
                            <td>{vehicle.registration}</td>
                            <td>{vehicle.capacity} Tons</td>
                            <td>{vehicle.type}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Current Fleet Information</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Vehicle Registration</th>
                          <th>Remaining Trips</th>
                          <th>Total Trips</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.fleet.map((fleet) => (
                          <tr key={fleet.vehicle_id}>
                            <td>{fleet.registration}</td>
                            <td>{fleet.remaining_trip}</td>
                            <td>{fleet.total_trip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
