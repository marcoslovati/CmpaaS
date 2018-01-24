import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatToolsPluginComponent } from './formattoolsplugin.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FormatToolsPluginComponent],
  exports: [FormatToolsPluginComponent]
})
export class FormatToolsPluginModule { }
