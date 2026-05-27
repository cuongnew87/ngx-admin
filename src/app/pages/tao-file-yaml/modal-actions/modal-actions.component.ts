import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-actions',
  templateUrl: './modal-actions.component.html',
  styleUrls: ['./modal-actions.component.scss']
})
export class ModalActionsComponent {
  // Trạng thái nút hiển thị/ẩn "Gợi ý tạo nhanh" truyền từ Modal cha sang
  @Input() showQuickGenerate: boolean = false;
  @Output() showQuickGenerateChange = new EventEmitter<boolean>();

  // Các sự kiện trigger xử lý logic ở Modal cha
  @Output() addFile = new EventEmitter<void>();
  @Output() exportYaml = new EventEmitter<void>();
  @Output() resetForm = new EventEmitter<void>();

  toggleQuickGenerate(): void {
    this.showQuickGenerate = !this.showQuickGenerate;
    this.showQuickGenerateChange.emit(this.showQuickGenerate);
  }

  onAddFileClick(): void {
    this.addFile.emit();
  }

  onExportYamlClick(): void {
    this.exportYaml.emit();
  }

  onResetFormClick(): void {
    this.resetForm.emit();
  }
}