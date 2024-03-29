import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { formatDateFromTimestamp } from "./VehicleEntry";
import { getBills } from "../api/landfill";

export default function LandfillBills() {
  const [bill, setBill] = useState([]);

  useEffect(() => {
    getBills().then((bills) => setBill(bills));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Landfill Bills</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Landfill
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Bills
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Bills per Vehicle Entry</h4>
              <p className="card-description">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th>Bill #</th>
                      <th>STS Name</th>
                      <th>STS Location</th>
                      <th>Vehicle Reg #</th>
                      <th>Vehicle Type</th>
                      <th>Amount </th>
                      <th>Time</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.map((b) => (
                      <tr key={b.bill_id}>
                        <td>{b.bill_id}</td>
                        <td>{b.name}</td>
                        <td>{b.location}</td>
                        <td>{b.registration}</td>
                        <td>{b.type}</td>
                        <td>{Number.parseInt(100 * b.amount) / 100}</td>
                        <td>{formatDateFromTimestamp(b.timestamp)}</td>
                        <td>
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => {
                              toast.success("Bill details will be shown here");
                            }}
                          >
                            <i className="mdi mdi-eye"></i>
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
    </div>
  );
}
