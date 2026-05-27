import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TemplateService } from '../../../service/template.service';

@Component({
  selector: 'app-helm-version-select',
  templateUrl: './helm-version-select.component.html',
  styleUrls: ['./helm-version-select.component.scss']
})
export class HelmVersionSelectComponent implements OnInit {
  // Nhận version hiện tại từ cha (phục vụ cho việc phục hồi từ Draft/Cache)
  @Input() selectedVersion!: string;
  @Output() selectedVersionChange = new EventEmitter<string>();
  
  // Bắn schema và danh sách versions tìm được lên cho cha xử lý tiếp
  @Output() schemaLoaded = new EventEmitter<any[]>();
  @Output() versionsLoaded = new EventEmitter<string[]>();

  helmVersions: string[] = [];

  constructor(private templateService: TemplateService) {}

  ngOnInit(): void {
    this.loadHelmVersions();
  }

  loadHelmVersions(): void {
    this.templateService.getVersions().subscribe({
      next: (data) => {
        this.helmVersions = data;
        this.versionsLoaded.emit(data);

        if (data.length > 0) {
          // Nếu chưa có version nào được chọn (không có draft cache), lấy cái đầu tiên
          if (!this.selectedVersion) {
            this.selectedVersion = data[0];
            this.selectedVersionChange.emit(this.selectedVersion);
          }
          this.onVersionChange();
        }
      },
      error: (err) => console.error('Load versions failed', err)
    });
  }

  onVersionChange(): void {
    this.selectedVersionChange.emit(this.selectedVersion);
    
    this.templateService.getTemplate(this.selectedVersion).subscribe({
      next: (data) => {
        const schema = JSON.parse(data);
        this.schemaLoaded.emit(schema);
      },
      error: (err) => console.error('Load template schema failed', err)
    });
  }
}