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

  yamlFiles: any[] = [];

  constructor(
    public windowRef: NbWindowRef,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {

    this.loadHelmVersions();

    this.addFile();
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

          this.initializeAllFiles();

        },

        error: (err) => {

          console.error(err);

        }
      });
  }

  addFile(): void {

    this.yamlFiles.push({

      fileName: `values-${this.yamlFiles.length + 1}`,

      selectedResources: [],

      formData: {}

    });

    this.initializeFileData(
      this.yamlFiles[this.yamlFiles.length - 1]
    );
  }

  removeFile(index: number): void {

    this.yamlFiles.splice(index, 1);

  }

  initializeAllFiles(): void {

    this.yamlFiles.forEach(file => {

      this.initializeFileData(file);

    });
  }

  initializeFileData(file: any): void {

    file.formData = {};

    this.templateSchema.forEach(resource => {

      resource.properties.forEach((prop: any) => {

        if (prop.defaultValue !== undefined) {

          file.formData[prop.name] =
            prop.defaultValue;

        } else {

          switch (prop.type) {

            case 'number':

              file.formData[prop.name] = 0;

              break;

            case 'boolean':

              file.formData[prop.name] = false;

              break;

            default:

              file.formData[prop.name] = '';
          }
        }
      });
    });
  }

  exportYaml(): void {

    const request = this.yamlFiles.map(file => ({

      serviceName: file.fileName,

      content: this.buildNestedObject(
        file.formData,
        file.selectedResources
      )

    }));

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

  buildNestedObject(
    formData: any,
    selectedResources: string[]
  ): any {

    const result: any = {};

    const selectedProperties: string[] = [];

    this.templateSchema.forEach(resource => {

      if (selectedResources.includes(resource.resource)) {

        resource.properties.forEach((prop: any) => {

          selectedProperties.push(prop.name);

        });
      }
    });

    selectedProperties.forEach(key => {

      const value = formData[key];

      if (
        value === null ||
        value === undefined ||
        (typeof value === 'string' && value.trim() === '')
      ) {
        return;
      }

      const keys = key.split('.');

      let current = result;

      keys.forEach((part, index) => {

        if (index === keys.length - 1) {

          current[part] = value;

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

  close(): void {

    this.windowRef.close();

  }
}