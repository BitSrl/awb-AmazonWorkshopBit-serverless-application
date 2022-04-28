import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { WorkshopService } from 'src/app/services/workshop.service';
import { Workshop, WorkshopObjective } from '../../model/Workshop';

@Component({
  selector: 'app-workshop',
  templateUrl: './workshop.component.html',
  styleUrls: ['./workshop.component.css']
})
export class WorkshopComponent implements OnInit {

  public loading: boolean = false;

  private editingWorkshop: boolean = false;
  private editingWorkshopId: string = '';
  private editingSpeakerId: string = '';

  public workshops: Workshop[] = [];

  constructor(private fb: FormBuilder, private workshopService: WorkshopService) { }

  /** FORM HANDLING - START */

  public workshopForm = this.fb.group({
    workshopName: ['', Validators.required],
    speakerName: ['', Validators.required],
    workshopObjectives: this.fb.array([
      this.fb.group({
        objectiveName: ['', Validators.required],
        objectiveType: ['', Validators.required]
      })
    ])
  });

  public get workshopObjectives() {
    return this.workshopForm.get('workshopObjectives') as FormArray;
  }

  public addWorkshopObjective() {
    this.workshopObjectives.push(this.fb.group({
      objectiveName: ['', Validators.required],
      objectiveType: ['', Validators.required]
    }));
  }

  public onSubmitWorkshop() {
    // TODO: Use EventEmitter with form value
    const workshop: Workshop = {
      workshopName: this.workshopForm.get('workshopName')!.value,
      speakerName: this.workshopForm.get('speakerName')!.value,
      workshopObjectives: this.workshopForm.get('workshopObjectives')!.value.map(
        (workshopObjective: WorkshopObjective) => {
          return {
            objectiveName: workshopObjective.objectiveName,
            objectiveType: workshopObjective.objectiveType
          };
        }
      )
    }

    this.loading = true;
    if (!this.editingWorkshop) {
      this.workshopService.postWorkshop(workshop).subscribe(
        result => {
          this.workshops.push({
            workshopId: result.workshopId,
            speakerId: result.speakerId,
            workshopName: workshop.workshopName,
            speakerName: workshop.speakerName,
            workshopObjectives: workshop.workshopObjectives
          });
          this.loading = false;
        }
      );
    } else {
      workshop.speakerId = this.editingSpeakerId;
      workshop.workshopId = this.editingWorkshopId;
      this.workshopService.updateWorkshop(workshop).subscribe(
        result => {
          this.workshops.map(w => {
            if (w.workshopId === this.editingWorkshopId) {
              w.workshopName = workshop.workshopName;
              w.speakerName = workshop.speakerName;
              w.workshopObjectives = workshop.workshopObjectives;
            }
          });
          this.editingSpeakerId = '';
          this.editingWorkshopId = '';

          this.loading = false;
        }
      );
    }

    this.workshopForm.reset();
  }

  /** FORM HANDLING - END */

  ngOnInit(): void {
    this.loading = true;
    this.workshopService.getWorkshops().subscribe(
      result => {
        this.workshops = result;
        this.loading = false;
      }
    );

  }

  public deleteWorkshop(workshopId: string, speakerId: string) {
    this.loading = true;
    this.workshopService.deleteWorkshop(speakerId, workshopId).subscribe(
      result => {
        this.workshops = this.workshops.filter(workshop => workshop.workshopId !== workshopId);
        this.loading = false;
      }
    );
  }

  public updateWorkshop(workshop: Workshop) {
    this.workshopForm.patchValue({
      workshopName: workshop.workshopName,
      speakerName: workshop.speakerName,
      workshopObjectives: workshop.workshopObjectives
    });
    this.editingWorkshop = true;
    this.editingWorkshopId = workshop.workshopId ?? '';
    this.editingSpeakerId = workshop.speakerId ?? '';
  }

}
