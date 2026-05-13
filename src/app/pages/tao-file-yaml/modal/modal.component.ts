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

  templateSchema: any[] = [];

  formData: any = {};

  fileName = 'values';

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
            this.onVersionChange();
          }
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  onVersionChange(): void {

    this.templateService
      .getTemplate(this.selectedVersion)
      .subscribe({

        next: (data) => {

          this.templateSchema = JSON.parse(data);

          this.initializeFormData();
        },

        error: (err) => {
          console.error(err);
        }
      });
  }

  initializeFormData(): void {

    this.formData = {};

    this.templateSchema.forEach(resource => {

      resource.properties.forEach((prop: any) => {

        if (prop.defaultValue !== undefined) {

          this.formData[prop.name] =
            prop.defaultValue;

        } else {

          switch (prop.type) {

            case 'number':
              this.formData[prop.name] = 0;
              break;

            case 'boolean':
              this.formData[prop.name] = false;
              break;

            default:
              this.formData[prop.name] = '';
          }
        }
      });
    });
  }

   exportYaml(): void {

    const request = [
      {
        serviceName: this.fileName,
        content: this.buildNestedObject(),
      }
    ];

    this.templateService
      .generateYaml(request)
      .subscribe({

        next: (blob) => {

          const url =
            window.URL.createObjectURL(blob);

          const a =
            document.createElement('a');

          a.href = url;

          a.download = 'values.zip';

          a.click();

          window.URL.revokeObjectURL(url);
        }
      });
  }

  buildNestedObject(): any {

    const result: any = {};

    Object.keys(this.formData)
      .forEach(key => {

        const keys = key.split('.');

        let current = result;

        keys.forEach((part, index) => {

          if (index === keys.length - 1) {

            current[part] =
              this.formData[key];

          } else {

            if (!current[part]) {

              current[part] = {};
            }

            current = current[part];
          }
        });
      });

    return result;
  }

  close() {
    this.windowRef.close();
  }
}
