import { IResponse } from '../interfaces';
import { logger } from '../utils';
import { v4 as Uuidv4 } from 'uuid';


import { IDataModels } from '../interfaces';
import { DynamoDBService } from './dynamodb-service';
import { AWBErrors } from '../utils/errors';

const LOG_PREFIX_CLASS = 'WorkshopService | ';

export class WorkshopService {


    public async retrieveWorkshops(inputParams: IDataModels.InputParams): Promise<IResponse.WorkshopResponse[]> {
        const logPrefix = `${LOG_PREFIX_CLASS}retrieveWorkshops | `;

        let response: IResponse.WorkshopResponse[] = [];
        try {
            const dynamoDBService = new DynamoDBService();

            if(inputParams.queryString && inputParams.queryString.speakerId !== undefined && inputParams.queryString.workshopId === null) {
                response = await dynamoDBService.getWorkshopsBySpeakerId(inputParams.queryString.speakerId);
            }
            if(inputParams.queryString && inputParams.queryString.workshopId !== undefined && inputParams.queryString.speakerId !== undefined) {
                const itemResponse = await dynamoDBService.getWorkshopsBySpeakerIdAndWorkshopId(inputParams.queryString.speakerId, inputParams.queryString.workshopId);
                response.push(itemResponse);
            }
            if(inputParams.queryString && inputParams.queryString.workshopId === undefined && inputParams.queryString.speakerId === undefined) {
                response = await dynamoDBService.getAllWorkshops();
            }

            return response;

        } catch (error) {
            logger.debug(`${logPrefix}error: ${JSON.stringify(error)}`);
            throw error;
        }

    }

    public async createWorkshop(inputParams: IDataModels.InputParams): Promise<IResponse.WorkshopIdResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS}createWorkshop | `;

        try {
            if(!inputParams.workshopRequest || !inputParams.workshopRequest.speakerName || !inputParams.workshopRequest.workshopName || !inputParams.workshopRequest.workshopObjectives) {
                logger.error(`${logPrefix}request body is missing required fields`);
                throw new AWBErrors.BadRequest('request body is missing required fields');
            }

            const workshopId = 'wor-' + Uuidv4();
            const speakerId = 'spe-' + Uuidv4();

            const dynamoDBService = new DynamoDBService();
            await dynamoDBService.putWorkshop({
                workshopId: workshopId,
                speakerId: speakerId,
                workshopName: inputParams.workshopRequest.workshopName,
                speakerName: inputParams.workshopRequest.speakerName,
                workshopObjectives: inputParams.workshopRequest.workshopObjectives
            });

            return {
                workshopId: workshopId,
                speakerId: speakerId
            }

        } catch (error) {
            logger.debug(`${logPrefix}error: ${JSON.stringify(error)}`);
            throw error;
        }

    }

    public async updateWorkshop(inputParams: IDataModels.InputParams): Promise<IResponse.MessageResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS}updateWorkshop | `;

        try {

            if(!inputParams.pathParams || !inputParams.pathParams.speakerId || !inputParams.pathParams.workshopId || !inputParams.workshopRequest) {
                logger.error(`${logPrefix}request body is missing required fields`);
                throw new AWBErrors.BadRequest('request body is missing required fields');
            }

            const dynamoDBService = new DynamoDBService();

            const responseItem = await dynamoDBService.getWorkshopsBySpeakerIdAndWorkshopId(inputParams.pathParams.speakerId, inputParams.pathParams.workshopId);

            if(inputParams.workshopRequest.speakerName) {
                responseItem.speakerName = inputParams.workshopRequest.speakerName;
            }
            if(inputParams.workshopRequest.workshopName) {
                responseItem.workshopName = inputParams.workshopRequest.workshopName;
            }
            if(inputParams.workshopRequest.workshopObjectives) {
                responseItem.workshopObjectives = inputParams.workshopRequest.workshopObjectives;
            }

            await dynamoDBService.putWorkshop(responseItem);

            return {
                message: 'success'
            }

        } catch (error) {
            logger.debug(`${logPrefix}error: ${JSON.stringify(error)}`);
            throw error;
        }

    }

    public async deleteWorkshop(inputParams: IDataModels.InputParams): Promise<IResponse.MessageResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS}deleteWorkshop | `;

        try {

            if(!inputParams.pathParams || !inputParams.pathParams.speakerId || !inputParams.pathParams.workshopId ) {
                logger.error(`${logPrefix}request body is missing required fields`);
                throw new AWBErrors.BadRequest('request body is missing required fields');
            }

            const dynamoDBService = new DynamoDBService();

            await dynamoDBService.deleteWorkshop(inputParams.pathParams.workshopId, inputParams.pathParams.speakerId);

            return {
                message: 'success'
            }
        } catch (error) {
            logger.debug(`${logPrefix}error: ${JSON.stringify(error)}`);
            throw error;
        }

    }

}
