import React, { useEffect, useState } from "react";
import { DeckGLMap } from "@webviz/subsurface-components";
import {
  SumoService,
  Case,
  Iteration,
  Realization,
  SurfaceAttribute,
  SurfaceDeckGLData,
  SmdaService,
  Trajectory,
} from "./api";

const trajectories2deckgl = (trajectories?: Trajectory[]) => {
  if (!trajectories) {
    return { type: "FeatureCollection", features: [] };
  }
  const data = {
    type: "FeatureCollection",
    features: trajectories.map((traj) => {
      return {
        type: "Feature",
        geometry: {
          type: "GeometryCollection",
          geometries: [
            {
              type: "Point",
              coordinates: [traj.x_arr[0], traj.y_arr[0]],
            },
            {
              type: "LineString",
              coordinates: traj.x_arr.map((x, idx) => {
                return [traj.x_arr[idx], traj.y_arr[idx], traj.z_arr[idx]];
              }),
            },
          ],
        },
        properties: {
          name: traj.name,
          color: [28, 255, 12, 255],
          md: [traj.md_arr],
        },
      };
    }),
  };
  return data;
};

function App() {
  const [cases, setCases] = useState<Case[]>();
  const [trajectories, setTrajectories] = useState<Trajectory[]>();
  const [iterations, setIterations] = useState<Iteration[]>();
  const [realizations, setRealizations] = useState<Realization[]>();
  const [attributes, setAttributes] = useState<SurfaceAttribute[]>();
  const [surfaceData, setSurfaceData] = useState<SurfaceDeckGLData>();
  useEffect(() => {
    SumoService.sumoFetchCases().then((data) => setCases(data));
  }, []);
  useEffect(() => {
    if (cases) {
      SumoService.sumoFetchIterations(cases[0].name).then((data) =>
        setIterations(data)
      );
      SmdaService.smdaFetchWellTrajectories().then((data) =>
        setTrajectories(data)
      );
    }
  }, [cases]);
  useEffect(() => {
    if (iterations && cases) {
      SumoService.sumoFetchRealizations(cases[0].name, iterations[0].name).then(
        (data) => setRealizations(data)
      );
    }
  }, [iterations]);
  useEffect(() => {
    if (cases && iterations && realizations) {
      SumoService.sumoFetchSurfaceCollection(
        cases[0].name,
        iterations[0].name
      ).then((data) => {
        setAttributes(data);
      });
    }
  }, [realizations]);
  useEffect(() => {
    if (cases && iterations && realizations && attributes) {
      SumoService.sumoFetchSurfaceData(
        cases[0].name,
        iterations[0].name,
        realizations[0].number,
        attributes[0].attribute,
        attributes[0].surface_names[0]
      ).then((data) => setSurfaceData(data));
    }
  }, [attributes]);

  return (
    <div style={{ height: "90vh" }}>
      {surfaceData && (
        <DeckGLMap
          id={"map"}
          bounds={[
            surfaceData.xmin,
            surfaceData.ymin,
            surfaceData.xmax,
            surfaceData.ymax,
          ]}
          layers={[
            {
              "@@type": "ColormapLayer",

              pickable: true,
              image: `http://localhost:5000/sumo/surface_image/?image_url=${surfaceData.image_url}`,
              bounds: [
                surfaceData.xmin,
                surfaceData.ymin,
                surfaceData.xmax,
                surfaceData.ymax,
              ],
              colorMapName: "Physics",
              rotDeg: surfaceData.rot_deg,
              valueRange: [surfaceData.zmin, surfaceData.zmax],
              colorMapRange: [surfaceData.zmin, surfaceData.zmax],
            },
            {
              "@@type": "WellsLayer",
              data: trajectories2deckgl(trajectories),
            },
          ]}
        ></DeckGLMap>
      )}
    </div>
  );
}

export default App;
