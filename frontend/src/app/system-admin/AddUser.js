import { useRef } from "react";
import { Button } from "react-bootstrap";
import { validate } from "../user-pages/validate";
import toast from "react-hot-toast";
import { Link, useHistory } from "react-router-dom";
import { addDoctorRequest } from "../api/admin";

export default function AddUser() {
  const inputRef = useRef();

  const usernameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();
  const sendEmailRef = useRef();

  const handleRegister = () => {
    const username = usernameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;
    const sendEmail = sendEmailRef.current.checked;

    const err = validate({ username, email, password });

    if (err) {
      toast.error(err);
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      const toastId = toast.loading("Registering", { duration: 5000 });
      //   register(username, email, password).then((res) => {
      //     toast.dismiss(toastId);
      //     history.push("/auth/login");
      //     toast.success("Check your mail for account confiramtion", {duration: 5000});
      //   }).catch(err => {
      //     toast.dismiss(toastId);
      //     toast.error("Registration failed! Try again later.")
      //   })
    }
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Add New User </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Admin
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Add User
            </li>
          </ol>
        </nav>
      </div>

      {/* big card */}
      <div className="row">
        <div className="col-md-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title mb-4">New unassigned user</h4>
              <form className="pt-3">
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    ref={usernameRef}
                    placeholder="Username"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    ref={emailRef}
                    placeholder="Email"
                  />
                </div>
                {/* <div className="form-group">
                  <select
                    className="form-control form-control-lg"
                    id="exampleFormControlSelect2"
                  >
                    <option>Country</option>
                    <option>United States of America</option>
                    <option>United Kingdom</option>
                    <option>India</option>
                    <option>Germany</option>
                    <option>Argentina</option>
                  </select>
                </div> */}
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    ref={passwordRef}
                    placeholder="Password"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    ref={confirmPasswordRef}
                    placeholder="Confirm Password"
                  />
                </div>
                <div className="mb-4">
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        ref={sendEmailRef}
                      />
                      <i className="input-helper"></i>Send email to user with
                      username and password
                    </label>
                  </div>
                </div>
                <div className="mt-3">
                  <Button
                    className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                    onClick={handleRegister}
                  >
                    CREATE USER
                  </Button>
                </div>
                <div className="text-center mt-4 font-weight-light">
                  Already have the user? Change proerties in{" "}
                  <Link to="/admin/users" className="text-primary">
                    Users
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
