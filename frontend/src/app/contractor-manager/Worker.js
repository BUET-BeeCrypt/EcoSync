import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import { USER_ROLES } from "../App";
import { createOrUpdateWorkers, getContractorWorkers } from "../api/contractor";

const headers = [
  "contract_worker_id",
  "contract_company_id",
  "name",
  "contact_number",
  "date_of_birth",
  "date_of_hire",
  "job_title",
  "payement_per_hour",
];

const createAndDownloadCSV = (headers, rows) => {
  const csvContent =
    "data:text/csv;charset=utf-8," +
    headers.join(",") +
    "\n" +
    rows
      .map((row) => headers.map((header) => row[header]).join(","))
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "landfill_facilities.csv");
  document.body.appendChild(link);
  link.click();
};

const jsonFromCSV = (csv) => {
  const lines = csv.split(/\r\n|\n/);
  const headers = lines[0].split(",");
  const result = [];
  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    if (lines[i].trim() === "") {
      continue;
    }
    const currentline = lines[i].split(",");
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }
    result.push(obj);
  }
  return result;
};

function jsonToCsv(items) {
  const header = Object.keys(items[0]);
  const headerString = header.join(",");
  // handle null or undefined values here
  const replacer = (key, value) => value ?? "";
  const rowItems = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(",")
  );
  // join header and body, and break into separate lines
  const csv = [headerString, ...rowItems].join("\r\n");
  return csv;
}

const downloadJSONasCSV = (json, filename) => {
  const encodedUri = encodeURI(
    "data:text/csv;charset=utf-8," + jsonToCsv(json)
  );
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
};

const readFileAsText = (file) => {
  console.log("file: ", file);
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = reject;
    reader.readAsText(file, "utf-8");
  });
};

export default function Workers() {
  const [data, setData] = useState([]);

  useEffect(() => {
    toast.promise(
      getContractorWorkers().then((rows) => {
        setData(rows);
      }),
      {
        loading: "Loading workers...",
        success: "Workers loaded!",
        error: "Failed to load workers",
      }
    );
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Waste Landfill Sites </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Facilities
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Landfill
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-lg-12 grid-margin stretch-card">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">
                Landfill
                <span className="float-right">
                  <button
                    className={"btn btn-outline-primary btn-sm icon-btn"}
                    onClick={(e) => {
                      e.preventDefault();
                      downloadJSONasCSV(data, "workers.csv");
                    }}
                  >
                    <i className="mdi mdi-arrow-down-thick"></i>
                    <span>Download</span>
                  </button>
                  <span className="ml-2">
                    Upload
                    <input
                      type="file"
                      className={"btn btn-outline-primary btn-sm icon-btn ml-2"}
                      onChange={(e) => {
                        e.preventDefault();
                        readFileAsText(e.target.files[0]).then((text) => {
                          const rows = jsonFromCSV(text);
                          toast.promise(
                            createOrUpdateWorkers(rows).then(() => {
                              setData(rows);
                            }),
                            {
                              loading: "Uploading...",
                              success: "Uploaded successfully",
                              error: "Failed to upload",
                            }
                          );
                        });
                      }}
                    />
                  </span>
                  {/* <span>Upload</span>
                    <i className="mdi mdi-arrow-up-thick"></i>
                  </button> */}
                  <button
                    className={"btn btn-outline-success btn-sm icon-btn"}
                    onClick={(e) => {
                      e.preventDefault();
                      createAndDownloadCSV(headers, []);
                    }}
                  >
                    <i className="mdi mdi-table mr-2"></i>
                    <span>Download Sample</span>
                  </button>
                </span>
              </h4>
              <p className="card-description">
                <table className="table table-outline table-hover">
                  <thead>
                    <tr>
                      <th> Worker ID </th>
                      <th> Company ID </th>
                      <th> Name </th>
                      <th> Contact Number </th>
                      <th> Date of Birth </th>
                      <th> Date of Hire </th>
                      <th> Job Title </th>
                      <th> Payment Per Hour </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row) => (
                      <tr>
                        <td> {row.contract_worker_id} </td>
                        <td> {row.contract_company_id} </td>
                        <td> {row.name} </td>
                        <td> {row.contact_number} </td>
                        <td> {row.date_of_birth} </td>
                        <td> {row.date_of_hire} </td>
                        <td> {row.job_title} </td>
                        <td> {row.payement_per_hour} </td>
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
