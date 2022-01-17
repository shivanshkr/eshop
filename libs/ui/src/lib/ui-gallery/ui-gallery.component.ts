import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ui-gallery',
  templateUrl: './ui-gallery.component.html',
  styles: [],
})
export class UiGalleryComponent implements OnInit {
  @Input() images: any = [];
  selectedImage = '';

  ngOnInit(): void {
    if (this.hasImages) {
      this.selectedImage = this.images[0];
    }
  }

  get hasImages() {
    return this.images?.length > 0;
  }
}
