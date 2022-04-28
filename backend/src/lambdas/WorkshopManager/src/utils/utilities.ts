import { IDataModels } from '../interfaces';
import { AWBErrors } from './errors';
import { logger } from './logger';

const LOG_PREFIX_CLASS = 'Utilities | ';
export class Utilities {
    public transformInputEvent(event: any, context: any): IDataModels.TransformedInputEvent {
        const LOG_PREFIX_FN = LOG_PREFIX_CLASS + 'transformInputEvent|';
        const startTs = new Date().getTime();
        context.callbackWaitsForEmptyEventLoop = false;
        try {
            logger.info(`${LOG_PREFIX_FN} #EVENT_TRANSFORMATION_START# |Masking Event`);
            // Parse request body
            let requestBody;
            try {
                if (event['body-json']) {
                    requestBody = event['body-json'];
                } else {
                    if (event.body) {
                        requestBody = JSON.parse(event.body);
                    }
                }
            } catch (error) {
                logger.warn(`${LOG_PREFIX_FN} error: ${JSON.stringify(error)}`);
                requestBody = event.body;
            }

            let pathParams = event.pathParameters || {};
            let queryString = event.queryStringParameters || {};
            let runTimeInfo: any = {};
            const headers: any = {};

            let headersObj = event.headers;
            if (event.params) {
                pathParams = event.params.path || {};
                headersObj = headersObj || event.params.header || {};
                queryString = event.params.querystring || {};
            }

            if (!requestBody && Object.keys(pathParams).length === 0) {
                requestBody = event;
            }
            if (headersObj) {
                Object.keys(headersObj).forEach((hKey) => {
                    headers[hKey] = headersObj[hKey];
                });
            }
            const stageVariables = event['stage-variables'] || event.stageVariables || {};
            let cloudReqId = '', httpMethod = '', resourcePath = '', apiGatewayId = '', path = '';
            if (context) {
                cloudReqId = context.awsRequestId;
            }
            const eventContext = event.context;
            if (eventContext) {
                httpMethod = eventContext['http-method'];
                resourcePath = eventContext['resource-path'];
            }
            const proxyContext = event.requestContext;
            if (proxyContext) {
                httpMethod = proxyContext.httpMethod;
                resourcePath = proxyContext.resourcePath;
                apiGatewayId = proxyContext.requestId;
                path = proxyContext.path;
            }
            runTimeInfo = {
                httpMethod: httpMethod,
                resourcePath: resourcePath,
                path: path
            };
            const loggerConfig = {
                aId: apiGatewayId || undefined,
                message: '',
                logLevel: process.env.logLevel || (stageVariables && stageVariables.logLevel) || 'error',
                cId: (headers && headers.clientrequestid) || cloudReqId,
                identifier: event.identifier,
                method: httpMethod,
                pathParams: pathParams,
                op: (requestBody && (typeof (requestBody) !== 'string')) ? ((Object.keys(requestBody).length > 0) && requestBody.command) : undefined,
                orgType: (headers && headers['x-originator-type']) || undefined,
            };
            const transformedEvent = {
                requestBody: requestBody,
                pathParams: pathParams,
                headers: headers,
                queryString: this.typingQueryString(queryString),
                multiValueQueryString: event.multiValueQueryStringParameters,
                runTimeInfo: runTimeInfo,
                envVariables: process.env,
                stageVariables: stageVariables,
                logConfig: loggerConfig
            };
            const endTs = new Date().getTime();
            const diffTs = endTs - startTs;
            logger.info(`${LOG_PREFIX_FN} #EVENT_TRANSFORMATION_END#|ExecutionTime: ${diffTs} `);
            return transformedEvent;
        }
        catch (error) {
            logger.error(`${LOG_PREFIX_FN} Error: ${JSON.stringify(error)}`);
            throw new AWBErrors.BadRequest('Event tranformation error');
        }
    }

    private typingQueryString(queryString: object) {
        const entries = Object.entries(queryString);
        const formattedQueryString: any = {};
        entries.forEach((item: string[]) => {
            if (item[0] === 'limit' || item[0] === 'offset') {
                formattedQueryString[item[0]] = this.convertString(item[1]);
            }
            else {
                formattedQueryString[item[0]] = item[1];
            }

        })
        return formattedQueryString;
    }

    private convertString(item: string): string | number {
        if (this.isNumericFinite(item)) {
            return Number(item);
        }
        return item;
    }

    /**
     * Returns true if 'candidate' is a finite number or a string referring (not just 'including') a finite number
     *
     * @export
     * @param {unknown} candidate
     * @returns {boolean}
     */
    private isNumericFinite(candidate: unknown): boolean {
        switch (typeof (candidate)) {
            case 'number':
                return Number.isFinite(candidate);
            case 'string':
                return (candidate.trim() !== '') && Number.isFinite(Number(candidate));
            default:
                return false;
        }
    }

    public buildResponseWithCorsHeaders(statusCode: number, responseBody: any, headers: any): IDataModels.LambdaProxyResponse {
        const serviceResponse = this.getLambdaProxyResponse(statusCode, responseBody);
        const corsHeaders = this.getCORSHeaders(headers);
        const lambdaProxyResponse = this.getLambdaProxyResponseWithHeaders(serviceResponse, corsHeaders);
        logger.info(LOG_PREFIX_CLASS, `Lambda proxy response with headers: ${JSON.stringify(lambdaProxyResponse)}`);
        return lambdaProxyResponse;
    }

    protected getLambdaProxyResponse(httpCode: number, responseBody: any) {
        const LOG_PREFIX_FN = LOG_PREFIX_CLASS + 'getLambdaProxyResponse|';
        logger.debug(`${LOG_PREFIX_FN} httpCode: ${httpCode}  : responseBody: ${responseBody}`);

       const lambdaProxyResponse = {
            statusCode: httpCode,
            body: JSON.stringify(responseBody),
        };

        logger.debug(`${LOG_PREFIX_FN} lambdaProxyResponse: ${JSON.stringify(lambdaProxyResponse)} `);
        return lambdaProxyResponse;
    }

    public getLambdaProxyResponseWithHeaders(lambdaProxyResponse: any, headers: any) {
        const LOG_PREFIX_FN = LOG_PREFIX_CLASS + 'getLambdaProxyResponseV1|';
        logger.debug(`${LOG_PREFIX_FN} lambdaProxyResponse: ${JSON.stringify(lambdaProxyResponse)} `);
        if (headers) {
            lambdaProxyResponse.headers = headers;
        } else {
            logger.debug(`${LOG_PREFIX_FN} response header not present`);
        }
        logger.debug(`${LOG_PREFIX_FN} lambdaProxyResponseWithHeaders: ${JSON.stringify(lambdaProxyResponse)} `);
        return lambdaProxyResponse;
    }

    public getCORSHeaders(headers: any) {
        const LOG_PREFIX_FN = LOG_PREFIX_CLASS + 'getCORSHeader|';
        logger.silly(`${LOG_PREFIX_FN} #START# headers: ${JSON.stringify(headers)} `);
        let corsHeaders;
        const origin = headers && (headers.origin || headers.Origin) || '';
        if (origin) {
            corsHeaders = { 'access-control-allow-origin': origin };
        }
        else {
            logger.silly(`${LOG_PREFIX_FN} origin header not present in request `);
        }
        logger.silly(`${LOG_PREFIX_FN} #END# corsHeaders: ${JSON.stringify(corsHeaders)} `);
        return corsHeaders;
    }

}