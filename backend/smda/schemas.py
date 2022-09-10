from typing import List

from pydantic import BaseModel
import numpy as np


class DrilledWellboreMetadata(BaseModel):
    uuid: str
    unique_wellbore_identifier: str
    unique_well_identifier: str
    purpose: str
    status: str
    content: str
    field_identifier: str
    field_uuid: str
    completion_date: str
    license_identifier: str


class Trajectory(BaseModel):
    name:str
    x_arr: List[float]  # np.ndarray
    y_arr: List[float]  # np.ndarray
    z_arr: List[float]  # np.ndarray
    md_arr: List[float]  # np.ndarray
