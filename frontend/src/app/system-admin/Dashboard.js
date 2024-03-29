import React, { useEffect } from "react";
import Spinner from "../shared/Spinner";
import toast from "react-hot-toast";
import { getStats } from "../api/profile";
import {
  GoogleMap,
  useJsApiLoader,
  // Polygon,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

const center = {
  lat: 23.8091,
  lng: 90.3599,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

function App() {
  const [stats, setStats] = React.useState(null);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBvbT4Izaq1XXNZr5dGEAwZ-K752P9CJ84",
  });

  const [map, setMap] = React.useState(null);
  const [selected, setSelected] = React.useState(null);

  useEffect(() => {
    toast.promise(
      getStats().then((stats) => {
        setStats(stats);
      }),
      {
        loading: "Loading stats...",
        success: "Stats loaded!",
        error: "Failed to load stats",
      }
    );
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
    // map zoom set to 8
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h3 className="page-title">
          <span className="page-title-icon bg-gradient-primary text-white mr-2">
            <i className="mdi mdi-home"></i>
          </span>{" "}
          Dashboard{" "}
        </h3>
        <nav aria-label="breadcrumb">
          <ul className="breadcrumb">
            <li className="breadcrumb-item active" aria-current="page">
              <span></span>Overview{" "}
              <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle"></i>
            </li>
          </ul>
        </nav>
      </div>
      {!stats ? (
        <Spinner />
      ) : (
        <>
          <div className="row">
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-danger card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Number of STS{" "}
                    <i className="mdi mdi-silo-outline mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{stats.count.sts}</h2>
                  <h6 className="card-text">
                    with {stats.garbage.sts} Tons Garbage
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Number of Vehicles{" "}
                    <i className="mdi mdi-dump-truck mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{stats.count.vehicles}</h2>
                  <h6 className="card-text">
                    {stats.garbage.vehicle} Tons Garbage in Transit
                  </h6>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-success card-img-holder text-white">
                <div className="card-body">
                  <img
                    src={
                      require("../../assets/images/dashboard/circle.svg")
                        .default
                    }
                    className="card-img-absolute"
                    alt="circle"
                  />
                  <h4 className="font-weight-normal mb-3">
                    Number of Landfills{" "}
                    <i className="mdi mdi-delete-variant mdi-24px float-right"></i>
                  </h4>
                  <h2 className="mb-5">{stats.count.landfill}</h2>
                  <h6 className="card-text">
                    with {stats.garbage.landfill} Tons Garbage
                  </h6>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12">
              <div className="card">
                <div className="card-body">
                  <div
                    style={{
                      "--aspect-ratio": "16/9",
                    }}
                  >
                    {isLoaded ? (
                      <GoogleMap
                        mapContainerStyle={containerStyle}
                        center={center}
                        zoom={8}
                        yesIWantToUseGoogleMapApiInternals
                        onLoad={onLoad}
                        onUnmount={onUnmount}
                      >
                        {stats &&
                          stats.location?.sts.map((sts) => (
                            <Marker
                              key={sts.sts_id}
                              position={{
                                lat: sts.latitude,
                                lng: sts.longitude,
                              }}
                              onClick={() => {
                                setSelected(sts);
                              }}
                            >
                              {selected &&
                                selected.latitude === sts.latitude &&
                                selected.longitude === sts.longitude && (
                                  <InfoWindow
                                    onCloseClick={() => {
                                      setSelected(null);
                                    }}
                                  >
                                    <div>
                                      <h2>{sts.name}</h2>
                                      <p>{sts.location}</p>
                                    </div>
                                  </InfoWindow>
                                )}
                            </Marker>
                          ))}
                        {stats &&
                          stats.location?.landfill.map((landfill) => (
                            <Marker
                              key={landfill.landfill_id}
                              position={{
                                lat: landfill.latitude,
                                lng: landfill.longitude,
                              }}
                              onClick={() => {
                                setSelected(landfill);
                              }}
                            >
                              {selected &&
                                selected.latitude === landfill.latitude &&
                                selected.longitude === landfill.longitude && (
                                  <InfoWindow
                                    onCloseClick={() => {
                                      setSelected(null);
                                    }}
                                  >
                                    <div>
                                      <h2>{landfill.name}</h2>
                                      <p>Landfill</p>
                                    </div>
                                  </InfoWindow>
                                )}
                            </Marker>
                          ))}
                      </GoogleMap>
                    ) : (
                      <Spinner />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
