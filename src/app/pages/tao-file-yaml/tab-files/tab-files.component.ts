import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'ngx-tab-files',
  templateUrl: './tab-files.component.html',
  styleUrls: ['./tab-files.component.scss']
})
export class TabFilesComponent {
  @Input() templateSchema: any[] = [];
  @Input() yamlFiles: any[] = [];
  @Input() selectedTabIndex: number = 0;

  @Output() yamlFilesChange = new EventEmitter<any[]>();
  @Output() selectedTabIndexChange = new EventEmitter<number>();
  @Output() formChanged = new EventEmitter<void>();

  // --- FILE MANAGEMENT ---

  removeFile(index: number): void {
    this.yamlFiles.splice(index, 1);
    if (this.selectedTabIndex >= this.yamlFiles.length) {
      this.selectedTabIndex = this.yamlFiles.length - 1;
    }
    this.notifyChanges();
  }

  duplicateFile(index: number): void {
    const sourceFile = this.yamlFiles[index];
    const clonedFile = JSON.parse(JSON.stringify(sourceFile));
    clonedFile.fileName = clonedFile.fileName + '-copy';

    this.yamlFiles.splice(index + 1, 0, clonedFile);
    this.selectedTabIndex = index + 1;
    this.notifyChanges();
  }

  onDuplicateClick(event: Event, index: number): void {
    event.preventDefault();
    event.stopPropagation();
    (event.currentTarget as HTMLElement)?.blur();
    this.duplicateFile(index);
  }

  onResourcesChange(file: any, resources: string[]): void {
    file.selectedResources = [...new Set(resources)];
    this.saveDraft();
  }

  // --- UNIT AND NUMBERS ---

  onUnitValueChange(file: any, prop: any): void {
    const value = file.formData[prop.name + '_value'];
    const unit = file.formData[prop.name + '_unit'] || '';

    if (value === null || value === undefined || value === '') {
      file.formData[prop.name] = '';
    } else {
      file.formData[prop.name] = `${value}${unit}`;
    }
    this.saveDraft();
  }

  clearUnit(file: any, prop: any, event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    file.formData[prop.name + '_unit'] = '';
    this.onUnitValueChange(file, prop);
  }

  // --- ARRAY OBJECT HANDLING ---

  addArrayObjectItem(file: any, prop: any, properties: any[]): void {
    if (!file.formData[prop.name]) {
      file.formData[prop.name] = [];
    }

    const item: any = {};
    this.getArrayObjectChildren(prop, properties).forEach((childProp: any) => {
      const fieldName = this.getArrayObjectFieldName(prop, childProp);
      item[fieldName] = childProp.defaultValue || '';
    });

    file.formData[prop.name].push(item);
    this.saveDraft();
  }

  removeArrayObjectItem(file: any, propName: string, index: number): void {
    file.formData[propName].splice(index, 1);
    this.saveDraft();
  }

  isChildOfArrayObject(prop: any, properties: any[]): boolean {
    return properties.some((p: any) => {
      return p.type === 'array-object' && prop.name.startsWith(p.name + '.');
    });
  }

  getArrayObjectChildren(prop: any, properties: any[]): any[] {
    return properties.filter((p: any) => {
      return p.name.startsWith(prop.name + '.') && p.name !== prop.name;
    });
  }

  getArrayObjectFieldName(parentProp: any, childProp: any): string {
    return childProp.name.replace(parentProp.name + '.', '');
  }

  // --- HELPERS & EMITTERS ---

  saveDraft(): void {
    this.formChanged.emit();
  }

  private notifyChanges(): void {
    this.yamlFilesChange.emit(this.yamlFiles);
    this.selectedTabIndexChange.emit(this.selectedTabIndex);
    this.saveDraft();
  }
}