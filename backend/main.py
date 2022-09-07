import io
from fastapi import FastAPI, APIRouter, Depends
from typing import Optional, List
from fastapi.responses import StreamingResponse
from fastapi.routing import APIRoute
import numpy as np
import xtgeo
from _schemas import (
    Case,
    Iteration,
    Realization,
    SurfaceAttribute,
    SurfaceAddress,
    SurfaceDeckGLData,
)

from _surface_to_png import surface_to_png_bytes_optimized

from fastapi.middleware.cors import CORSMiddleware


def custom_generate_unique_id(route: APIRoute):
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    generate_unique_id_function=custom_generate_unique_id, openapi_url="/openapi.json"
)
origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
api_router = APIRouter()

"""TODO: Add oauth middleware"""


@api_router.get("/cases/", tags=["sumo"], response_model=List[Case])
def fetch_cases():
    """
    Returns case objects from Sumo.
    TODO: Select field
    """
    return [Case(name="case1"), Case(name="case2")]


@api_router.get("/iterations/", tags=["sumo"], response_model=List[Iteration])
def fetch_iterations(case_name: str):
    """
    Fetch iterations for a Sumo case
    """
    if case_name == "case1":
        return [Iteration(name="iter-0"), Iteration(name="iter-3")]
    if case_name == "case2":
        return [Iteration(name="iter-0")]


@api_router.get("/realizations/", tags=["sumo"], response_model=List[Realization])
def fetch_realizations(case_name: str, iteration_name: str):
    """
    Fetch realizations for a Sumo iteration
    """
    if case_name == "case1":
        return [Realization(number=r) for r in range(0, 100)]
    if case_name == "case2":
        return [Realization(number=r) for r in range(0, 10)]


@api_router.get(
    "/surface_collection/", tags=["sumo"], response_model=List[SurfaceAttribute]
)
def fetch_surface_collection(case_name: str, iteration_name: str):
    """
    Fetch all available surface objects given a Sumo case and  iteration
    """
    if case_name == "case1":
        return [
            SurfaceAttribute(
                attribute="depthsurface", surface_names=["top", "middle", "base"]
            ),
            SurfaceAttribute(
                attribute="seismic_amplitude", surface_names=["top", "middle", "base"]
            ),
        ]
    if case_name == "case2":
        return [
            SurfaceAttribute(
                attribute="depthsurface", surface_names=["top", "middle", "base"]
            )
        ]


@api_router.get("/surface_data/", tags=["sumo"], response_model=SurfaceDeckGLData)
def fetch_surface_data(
    surface_address: SurfaceAddress = Depends(),
):
    """
    Fetch metadata for a specific surface, and an url pointer to the
    image array.
    Probably better to send the image data directly here, possible
    just send the raw array and then generate the image on the frontend.
    """
    surface = xtgeo.RegularSurface(ncol=10, nrow=10, xinc=1, yinc=1)
    surface.values = np.random.rand(*surface.values.shape)
    img = surface_to_png_bytes_optimized(surface)
    return SurfaceDeckGLData(
        image_url="unique_url",
        xmin=surface.xmin,
        ymin=surface.ymin,
        xmax=surface.xmax,
        ymax=surface.ymax,
        zmin=np.min(surface.values),
        zmax=np.max(surface.values),
    )


@api_router.get("/surface_image/", tags=["sumo"])
def fetch_surface_image(
    image_url: str,
):
    """
    Returns the surface image
    """
    surface = xtgeo.RegularSurface(ncol=10, nrow=10, xinc=1, yinc=1)
    surface.values = np.random.rand(*surface.values.shape)
    img = surface_to_png_bytes_optimized(surface)
    return StreamingResponse(io.BytesIO(img), media_type="image/png")


app.include_router(api_router)


if __name__ == "__main__":
    # Use this for debugging purposes only
    import uvicorn

    uvicorn.run("main:app", host="localhost", port=5000, reload=True, log_level="debug")
