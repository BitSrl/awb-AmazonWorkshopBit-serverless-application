export type requestType = 'CREATE_WORKSHOP' | 'RETRIEVE_WORKSHOPS' | 'UPDATE_WORKSHOP' | 'DELETE_WORKSHOP';

export interface InputParams {
    requestType: requestType;
    workshopRequest?: WorkshopCreateRequest | WorkshopUpdateRequest;
    queryString?: Options;
    pathParams?: PathParams;
}

export interface Options {
    workshopId?: string;
    speakerId?: string;
}

export interface PathParams {
    workshopId: string;
    speakerId: string;
}

export interface WorkshopCreateRequest {
    workshopName: string;
    speakerName: string;
    workshopObjectives: WorkshopObjective[];
}

export interface WorkshopUpdateRequest {
    workshopName?: string;
    speakerName?: string;
    workshopObjectives?: WorkshopObjective[];
}

export interface WorkshopObjective {
    objectiveName: string;
    objectiveType: keyof ObjectiveType;
}

export enum ObjectiveType {
    IMPORTANT,
    VERY_IMPORTANT,
    LESS_IMPORTANT,
}

export interface ConstantsModel {
    REQUEST_TYPE_MAPPING: RequestTypeMapping;
}

export interface RequestTypeMapping {
    [key: string]: string;
}

export interface TransformedInputEvent {
    requestBody?: any;
    pathParams?: any;
    headers?: any;
    queryString?: any;
    runTimeInfo?: any;
    envVariables?: any;
    stageVariables?: any;
    logConfig?: any;
}
export interface LambdaProxyResponse {
    statusCode: number;
    body?: string;
    headers?: any;
}