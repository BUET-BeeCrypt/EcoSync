import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { formatDateFromTimestamp } from "./VehicleEntry";
import { getBills } from "../api/landfill";
import domToPdf from "dom-to-pdf";

export default function LandfillBills() {
  const [bill, setBill] = useState([]);
  const [selected, setSelected] = useState(null);
  const pdfRef = useRef(null);

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

      {selected && (
        <div className="row" ref={pdfRef}>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">
                  Bill ID: {selected.bill_id}
                  <span className="float-right">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => {
                        const element = pdfRef.current;
                        const option = {
                          filename: `bill-${selected.bill_id}.pdf`,
                          overrideWidth: 1000,
                          excludeTagNames: ["button"],
                        };
                        toast.promise(
                          new Promise((resolve, reject) => {
                            domToPdf(element, option, (pdf) => {
                              console.log("Done");
                              resolve();
                            });
                          }),
                          {
                            loading: "Generating PDF",
                            success: "Downloading PDF",
                            error: "Failed generating PDF",
                          }
                        );
                      }}
                    >
                      <i className="mdi mdi-download"></i> Download PDF
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm ml-2"
                      onClick={() => {
                        setSelected(null);
                      }}
                    >
                      <i className="mdi mdi-close"></i>
                    </button>
                  </span>
                </h4>
                <p className="card-description mt-4">
                  <div className="row">
                    <div className="col-md-3 form-group">
                      <p className="text-muted">STS Ward No</p>
                      <h3 className="text-dark">{selected.ward_no}</h3>
                    </div>

                    <div className="col-md-3 form-group">
                      <p className="text-muted">STS Zone No</p>
                      <h3 className="text-dark">{selected.zone_no}</h3>
                    </div>

                    <div className="col-md-6 form-group">
                      <p className="text-muted">Date/Time</p>
                      <h3 className="text-dark">
                        {formatDateFromTimestamp(selected.timestamp)}
                      </h3>
                    </div>

                    <div className="col-md-6 form-group">
                      <p className="text-muted">STS Name</p>
                      <h3 className="text-dark">{selected.name}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">STS Location</p>
                      <h3 className="text-dark">{selected.location}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Vehicle Registration</p>
                      <h3 className="text-dark">{selected.registration}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Vehicle Type</p>
                      <h3 className="text-dark">{selected.type}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Distance (Km) x 2</p>
                      <h3 className="text-dark">{selected.distance}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Amount (Tk)</p>
                      <h3 className="text-dark">
                        {Number.parseInt(100 * selected.amount) / 100}
                      </h3>
                    </div>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

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
                              setSelected(b);
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
