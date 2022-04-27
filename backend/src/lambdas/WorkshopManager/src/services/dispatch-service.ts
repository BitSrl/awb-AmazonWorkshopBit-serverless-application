import { IResponse } from '../interfaces';
import { IDataModels } from '../interfaces';
import { logger } from '../utils';
import { WorkshopService } from './workshop-service';


const LOG_PREFIX_CLASS = 'DispatchService | ';

export class DispatchService {

    public async dispatch(inputParams: IDataModels.InputParams): Promise<IResponse.WorkshopResponse[] | IResponse.MessageResponse | IResponse.WorkshopIdResponse> {
        const logPrefix = `${LOG_PREFIX_CLASS}dispatch | `;
        logger.info(`${logPrefix}Start`);

        const workshopService = new WorkshopService();

        switch (inputParams.requestType) {
            case 'RETRIEVE_WORKSHOPS':
                return await workshopService.retrieveWorkshops(inputParams);
            case 'CREATE_WORKSHOP':
                return await workshopService.createWorkshop(inputParams);
            case 'UPDATE_WORKSHOP':
                return await workshopService.updateWorkshop(inputParams);
            case 'DELETE_WORKSHOP':
                return await workshopService.deleteWorkshop(inputParams);
        }
    }
}