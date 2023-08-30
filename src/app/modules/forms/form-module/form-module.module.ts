import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LightboxModule } from 'ngx-lightbox';
import { QuillModule } from 'ngx-quill';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    QuillModule,
    LightboxModule
  ],
  exports: [
    QuillModule,
    LightboxModule
  ]
})
export class FormModuleModule { }
