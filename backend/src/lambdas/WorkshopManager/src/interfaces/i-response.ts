import { PathParams, WorkshopObjective } from './i-data-models';

export interface WorkshopResponse {
    workshopId: string;
    speakerId: string;
    workshopName: string;
    speakerName: string;
    workshopObjectives: WorkshopObjective[];
}

export interface MessageResponse {
    message: string;
}

export type WorkshopIdResponse = PathParams;