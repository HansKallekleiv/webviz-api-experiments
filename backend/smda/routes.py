import io
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
import numpy as np
import xtgeo

from .schemas import *

# from ..dependencies import get_token_header

router = APIRouter(
    prefix="/smda",
    tags=["smda"],
    # dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)


@router.get("/drilled_wellbore_metadata/", response_model=List[DrilledWellboreMetadata])
def fetch_well_metadata(well_name_filter: Optional[List[str]] = None):
    """
    Return metadata for drilled wells
    TODO: Select field
    """
    return [
        DrilledWellboreMetadata(
            uuid=str,
            unique_wellbore_identifier="test",
            unique_well_identifier="test",
            purpose="test",
            status="test",
            content="test",
            field_identifier="test",
            field_uuid="test",
            completion_date="test",
            license_identifier="test",
        ),
        DrilledWellboreMetadata(
            uuid="test2",
            unique_wellbore_identifier="test2",
            unique_well_identifier="test2",
            purpose="test2",
            status="test2",
            content="test2",
            field_identifier="test2",
            field_uuid="test2",
            completion_date="test2",
            license_identifier="test2",
        ),
    ]


@router.get("/trajectories/", response_model=List[Trajectory])
def fetch_well_trajectories(uuids: List[str] = None):
    """
    Return trajectories for wells
    """
    return [
        Trajectory(
            name="test",
            x_arr=[1.0, 2.0, 3.0],
            y_arr=[3.0, 2.0, 1.0],
            z_arr=[0.0, 10.0, 20.0],
            md_arr=[0.0, 12.0, 13.0],
        ),
        Trajectory(
            name="test2",
            x_arr=[2.0, 3.0, 4.0],
            y_arr=[4.0, 3.0, 2.0],
            z_arr=[0.0, 10.0, 20.0],
            md_arr=[0.0, 12.0, 13.0],
        ),
    ]
