import React, { useState, useEffect } from "react";
import { DeckGLMap } from "@webviz/subsurface-components";
function App() {
  const [cases, setCases] = useState();
  const [iterations, setIterations] = useState();
  const [realizations, setRealizations] = useState();
  const [attributes, setAttributes] = useState();
  const [surfaceData, setSurfaceData] = useState();
  useEffect(() => {
    fetch("/cases").then((res) =>
      res.json().then((data) => {
        setCases(data);
      })
    );
  }, []);
  useEffect(() => {
    if (cases) {
      fetch(`/iterations?case_name=${cases[0].name}`).then((res) =>
        res.json().then((data) => {
          setIterations(data);
        })
      );
    }
  }, [cases]);
  useEffect(() => {
    if (iterations) {
      fetch(
        `/realizations?case_name=${cases[0].name}&iteration_name=${iterations[0].name}`
      ).then((res) =>
        res.json().then((data) => {
          setRealizations(data);
        })
      );
    }
  }, [iterations]);
  useEffect(() => {
    if (realizations) {
      fetch(
        `/surface_collection?case_name=${cases[0].name}&iteration_name=${iterations[0].name}`
      ).then((res) =>
        res.json().then((data) => {
          setAttributes(data);
        })
      );
    }
  }, [realizations]);
  useEffect(() => {
    if (attributes) {
      fetch(
        `/surface_data?case_name=${cases[0].name}&iteration_name=${iterations[0].name}&attribute_name=${attributes[0].attribute}&surface_name=${attributes[0].surface_names[0]}`
      ).then((res) =>
        res.json().then((data) => {
          setSurfaceData(data);
          console.log(JSON.stringify(data));
        })
      );
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
              image: `http://localhost:5000/surface_image/?image_url=${surfaceData.image_url}`,
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
          ]}
          views={{
            layout: [1, 1],
            viewports: [
              {
                id: "view_1",
                show3D: false,
                layerIds: [],
              },
            ],
          }}
        ></DeckGLMap>
      )}
    </div>
  );
}

export default App;
