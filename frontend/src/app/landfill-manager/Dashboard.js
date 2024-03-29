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
                    Landfill Site{" "}
                    <i className="mdi mdi-information mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{stats.landfill.name}</h2>
                  <h6 className="card-text">
                    <i className="mdi mdi-map-marker"></i>(
                    {stats.landfill.latitude}, {stats.landfill.longitude})
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
                    Current Volume{" "}
                    <i className="mdi mdi-chart-line mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">
                    {stats.landfill.total_volume} Tons{" "}
                    <span className="mdi mdi-arrow-up"></span>
                  </h2>
                  <h6 className="card-text">
                    {" "}
                    Number of Entries: {stats.entries_count}
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
                    No Of Bills{" "}
                    <i className="mdi mdi-dump-truck mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{stats.bills_count}</h2>
                  <h6 className="card-text">
                    Number of Managers: {stats.landfill.managers_count}
                  </h6>
                </div>
              </div>
            </div>
          </div>

          {/* Table of vehicles */}
          <div className="row">
            <div className="col-md-12 grid-margin stretch-card">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Upcoming Fleet Information</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>STS #</th>
                          <th>Vehicle Registration</th>
                          <th>Vehicle Type</th>
                          <th>Done Trips</th>
                          <th>Total Trips</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.fleet.map((fleet) => (
                          <tr
                            key={fleet.vehicle_id}
                            className={
                              fleet.done_trip === fleet.available_trip
                                ? "table-success"
                                : "table-warning"
                            }
                          >
                            <td>{fleet.sts_id}</td>
                            <td>{fleet.registration}</td>
                            <td>{fleet.type}</td>
                            <td>{fleet.done_trip}</td>
                            <td>{fleet.available_trip}</td>
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
