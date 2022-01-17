import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { BannerComponent } from './banner/banner.component';
import { SliderComponent } from './slider/slider.component';
import { ButtonModule } from 'primeng/button';
import { UiGalleryComponent } from './ui-gallery/ui-gallery.component';

export const usersRoutes: Route[] = [];

@NgModule({
  imports: [CommonModule, RouterModule, ButtonModule],
  declarations: [BannerComponent, SliderComponent, UiGalleryComponent],
  exports: [BannerComponent, SliderComponent, UiGalleryComponent],
})
export class UiModule {}
