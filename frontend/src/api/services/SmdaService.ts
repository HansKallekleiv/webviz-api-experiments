/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DrilledWellboreMetadata } from '../models/DrilledWellboreMetadata';
import type { Trajectory } from '../models/Trajectory';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SmdaService {

    /**
     * Fetch Well Metadata
     * Return metadata for drilled wells
     * TODO: Select field
     * @param requestBody
     * @returns DrilledWellboreMetadata Successful Response
     * @throws ApiError
     */
    public static smdaFetchWellMetadata(
        requestBody?: Array<string>,
    ): CancelablePromise<Array<DrilledWellboreMetadata>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/smda/drilled_wellbore_metadata/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Fetch Well Trajectories
     * Return trajectories for wells
     * @param requestBody
     * @returns Trajectory Successful Response
     * @throws ApiError
     */
    public static smdaFetchWellTrajectories(
        requestBody?: Array<string>,
    ): CancelablePromise<Array<Trajectory>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/smda/trajectories/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
