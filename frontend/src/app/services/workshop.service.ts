import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { Workshop } from "../model/Workshop";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";


@Injectable({
    providedIn: 'root'
})
export class WorkshopService {
    constructor(private http: HttpClient) { }

    getWorkshops(speakerId?: string, workshopId?: string): Observable<Workshop[]> {
        const params: any = {};
        if (speakerId) {
            params['speakerId'] = speakerId;
        }
        if (workshopId) {
            params['workshopId'] = workshopId;
        }


        return this.http.get(`${environment.backendHost}/v1/workshops`,
            {
                headers: {
                    'x-api-key': environment.backendApiKey
                },
                params: params
            }
        ) as Observable<Workshop[]>;
    }

    postWorkshop(workshop: Workshop): Observable<Workshop> {
        delete workshop.speakerId;
        delete workshop.workshopId;
        return this.http.post(`${environment.backendHost}/v1/workshops`,
            workshop,
            {
                headers: {
                    'x-api-key': environment.backendApiKey
                }
            }
        ) as Observable<Workshop>;
    }

    updateWorkshop(workshop: Workshop): Observable<Workshop> {
        const patchWorkshop = {
            workshopName: workshop.workshopName,
            speakerName: workshop.speakerName,
            workshopObjectives: workshop.workshopObjectives
        }
        return this.http.patch(`${environment.backendHost}/v1/speakers/`+workshop.speakerId+'/workshops/'+workshop.workshopId,
            patchWorkshop,
            {
                headers: {
                    'x-api-key': environment.backendApiKey
                }
            }
        ) as Observable<Workshop>;
    }


    deleteWorkshop(speakerId: string, workshopId: string): Observable<Workshop> {
        return this.http.delete(`${environment.backendHost}/v1/speakers/`+speakerId+'/workshops/'+workshopId,
            {
                headers: {
                    'x-api-key': environment.backendApiKey
                }
            }
        ) as Observable<Workshop>;
    }

}