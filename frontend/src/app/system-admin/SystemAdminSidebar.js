import React, { Component, useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { UserContext } from "../App";

function SideBar(props) {
  const [state, setState] = useState({});
  const { user } = React.useContext(UserContext);

  const toggleMenuState = (menuState) => {
    if (state[menuState]) {
      setState({ [menuState]: false });
    } else if (Object.keys(state).length === 0) {
      setState({ [menuState]: true });
    } else {
      Object.keys(state).forEach((i) => {
        setState({ [i]: false });
      });
      setState({ [menuState]: true });
    }
  };

  useEffect(() => {
    const body = document.querySelector("body");
    document.querySelectorAll(".sidebar .nav-item").forEach((el) => {
      el.addEventListener("mouseover", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.add("hover-open");
        }
      });
      el.addEventListener("mouseout", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.remove("hover-open");
        }
      });
    });
  }, []);

  useEffect(() => {
    document.querySelector("#sidebar").classList.remove("active");
    Object.keys(state).forEach((i) => {
      setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: "/user/assistance", state: "assistanceMenuOpen" },
      { path: "/user/documents", state: "documentsMenuOpen" },
      { path: "/admin/facilities", state: "facilitiesMenuOpen" },
      { path: "/admin/roles", state: "rolesMenuOpen" },
    ];

    dropdownPaths.forEach((obj) => {
      if (isPathActive(obj.path)) {
        setState({ [obj.state]: true });
      }
    });
  }, [props.location]);

  const isPathActive = (path) => {
    return props.location.pathname.startsWith(path);
  };

  return (
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a
            href="!#"
            className="nav-link"
            onClick={(evt) => evt.preventDefault()}
          >
            <div className="nav-profile-image">
              <img
                src={
                  user?.image || require("../../assets/images/faces/face1.jpg")
                }
                alt="profile"
              />
              <span className="login-status online"></span>{" "}
              {/* change to offline or busy as needed */}
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">
                {user?.username || "Admin"}
              </span>
              <span className="text-secondary text-small">Site Admin</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        <li
          className={
            isPathActive("/admin/dashboard") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/admin/dashboard">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        {/* <li
          className={
            isPathActive("/user/assistance") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.assistanceMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("assistanceMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Assistance</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-assistant menu-icon"></i>
          </div>
          <Collapse in={state.assistanceMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/symptom-checker-free")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/symptom-checker-free"
                >
                  Symptom Checker - Free
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/symptom-checker-pro")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/symptom-checker-pro"
                >
                  Symptom Checker - Pro
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/analysis")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/anlysis"
                >
                  Report Analysis
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/assistance/skin-care")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/assistance/skin-care"
                >
                  Skin Care
                </Link>
              </li>
            </ul>
          </Collapse>
        </li> */}
        <li
          className={
            isPathActive("/admin/add-user") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/admin/add-user">
            <span className="menu-title">Add User</span>
            <i className="mdi mdi-plus-circle-outline menu-icon"></i>
          </Link>
        </li>
        {/* <li
          className={
            isPathActive("/user/documents") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.documentsMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("documentsMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Documents</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-file-document menu-icon"></i>
          </div>
          <Collapse in={state.documentsMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/documents/add")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/documents/add"
                >
                  Upload
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/documents/view")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/documents/view"
                >
                  View
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/user/documents/accept")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/user/documents/accept"
                >
                  Accept
                </Link>
              </li>
            </ul>
          </Collapse>
        </li> */}
        {/* <li
          className={
            isPathActive("/admin/add-hospital") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/admin/add-hospital">
            <span className="menu-title">Add Hospital</span>
            <i className="mdi mdi-plus-network-outline menu-icon"></i>
          </Link>
        </li> */}
        <li
          className={
            isPathActive("/admin/users") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/admin/users">
            <span className="menu-title">Users</span>
            <i className="mdi mdi-account menu-icon"></i>
          </Link>
        </li>
        {/* <li
          className={
            isPathActive("/admin/roles") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/admin/roles">
            <span className="menu-title">Roles</span>
            <i className="mdi mdi-security menu-icon"></i>
          </Link>
        </li> */}

        <li
          className={
            isPathActive("/admin/roles") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.rolesMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("rolesMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Role Management</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-security-network menu-icon"></i>
          </div>
          <Collapse in={state.rolesMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/admin/roles/roles")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/admin/roles/roles"
                >
                  Roles
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/admin/roles/permissions")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/admin/roles/permissions"
                >
                  Permissions
                </Link>
              </li>
            </ul>
          </Collapse>
        </li>

        {/* <li
          className={
            isPathActive("/admin/facilities") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/admin/facilities">
            <span className="menu-title">Facilities</span>
            <i className="mdi mdi-home-group menu-icon"></i>
          </Link>
        </li> */}
        <li
          className={
            isPathActive("/admin/facilities") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.facilitiesMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("facilitiesMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Management</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-home-group menu-icon"></i>
          </div>
          <Collapse in={state.facilitiesMenuOpen}>
            <ul className="nav flex-column sub-menu">
            <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/admin/facilities/contractor")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/admin/facilities/contractor"
                >
                  Contractors
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/admin/facilities/sts")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/admin/facilities/sts"
                >
                  STS
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/admin/facilities/landfill")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/admin/facilities/landfill"
                >
                  Landfill
                </Link>
              </li>
              
            </ul>
          </Collapse>
        </li>
        <li
          className={
            isPathActive("/admin/vehicles") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/admin/vehicles">
            <span className="menu-title">Vehicles</span>
            <i className="mdi mdi-dump-truck menu-icon"></i>
          </Link>
        </li>
        <li
          className={
            isPathActive("/user/settings") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/user/settings">
            <span className="menu-title">Settings</span>
            <i className="mdi mdi-cog menu-icon"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default withRouter(SideBar);
