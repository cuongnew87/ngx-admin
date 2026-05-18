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

  selectedTabIndex = 0;

  private readonly CACHE_KEY = 'yaml-generator-draft';

  constructor(
    public windowRef: NbWindowRef,
    private templateService: TemplateService
  ) {}

  ngOnInit(): void {

    this.loadHelmVersions();

    this.addFile();

    this.loadDraft();
  }

  loadHelmVersions(): void {

    this.templateService
      .getVersions()
      .subscribe({

        next: (data) => {

          this.helmVersions = data;

          if (data.length > 0) {

            if (!this.selectedVersion) {

              this.selectedVersion = data[0];

              this.onVersionChange();

            } else {

              this.onVersionChange();
            }

            if (this.yamlFiles.length === 0) {

              this.addFile();
            }
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

    this.selectedTabIndex = this.yamlFiles.length - 1;
  }

  removeFile(index: number): void {

    this.yamlFiles.splice(index, 1);

    if (this.selectedTabIndex >= this.yamlFiles.length) {
      this.selectedTabIndex =
        this.yamlFiles.length - 1;
    }

  }

  initializeAllFiles(): void {

    this.yamlFiles.forEach(file => {

      this.initializeFileData(file);

    });
  }

  initializeFileData(file: any): void {

    if (
      file.formData &&
      Object.keys(file.formData).length > 0
    ) {
      return;
    }

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

            case 'array-object':

              const childProp =
                resource.properties.find(
                  (p: any) =>
                    p.name.startsWith(prop.name + '.')
                );

              file.formData[prop.name] = [
                {
                  name:
                    childProp?.defaultValue || ''
                }
              ];

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

  saveDraft(): void {
    const draft = {

      selectedVersion: this.selectedVersion,

      yamlFiles: this.yamlFiles

    };

    localStorage.setItem(
      this.CACHE_KEY,
      JSON.stringify(draft)
    );
  }

  // xử lý logic load và clear cache từ localStorage
  loadDraft(): void {
    const cache =
      localStorage.getItem(this.CACHE_KEY);

    if (!cache) {
      return;
    }

    try {

      const draft = JSON.parse(cache);

      this.selectedVersion =
        draft.selectedVersion;

      this.yamlFiles =
        draft.yamlFiles || [];

      if (this.selectedVersion) {

        this.onVersionChange();
      }

    } catch (e) {

      console.error('Load draft failed', e);

    }
  }

  clearDraft(): void {
    localStorage.removeItem(
      this.CACHE_KEY
    );
  }

  // xử lý logic thêm/xóa item trong mảng (array object) của formData
  addArrayObjectItem(
    file: any,
    propName: string
  ): void {

    if (!file.formData[propName]) {

      file.formData[propName] = [];
    }

    file.formData[propName].push({
      name: ''
    });

    this.saveDraft();
  }

  removeArrayObjectItem(
    file: any,
    propName: string,
    index: number
  ): void {

    file.formData[propName].splice(index, 1);

    this.saveDraft();
  }

  isChildOfArrayObject(
    prop: any,
    properties: any[]
  ): boolean {

    return properties.some((p: any) => {

      return (
        p.type === 'array-object' &&
        prop.name.startsWith(p.name + '.')
      );
    });
  }

  // logic xử lý duplicate form
  duplicateFile(index: number): void {

    const sourceFile =
      this.yamlFiles[index];

    const clonedFile =
      JSON.parse(JSON.stringify(sourceFile));

    clonedFile.fileName =
      clonedFile.fileName + '-copy';

    this.yamlFiles.splice(
      index + 1,
      0,
      clonedFile
    );

    this.selectedTabIndex =
      index + 1;

    this.saveDraft();
  }

  onDuplicateClick(
    event: Event,
    index: number
  ): void {

    event.preventDefault();

    event.stopPropagation();

    (event.currentTarget as HTMLElement)?.blur();

    this.duplicateFile(index);
  }
}