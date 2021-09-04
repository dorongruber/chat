import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DynamicFormComponent
  ],
  imports: [
    CommonModule,
    MatIconModule,
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    DynamicFormComponent,
    MatIconModule
  ]
})
export class SharedModule { }
