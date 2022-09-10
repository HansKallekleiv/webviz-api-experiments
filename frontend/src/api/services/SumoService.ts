/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Case } from '../models/Case';
import type { Iteration } from '../models/Iteration';
import type { Realization } from '../models/Realization';
import type { SurfaceAttribute } from '../models/SurfaceAttribute';
import type { SurfaceDeckGLData } from '../models/SurfaceDeckGLData';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SumoService {

    /**
     * Fetch Cases
     * Returns case objects from Sumo.
     * TODO: Select field
     * @returns Case Successful Response
     * @throws ApiError
     */
    public static sumoFetchCases(): CancelablePromise<Array<Case>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sumo/cases/',
            errors: {
                404: `Not found`,
            },
        });
    }

    /**
     * Fetch Iterations
     * Fetch iterations for a Sumo case
     * @param caseName
     * @returns Iteration Successful Response
     * @throws ApiError
     */
    public static sumoFetchIterations(
        caseName: string,
    ): CancelablePromise<Array<Iteration>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sumo/iterations/',
            query: {
                'case_name': caseName,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Fetch Realizations
     * Fetch realizations for a Sumo iteration
     * @param caseName
     * @param iterationName
     * @returns Realization Successful Response
     * @throws ApiError
     */
    public static sumoFetchRealizations(
        caseName: string,
        iterationName: string,
    ): CancelablePromise<Array<Realization>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sumo/realizations/',
            query: {
                'case_name': caseName,
                'iteration_name': iterationName,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Fetch Surface Collection
     * Fetch all available surface objects given a Sumo case and  iteration
     * @param caseName
     * @param iterationName
     * @returns SurfaceAttribute Successful Response
     * @throws ApiError
     */
    public static sumoFetchSurfaceCollection(
        caseName: string,
        iterationName: string,
    ): CancelablePromise<Array<SurfaceAttribute>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sumo/surface_collection/',
            query: {
                'case_name': caseName,
                'iteration_name': iterationName,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Fetch Surface Data
     * Fetch metadata for a specific surface, and an url pointer to the
     * image array.
     * Probably better to send the image data directly here, possible
     * just send the raw array and then generate the image on the frontend.
     * @param caseName
     * @param iterationName
     * @param realizationNumber
     * @param attributeName
     * @param surfaceName
     * @param surfaceDate
     * @returns SurfaceDeckGLData Successful Response
     * @throws ApiError
     */
    public static sumoFetchSurfaceData(
        caseName: string,
        iterationName: string,
        realizationNumber: number,
        attributeName: string,
        surfaceName: string,
        surfaceDate?: string,
    ): CancelablePromise<SurfaceDeckGLData> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sumo/surface_data/',
            query: {
                'case_name': caseName,
                'iteration_name': iterationName,
                'realization_number': realizationNumber,
                'attribute_name': attributeName,
                'surface_name': surfaceName,
                'surface_date': surfaceDate,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

    /**
     * Fetch Surface Image
     * Returns the surface image
     * @param imageUrl
     * @returns any Successful Response
     * @throws ApiError
     */
    public static sumoFetchSurfaceImage(
        imageUrl: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/sumo/surface_image/',
            query: {
                'image_url': imageUrl,
            },
            errors: {
                404: `Not found`,
                422: `Validation Error`,
            },
        });
    }

}
