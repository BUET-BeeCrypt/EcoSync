import { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import toast from "react-hot-toast";
import { getProfile, updateProfile } from "../api/profile";
import { validate } from "../user-pages/validate";
import { changePassword } from "../api/auth";

export default function Settings() {
  const nameRef = useRef();
  const usernameRef = useRef();
  const emailRef = useRef();

  const passwordRef = useRef();
  const newPasswordRef = useRef();
  const confirmNewPasswordRef = useRef();

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    toast.promise(getProfile().then(setProfile), {
      loading: "Loading profile...",
      success: "Profile loaded!",
      error: "Failed to load profile",
    });
  }, []);

  const handleUpdateProfile = async (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const username = usernameRef.current.value;
    const email = emailRef.current.value;

    const e = validate(name, username, email);

    if (e === null) {
      toast.promise(updateProfile(name, username, email), {
        loading: "Updating profile...",
        success: "Profile updated!",
        error: "Failed to update profile",
      });
    } else {
      toast.error(e);
    }
  };

  const updatePassword = async (event) => {
    event.preventDefault();
    const password = passwordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmNewPassword = confirmNewPasswordRef.current.value;

    if (newPassword !== confirmNewPassword) {
      toast.error("New password and confirm password do not match.");
      return;
    }

    toast.promise(
      changePassword(localStorage.getItem("token"), password, newPassword),
      {
        loading: "Changing password...",
        success: "Password changed!",
        error: "Failed to change password",
      }
    );
  };

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title"> Settings </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                Profile
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Settings
            </li>
          </ol>
        </nav>
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              {profile && (
                <Form onSubmit={handleUpdateProfile}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={profile.name}
                      ref={nameRef}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      defaultValue={profile.username}
                      ref={usernameRef}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      defaultValue={profile.email}
                      ref={emailRef}
                    />
                  </Form.Group>

                  <button type="submit" className="btn btn-primary">
                    Update Profile
                  </button>
                </Form>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <Form onSubmit={updatePassword}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control type="password" ref={newPasswordRef} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control type="password" ref={confirmNewPasswordRef} />
                </Form.Group>

                <button type="submit" className="btn btn-primary">
                  Change Password
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
