
import { IDataModels } from '../interfaces';
import { GetEventSchema, PostEventSchema, PatchEventSchema, Constants, DeleteEventSchema } from '../../constants';
import { JsonValidator, logger } from '../utils';
import { AWBErrors } from '../utils/errors';

const LOG_PREFIX_CLASS = 'ServiceHandler | ';

export class ServiceHandler {

    protected validateEvent(event: IDataModels.TransformedInputEvent, eventSchema: any): void {
        const logPrefix = `${LOG_PREFIX_CLASS}validateEvent | `;
        const validate = JsonValidator.validateJson(event, eventSchema);
        if ( !validate.valid ) {
            logger.error(`${logPrefix} event not valid`)
            throw new AWBErrors.BadRequest('Input event is not valid'+ JSON.stringify(validate.errors));
        }
    }

    public getServiceParams(inputEvent: IDataModels.TransformedInputEvent): IDataModels.InputParams {
        const logPrefix = `${LOG_PREFIX_CLASS}getParams | `;
        try {
            const requestMethod: string = inputEvent.runTimeInfo && inputEvent.runTimeInfo.httpMethod || '';
            const requestType: IDataModels.requestType = this.getRequestType(requestMethod.toUpperCase());
            logger.debug(`${logPrefix} requestMethod: ${requestMethod} -- requestType: ${JSON.stringify(requestType)}`);

            switch (requestType) {
                case 'RETRIEVE_WORKSHOPS':
                    this.validateEvent(inputEvent, GetEventSchema);
                    return this.map(inputEvent, requestType);
                case 'CREATE_WORKSHOP':
                    this.validateEvent(inputEvent, PostEventSchema);
                    return this.map(inputEvent, requestType);
                case 'UPDATE_WORKSHOP':
                    this.validateEvent(inputEvent, PatchEventSchema);
                    return this.map(inputEvent, requestType);
                case 'DELETE_WORKSHOP':
                    this.validateEvent(inputEvent, DeleteEventSchema);
                    return this.map(inputEvent, requestType);
            }
        } catch (error) {
            throw error;
        }
    }

    protected getRequestType(requestMethod: string): IDataModels.requestType {
        if ( Constants.REQUEST_TYPE_MAPPING[requestMethod] ) {
            return Constants.REQUEST_TYPE_MAPPING[requestMethod] as IDataModels.requestType;
        } else {
            throw new AWBErrors.BadRequest('HttpMethod is not valid');
        }
    }

    protected map(event: IDataModels.TransformedInputEvent, requestMethod: IDataModels.requestType): IDataModels.InputParams {
        switch (requestMethod) {
            case 'RETRIEVE_WORKSHOPS':
                return {
                    requestType: 'RETRIEVE_WORKSHOPS',
                    queryString: event.queryString,

                };
            case 'CREATE_WORKSHOP':
                return {
                    requestType: 'CREATE_WORKSHOP',
                    workshopRequest: event.requestBody,

                };
            case 'UPDATE_WORKSHOP':
                return {
                    requestType: 'UPDATE_WORKSHOP',
                    workshopRequest: event.requestBody,
                    pathParams: event.pathParams
                }
            case 'DELETE_WORKSHOP':
                return {
                    requestType: 'DELETE_WORKSHOP',
                    pathParams: event.pathParams
                }
        }
    }

}
