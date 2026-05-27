import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbWindowRef } from '@nebular/theme';
import { TemplateService } from '../../../service/template.service';
import { ConfirmPopupComponent } from '../confirm-popup/confirm-popup.component';
import { normalizeName, parseDockerImage } from '../../../shared/utils/yaml-generator.util';

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
  showQuickGenerate = false;

  private readonly CACHE_KEY = 'yaml-generator-draft';

  constructor(
    public windowRef: NbWindowRef,
    private templateService: TemplateService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.loadHelmVersions();
    this.loadDraft();
  }

  loadHelmVersions(): void {
    this.templateService.getVersions().subscribe({
      next: (data) => {
        this.helmVersions = data;
        if (data.length > 0) {
          if (!this.selectedVersion) {
            this.selectedVersion = data[0];
          }
          this.onVersionChange();
          if (this.yamlFiles.length === 0) {
            this.addFile();
          }
        }
      },
      error: (err) => console.error(err)
    });
  }

  onVersionChange(): void {
    this.templateService.getTemplate(this.selectedVersion).subscribe({
      next: (data) => {
        this.templateSchema = JSON.parse(data);
        this.syncSelectedResources();
        setTimeout(() => {
          this.yamlFiles.forEach(file => {
            file.selectedResources = [...file.selectedResources];
          });
        });
      },
      error: (err) => console.error(err)
    });
  }

  addFile(): void {
    this.yamlFiles.push({
      fileName: `values-${this.yamlFiles.length + 1}`,
      selectedResources: [],
      formData: {}
    });
    this.initializeFileData(this.yamlFiles[this.yamlFiles.length - 1]);
    this.selectedTabIndex = this.yamlFiles.length - 1;
    this.saveDraft();
  }

  initializeFileData(file: any): void {
    if (file.formData && Object.keys(file.formData).length > 0) {
      return;
    }
    file.formData = {};

    this.templateSchema.forEach(resource => {
      resource.properties.forEach((prop: any) => {
        switch (prop.type) {
          case 'number':
            if (prop.unit?.length) {
              file.formData[prop.name + '_value'] = prop.defaultValue || '';
              file.formData[prop.name + '_unit'] = prop.defaultValueUnit || '';
              file.formData[prop.name] = `${prop.defaultValue || ''}${prop.defaultValueUnit || ''}`;
            } else {
              file.formData[prop.name] = Number(prop.defaultValue || 0);
            }
            break;
          case 'boolean':
            file.formData[prop.name] = prop.defaultValue ?? false;
            break;
          case 'array-object':
            file.formData[prop.name] = [];
            break;
          default:
            file.formData[prop.name] = prop.defaultValue || '';
        }
      });
    });
  }

  syncSelectedResources(): void {
    const validResources = this.templateSchema.map((r: any) => r.resource);
    this.yamlFiles.forEach(file => {
      file.selectedResources = [...new Set(
        (file.selectedResources || []).filter((r: string) => validResources.includes(r))
      )];
    });
  }

  saveDraft(): void {
    const draft = {
      selectedVersion: this.selectedVersion,
      yamlFiles: this.yamlFiles
    };
    localStorage.setItem(this.CACHE_KEY, JSON.stringify(draft));
  }

  loadDraft(): void {
    const cache = localStorage.getItem(this.CACHE_KEY);
    if (!cache) return;
    try {
      const draft = JSON.parse(cache);
      this.selectedVersion = draft.selectedVersion;
      this.yamlFiles = draft.yamlFiles || [];
      if (this.selectedVersion) {
        this.onVersionChange();
      }
    } catch (e) {
      console.error('Load draft failed', e);
    }
  }

  clearDraft(): void {
    localStorage.removeItem(this.CACHE_KEY);
  }

  resetForm(): void {
    this.dialogService.open(ConfirmPopupComponent).onClose.subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.clearDraft();
      this.selectedTabIndex = 0;
      this.yamlFiles = [];
      if (this.helmVersions.length > 0) {
        this.selectedVersion = this.helmVersions[0];
        this.onVersionChange();
      }
    });
  }

  exportYaml(): void {
    const request = this.yamlFiles.map(file => ({
      serviceName: file.fileName,
      content: this.buildNestedObject(file.formData, file.selectedResources)
    }));

    this.templateService.generateYaml(request).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'values.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      }
    });
  }

  buildNestedObject(formData: any, selectedResources: string[]): any {
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
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
        return;
      }

      if (key.startsWith('extraEnvFrom.')) {
        const refType = key.split('.')[1];
        if (!result.extraEnvFrom) result.extraEnvFrom = [];
        result.extraEnvFrom.push({ [refType]: { name: value } });
        return;
      }

      const keys = key.split('.');
      let current = result;
      keys.forEach((part, index) => {
        if (index === keys.length - 1) {
          current[part] = value;
        } else {
          if (!current[part]) current[part] = {};
          current = current[part];
        }
      });
    });

    return result;
  }

  generateMultipleFiles(payload: any): void {
    const appName = payload.appName;
    const services = payload.services;
    this.yamlFiles = [];
    const allResources = this.templateSchema.map((r: any) => r.resource);

    for (const service of services) {
      const serviceName = normalizeName(service.name);
      if (!serviceName) continue;

      const imageInfo = parseDockerImage(service.image);
      const file: any = {
        fileName: serviceName,
        selectedResources: [...allResources],
        formData: {}
      };

      this.initializeFileData(file);
      file.formData['route.enabled'] = true;
      file.formData['route.path'] = `/${serviceName}`;
      file.formData['route.host'] = `${appName}.apps.ocpprepro.ldapudtest.com`;
      file.formData['ingress.enabled'] = true;
      file.formData['ingress.path'] = `/${serviceName}`;
      file.formData['ingress.host'] = `${appName}.apps.ocpprepro.ldapudtest.com`;
      file.formData['image.repository'] = imageInfo.repository;
      file.formData['image.tag'] = imageInfo.tag;
      file.formData['image.secrets'] = [{ name: 'nexus-registry-secret' }];
      file.formData['name'] = serviceName;

      this.yamlFiles.push(file);
    }

    this.selectedTabIndex = 0;
    this.showQuickGenerate = false;
    this.saveDraft();
  }

  close(): void {
    this.windowRef.close();
  }
}