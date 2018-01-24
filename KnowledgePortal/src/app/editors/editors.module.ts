import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EditorsRoutes } from './editors.routing';

import { ConceptMapComponent } from './conceptmap/conceptmap.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EditorsRoutes),
    FormsModule
  ],
  declarations: [
      ConceptMapComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class EditorsModule {}
