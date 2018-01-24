import { Routes } from '@angular/router';

import { ConceptMapComponent } from './conceptmap/conceptmap.component';

export const EditorsRoutes: Routes = [
    {
      path: '',
      children: [ {
        path: 'conceptmap',
        component: ConceptMapComponent
      }]
    }
];
