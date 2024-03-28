import { Typeahead } from "react-bootstrap-typeahead";
import { Button, ProgressBar } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  // Polygon,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";
import Spinner from "../shared/Spinner";
import toast from "react-hot-toast";
import {
  addSTSEntry,
  confirmFleet,
  getFleet,
  getSTSVehicles,
} from "../api/sts";

const center = {
  lat: 23.8041,
  lng: 90.4152,
};

const containerStyle = {
  width: "100%",
  height: "100%",
};

export default function FleetGenerate() {
  const [fleet, setFleet] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBvbT4Izaq1XXNZr5dGEAwZ-K752P9CJ84",
  });

  const [map, setMap] = React.useState(null);
  const [selected, setSelected] = React.useState(null);
  const [route, setRoute] = React.useState(null);

  useEffect(() => {
    toast.promise(
      getFleet().then((fleet) => {
        setFleet(fleet);
        const direction = JSON.parse(fleet.direction.direction).map((d) => ({
          lat: Number.parseFloat(d[1]),
          lng: Number.parseFloat(d[0]),
        }));
        setRoute({
          directions: [direction],
          landfills: [fleet.landfill],
        });
      }),
      {
        loading: "Generating fleet...",
        success: "Fleet generated!",
        error: "Failed to generate fleet",
      }
    );
  }, []);

  useEffect(() => {
    if (route && map) {
      // for each route.directions
      for (let i = 0; i < route.directions.length; i++) {
        const flightPath = new window.google.maps.Polyline({
          path: route.directions[i],
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2.5,
        });
        flightPath.setMap(map);
      }
    }
  }, [route, map]);

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
        <h3 className="page-title"> Fleet Generate </h3>
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="!#" onClick={(event) => event.preventDefault()}>
                STS
              </a>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              Fleet
            </li>
          </ol>
        </nav>
      </div>

      {fleet && (
        <div className="row">
          <div className="col-md-9">
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
                      {route?.landfills &&
                        route.landfills.map((landfill) => (
                          <Marker
                            key={landfill.id}
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
                                    <h2>Landfill</h2>
                                    <p>{landfill.name}</p>
                                  </div>
                                </InfoWindow>
                              )}
                          </Marker>
                        ))}
                      {/* {data.map((d) => (
                      <Marker
                        key={d.id}
                        position={{
                          lat: d.latitude,
                          lng: d.longitude,
                        }}
                        onClick={() => {
                          setSelected(d);
                        }}
                      >
                        {selected &&
                          selected.latitude === d.latitude &&
                          selected.longitude === d.longitude && (
                            <InfoWindow
                              onCloseClick={() => {
                                setSelected(null);
                              }}
                            ></InfoWindow>
                          )}
                      </Marker>
                    ))} */}
                      {/* <PolyGon paths={route} options={{ strokeColor: '#FF0000', fillColor: '#FF000040' }} /> */}
                    </GoogleMap>
                  ) : (
                    <Spinner />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={`col-md-3 grid-margin stretch-card`}>
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Landfill</h4>
                <hr />
                <div className="row">
                  {route?.landfills &&
                    route.landfills.map((landfill) => (
                      <div className="col-md-12">
                        <div className="d-flex justify-content-between align-items-center">
                          <h5>{landfill.name}</h5>
                          <Button
                            variant="primary btn-sm btn-rounded"
                            onClick={() => {
                              setSelected(landfill);
                              map.setZoom(12);
                            }}
                          >
                            View
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
                <h4 className="card-title mt-4">Fleet</h4>
                <hr />
                <p className="card-description">Vehicles with trip time</p>
                <div className="row">
                  {fleet.vehicles.map((vehicle) => (
                    <div className="col-md-12">
                      <p className="text-muted">
                        Times: {vehicle.total_trip} | Capacity:{" "}
                        {vehicle.capacity}
                      </p>
                      <p>
                        [{vehicle.registration}] - {vehicle.type}
                      </p>
                    </div>
                  ))}
                  <div className="col-md-12">
                    <p className="text-muted"> </p>
                    <p>
                      <button
                        className="btn btn-primary btn-block"
                        onClick={(e) => {
                          e.preventDefault();
                          toast.promise(
                            confirmFleet(
                              fleet.direction.route_id,
                              fleet.vehicles
                            ).then(() => {
                              e.target.disabled = true;
                            }),
                            {
                              loading: "Confirming fleet...",
                              success: "Fleet saved!",
                              error: "Failed to confirm fleet",
                            }
                          );
                        }}
                      >
                        Confirm
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
