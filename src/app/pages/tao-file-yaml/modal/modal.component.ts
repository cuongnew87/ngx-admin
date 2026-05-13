import { Component, OnInit } from '@angular/core';
import { NbWindowRef } from '@nebular/theme';
import { TemplateService } from '../../../service/template.service';

@Component({
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {

  helmVersions: string[] = [];

  selectedVersion!: string;

  constructor(
    public windowRef: NbWindowRef, 
    private templateService: TemplateService
  ) {}

  ngOnInit() {
    this.loadHelmVersions();
  }

  loadHelmVersions(): void {

    this.templateService
      .getVersions()
      .subscribe({

        next: (data) => {

          this.helmVersions = data;

          if (data.length > 0) {
            this.selectedVersion = data[0];
          }
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  close() {
    this.windowRef.close();
  }
}
