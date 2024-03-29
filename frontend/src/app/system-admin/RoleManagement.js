import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function RoleManagement() {
  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Role Management</h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Admin
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Roles
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
}
