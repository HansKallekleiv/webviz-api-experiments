from typing import Optional, List
from pydantic import BaseModel, conlist


class Case(BaseModel):
    name: str
    description: Optional[str] = None


class Iteration(BaseModel):
    name: str
    type: Optional[str] = None  # Monte Carlo / Sensitivity
    description: Optional[str] = None


class Realization(BaseModel):
    number: int
    sensitivity_name: Optional[str] = None
    sensitivity_case: Optional[str] = None


class SurfaceAttribute(BaseModel):
    attribute: str
    surface_names: List[str]
    surface_dates: Optional[List[str]] = None


class SurfaceAddress(BaseModel):
    case_name: str
    iteration_name: str
    realization_number: int
    attribute_name: str
    surface_name: str
    surface_date: Optional[str]


class SurfaceDeckGLData(BaseModel):
    image_url: str
    xmin: float
    ymin: float
    xmax: float
    ymax: float
    zmin: float
    zmax: float
    rot_deg: Optional[float] = 0
