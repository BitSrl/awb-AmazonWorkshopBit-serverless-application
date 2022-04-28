export interface Workshop {
    workshopId?: string;
    speakerId?: string;
    workshopName: string;
    speakerName: string;
    workshopObjectives: WorkshopObjective[];
}

export interface WorkshopObjective {
    objectiveName: string;
    objectiveType: keyof typeof ObjectiveType;
}

export enum ObjectiveType {
    VERY_IMPORTANT,
    IMPORTANT,
    LESS_IMPORTNAT
}