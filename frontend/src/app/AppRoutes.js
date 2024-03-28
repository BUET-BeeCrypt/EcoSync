import React, { Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import Spinner from "../app/shared/Spinner";
import { useContext } from "react";
import { USER_ROLES, UserContext } from "./App";

const Register = lazy(() => import("./user-pages/Register"));
const Verify = lazy(() => import("./user-pages/Verify"));
const Login = lazy(() => import("./user-pages/Login"));
const ForgetPassword = lazy(() => import("./user-pages/ForgetPassword"));

const SystemAdminHome = lazy(() => import("./system-admin/Dashboard"));
const AddUser = lazy(() => import("./system-admin/AddUser"));
const Users = lazy(() => import("./system-admin/Users"));
const STSFacilities = lazy(() => import("./system-admin/STSFacilities"));
const LandfillFacilities = lazy(() =>
  import("./system-admin/LandfillFacilities")
);
const Vehicles = lazy(() => import("./system-admin/Vehicles"));

const STSVehicleEntry = lazy(() => import("./sts-manager/VehicleEntry"));
const STSVehicleExit = lazy(() => import("./sts-manager/VehicleExit"));
const DumpEntry = lazy(() => import("./sts-manager/DumpEntry"));
const STSRecords = lazy(() => import("./sts-manager/Records"));
const STSRoutes = lazy(() => import("./sts-manager/GoogleMap"));
const FleetGeneration = lazy(() => import("./sts-manager/FleetGenerate"));

const LandfillVehicleEntry = lazy(() => import("./landfill-manager/VehicleEntry"));
const LandfillVehicleExit = lazy(() => import("./landfill-manager/VehicleExit"));
// const LandfillBills = lazy(() => import("./landfill-manager/Bills"));
const LandfillRecords = lazy(() => import("./landfill-manager/Records"));

// const Activate = lazy(() => import("./user-pages/Activate"));
// const ActivateDoctor = lazy(() => import("./user-pages/RegisterDoctor"));

// const SecuritySettings = lazy(() => import("./common/SecuritySettings"));
// const AddDocument = lazy(() => import("./common/UploadDocument"));
// const Logs = lazy(() => import("./common/Logs"));

// const UserHome = lazy(() => import("./user/Dashboard"));
// const ViewDocuments = lazy(() => import("./user/OwnedDocuments"));
// const PendingDocuments = lazy(() => import("./user/NotAcceptedDocuments"));
// const Collections = lazy(() => import("./user/Collections"));
// const SharedByMe = lazy(() => import("./user/SharedByMe"));
// const UserSettings = lazy(() => import("./user/UserSettings"));
// const SymptomChecker = lazy(() => import("./user/SymptomChecker"));
// const PDFAnalyzer = lazy(() => import("./user/PDFAnalyzer"));

// const AdminHome = lazy(() => import("./admin/Dashboard"));
// const AddDoctor = lazy(() => import("./admin/AddDoctor"));
// const Users = lazy(() => import("./admin/Users"));

// const DoctorHome = lazy(() => import("./doctor/Dashboard"));
// const SharedWithMe = lazy(() => import("./doctor/SharedWithMe"));
// const UploadedByDoctor = lazy(() => import("./doctor/UploadedByDoctor"));
// const AccessEmergency = lazy(() => import("./doctor/AceessEmergencyProfile"));
// const DoctorSettings = lazy(() => import("./doctor/DoctorSettings"));

export default function AppRoutes() {
  const { user } = useContext(UserContext);

  return (
    <Suspense fallback={<Spinner />}>
      <Switch>
        {/* <Route path="/verify" component={Verify} /> */}

        {user && (
          <Switch>
            {/* <Route path="/security-settings" component={SecuritySettings} /> */}

            {user?.role === USER_ROLES.STS_MANAGER && (
              <Switch>
                <Route path="/sts/dashboard" component={SystemAdminHome} />
                <Route path="/sts/vehicle/entry" component={STSVehicleEntry} />
                <Route path="/sts/vehicle/exit" component={STSVehicleExit} />
                <Route path="/sts/route/fleet" component={FleetGeneration} />
                <Route path="/sts/dump" component={DumpEntry} />
                <Route path="/sts/records" component={STSRecords} />
                <Route path="/sts/route/find" component={STSRoutes} />
                <Redirect to="/sts/dashboard" />
              </Switch>
            )}

            {user?.role === USER_ROLES.LANDFILL_MANAGER && (
              <Switch>
                <Route path="/landfill/dashboard" component={SystemAdminHome} />
                <Route path="/landfill/vehicle/entry" component={LandfillVehicleEntry} />
                <Route path="/landfill/vehicle/exit" component={LandfillVehicleExit} />
                {/* <Route path="/landfill/bills" component={LandfillBills} /> */}
                <Route path="/landfill/records" component={LandfillRecords} />
                <Redirect to="/landfill/dashboard" />
              </Switch>
            )}

            {user?.role === USER_ROLES.SYSTEM_ADMIN && (
              <Switch>
                <Route path="/admin/dashboard" component={SystemAdminHome} />
                <Route path="/admin/add-user" component={AddUser} />
                <Route path="/admin/users" component={Users} />
                <Route path="/admin/facilities/sts" component={STSFacilities} />
                <Route
                  path="/admin/facilities/landfill"
                  component={LandfillFacilities}
                />
                <Route path="/admin/vehicles" component={Vehicles} />
                <Redirect to="/admin/dashboard" />
              </Switch>
            )}

            {user?.role === "ROLE_DOCTOR" && (
              <Switch>
                {/* <Route path="/doctor/dashboard" component={DoctorHome} />
                <Route path="/doctor/documents/add" component={AddDocument} />
                <Route path="/doctor/documents/view" component={SharedWithMe} />
                <Route path="/doctor/emergency" component={AccessEmergency} />
                <Route path="/doctor/settings" component={DoctorSettings} />
                <Route path="/doctor/logs" component={Logs} />
                <Route
                  path="/doctor/documents/uploaded"
                  component={UploadedByDoctor}
                />
                <Route
                  path="/doctor/collections"
                  component={Collections}
                  exact
                />
                <Route path="/doctor/collections/:id" component={Collections} />
                <Redirect to="/doctor/dashboard" /> */}
              </Switch>
            )}
          </Switch>
        )}

        {!user && (
          <Switch>
            <Route path="/auth/login" component={Login} />
            <Route path="/auth/register" component={Register} />
            <Route path="/auth/forget-password" component={ForgetPassword} />
            {/* <Route path="/auth/activate/:token" component={Activate} />
            <Route path="/auth/doctor/:token" component={ActivateDoctor} /> */}
            <Redirect to="/auth/login" />
          </Switch>
        )}
      </Switch>
    </Suspense>
  );
}
