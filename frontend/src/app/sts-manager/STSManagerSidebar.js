import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { Collapse } from "react-bootstrap";
import { UserContext } from "../App";

function STSManagerSideBar(props) {
  const [state, setState] = useState({});
  const { user } = React.useContext(UserContext);

  const [imageURL, setImageURL] = useState("");

  // useEffect(() => {
  //   console.log("user: ", user);
  //   if (user?.role === "ROLE_USER") {
  //     getProfile().then((res) => {
  //       setImageURL(res.imageURL);
  //     });
  //   }
  // }, [user?.username]);

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
      { path: "/sts/vehicle", state: "vehicleMenuOpen" },
      { path: "/sts/route", state: "routeMenuOpen" },
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
                src={imageURL || require("../../assets/images/faces/face1.jpg")}
                alt="profile"
              />
              <span className="login-status online"></span>{" "}
              {/* change to offline or busy as needed */}
            </div>
            <div className="nav-profile-text">
              <span className="font-weight-bold mb-2">
                {user?.username || "User"}
              </span>
              <span className="text-secondary text-small">STS Manager</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge"></i>
          </a>
        </li>
        <li
          className={
            isPathActive("/sts/dashboard") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/sts/dashboard">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon"></i>
          </Link>
        </li>
        <li
          className={
            isPathActive("/sts/vehicle") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.vehicleMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("vehicleMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Vehicle</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-dump-truck menu-icon"></i>
          </div>
          <Collapse in={state.vehicleMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/sts/vehicle/entry")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/sts/vehicle/entry"
                >
                  Entry
                </Link>
              </li>
              {/* <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/sts/assistance/symptom-checker-pro")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/sts/assistance/symptom-checker-pro"
                >
                  Symptom Checker - Pro
                </Link>
              </li> */}
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/sts/vehicle/exit")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/sts/vehicle/exit"
                >
                  Exit
                </Link>
              </li>
              {/* <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/sts/assistance/skin-care")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/sts/assistance/skin-care"
                >
                  Skin Care
                </Link>
              </li> */}
            </ul>
          </Collapse>
        </li>
        <li
          className={
            isPathActive("/sts/dump") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/sts/dump">
            <span className="menu-title">Add Dump Record</span>
            <i className="mdi mdi-delete-variant menu-icon"></i>
          </Link>
        </li>
        <li
          className={
            isPathActive("/sts/route") ? "nav-item active" : "nav-item"
          }
        >
          <div
            className={
              state.routeMenuOpen ? "nav-link menu-expanded" : "nav-link"
            }
            onClick={() => toggleMenuState("routeMenuOpen")}
            data-toggle="collapse"
          >
            <span className="menu-title">Routes</span>
            <i className="menu-arrow"></i>
            <i className="mdi mdi-map-marker-distance menu-icon"></i>
          </div>
          <Collapse in={state.routeMenuOpen}>
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/sts/route/find")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/sts/route/find"
                >
                  Find Route
                </Link>
              </li>
              <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/sts/route/fleet")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/sts/route/fleet"
                >
                  Deploy Fleet
                </Link>
              </li>
              {/* <li className="nav-item">
                {" "}
                <Link
                  className={
                    isPathActive("/sts/documents/accept")
                      ? "nav-link active"
                      : "nav-link"
                  }
                  to="/sts/documents/accept"
                >
                  Accept
                </Link>
              </li> */}
            </ul>
          </Collapse>
        </li>
        <li
          className={
            isPathActive("/sts/bills") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/sts/bills">
            <span className="menu-title">Bills</span>
            <i className="mdi mdi-cash-register menu-icon"></i>
          </Link>
        </li>
        {/* <li
          className={
            isPathActive("/sts/shared") ? "nav-item active" : "nav-item"
          }
        >
          <Link className="nav-link" to="/sts/shared">
            <span className="menu-title">Shared Documents</span>
            <i className="mdi mdi-share menu-icon"></i>
          </Link>
        </li> */}
        <li
          className={isPathActive("/sts/records") ? "nav-item active" : "nav-item"}
        >
          <Link className="nav-link" to="/sts/records">
            <span className="menu-title">Records</span>
            <i className="mdi mdi-book-open-variant-outline menu-icon"></i>
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

export default withRouter(STSManagerSideBar);
