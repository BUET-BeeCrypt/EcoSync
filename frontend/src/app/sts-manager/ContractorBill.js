import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { formatDateFromTimestamp } from "./VehicleEntry";
import { getBills } from "../api/landfill";
import domToPdf from "dom-to-pdf";
import { generateTodaysBill, getContractorBills } from "../api/sts";

const doubleDigitPrecision = (num) => Number.parseInt(100 * num) / 100;

export default function ContractorBills() {
  const [bill, setBill] = useState([]);
  const [selected, setSelected] = useState(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    getContractorBills().then((bills) => setBill(bills));
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Contractor Bills</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Contractor
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
                      <p className="text-muted">Bill ID</p>
                      <h3 className="text-dark">{selected.bill_id}</h3>
                    </div>

                    <div className="col-md-3 form-group">
                      <p className="text-muted">STS ID</p>
                      <h3 className="text-dark">{selected.sts_id}</h3>
                    </div>

                    <div className="col-md-6 form-group">
                      <p className="text-muted">Date/Time</p>
                      <h3 className="text-dark">
                        {formatDateFromTimestamp(selected.created)}
                      </h3>
                    </div>

                    <div className="col-md-6 form-group">
                      <p className="text-muted">Contractor Name</p>
                      <h3 className="text-dark">{selected.name}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Contact</p>
                      <h3 className="text-dark">{selected.contact_number}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Payment Rate (Tk/Ton)</p>
                      <h3 className="text-dark">{selected.ton_payment_rate}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Fine Rate (Tk/Tons)</p>
                      <h3 className="text-dark">{selected.fine_per_ton}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Waste Collected (Tons)</p>
                      <h3 className="text-dark">{selected.waste_collected}</h3>
                    </div>
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Waste Required (Tons)</p>
                      <h3 className="text-dark">{selected.waste_required}</h3>
                    </div>

                    {/* Basic Pay */}
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Basic Pay (Tk)</p>
                      <h3 className="text-dark">
                        {doubleDigitPrecision(
                          selected.waste_collected * selected.payment_per_ton
                        )}
                      </h3>
                    </div>

                    {/* Fine Pay */}
                    <div className="col-md-6 form-group">
                      <p className="text-muted">Fine Pay (Tk)</p>
                      <h3 className="text-dark">
                        {doubleDigitPrecision(
                          Math.max(
                            0,
                            selected.waste_required - selected.waste_collected
                          ) * selected.fine_per_ton
                        )}
                      </h3>
                    </div>

                    {/* Total Pay */}
                    <div className="col-md-12 form-group">
                      <p className="text-muted">Total Pay (Tk)</p>
                      <h3 className="text-dark">
                        {doubleDigitPrecision(
                          selected.waste_collected * selected.payment_per_ton -
                            Math.max(
                              0,
                              selected.waste_required - selected.waste_collected
                            ) *
                              selected.fine_per_ton
                        )}
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
              <h4 className="card-title">
                Bills per Vehicle Entry
                <span className="float-right">
                  <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => {
                      toast.promise(
                        generateTodaysBill().then((bills) => setBill(bills)),
                        {
                          loading: "Generating Bills",
                          success: "Bills Generated",
                          error: "Failed generating bills",
                        }
                      );
                    }}
                  >
                    <i className="mdi mdi-lightning-bolt"></i> Generate Today's
                    Bills
                  </button>
                </span>
              </h4>
              <p className="card-description">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th>Bill #</th>
                      <th>[ID] Contractor Name</th>
                      <th>Time</th>
                      <th>Waste Required (Ton)</th>
                      <th>Waste Collected (Ton)</th>
                      <th>Basic - Fine = Total</th>
                      <th>View</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bill.map((b) => (
                      <tr key={b.bill_id}>
                        <td>{b.bill_id}</td>
                        <td>
                          [{b.contract_company_id}] {b.name}
                        </td>
                        <td>{formatDateFromTimestamp(b.created)}</td>
                        <td>{b.waste_required}</td>
                        <td>{b.waste_collected}</td>
                        <td>
                          {doubleDigitPrecision(
                            b.waste_collected * b.payment_per_ton
                          )}{" "}
                          -{" "}
                          {doubleDigitPrecision(
                            Math.max(0, b.waste_required - b.waste_collected) *
                              b.fine_per_ton
                          )}{" "}
                          ={" "}
                          {doubleDigitPrecision(
                            b.waste_collected * b.payment_per_ton -
                              Math.max(
                                0,
                                b.waste_required - b.waste_collected
                              ) *
                                b.fine_per_ton
                          )}
                        </td>
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
