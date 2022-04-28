import { DispatchService, ServiceHandler } from './services';
import { IDataModels } from './interfaces';
import { logger } from './utils';
import { Utilities } from './utils/utilities';


const LOG_PREFIX = 'Handler|';


/**
    * @description
    * @param {*} event: Request in JSON format received by Lambda.
    * @param {*} context: AWS Lambda uses this parameter to provide details of your Lambda function's
    * execution.
 */
const handler = async (event: any, context: any): Promise<any> => {
    logger.info(`${LOG_PREFIX} #LAMBDA_START#`);

    let response;
    let headers;

    const utils = new Utilities();

    try {

        const transformedEvent: IDataModels.TransformedInputEvent = utils.transformInputEvent(event, context);
        logger.debug(`${LOG_PREFIX}  Transformed requestObj -->  ${JSON.stringify(transformedEvent)}`);

        // Initialize logger cache & load properties

        headers = transformedEvent.headers || event.headers;

        // call service layer
        const serviceHandler = new ServiceHandler();
        const inputParams: IDataModels.InputParams = serviceHandler.getServiceParams(transformedEvent);
        logger.info(`${LOG_PREFIX}  inputParams  -->  ${JSON.stringify(inputParams )}`);

        const dispatchService = new DispatchService();
        const responseBody  = await dispatchService.dispatch(inputParams);
        logger.info(`${LOG_PREFIX}  responseBody  -->  ${JSON.stringify(responseBody )}`);
        response = utils.buildResponseWithCorsHeaders(200, responseBody , headers);

    } catch (error) {
        logger.error(`${LOG_PREFIX} catch|:${JSON.stringify(error)}`);
        response = utils.buildResponseWithCorsHeaders(405, {name: error.intfcMsgCode, message: error.name}, headers);
    }

    logger.info(`${LOG_PREFIX} #LAMBDA_END#`);
    return response;
}

export { handler }
