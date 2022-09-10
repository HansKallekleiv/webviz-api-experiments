import io

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import numpy as np
import xtgeo

from .schemas import *
from .utils._surface_to_png import surface_to_png_bytes_optimized

# from ..dependencies import get_token_header

router = APIRouter(
    prefix="/sumo",
    tags=["sumo"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@router.get("/cases/", response_model=List[Case])
def fetch_cases():
    """
    Returns case objects from Sumo.
    TODO: Select field
    """
    return [Case(name="case1"), Case(name="case2")]


@router.get("/iterations/", response_model=List[Iteration])
def fetch_iterations(case_name: str):
    """
    Fetch iterations for a Sumo case
    """
    return [Iteration(name="iter-0"), Iteration(name="iter-3")]


@router.get("/realizations/", response_model=List[Realization])
def fetch_realizations(case_name: str, iteration_name: str):
    """
    Fetch realizations for a Sumo iteration
    """
    return [Realization(number=r) for r in range(0, 100)]


@router.get("/surface_collection/", response_model=List[SurfaceAttribute])
def fetch_surface_collection(case_name: str, iteration_name: str):
    """
    Fetch all available surface objects given a Sumo case and  iteration
    """
    return [
        SurfaceAttribute(
            attribute="depthsurface", surface_names=["top", "middle", "base"]
        ),
        SurfaceAttribute(
            attribute="seismic_amplitude", surface_names=["top", "middle", "base"]
        ),
    ]


@router.get("/surface_data/", response_model=SurfaceDeckGLData)
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


@router.get("/surface_image/")
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
