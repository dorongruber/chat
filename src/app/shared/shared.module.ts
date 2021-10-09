import { NgModule } from '@angular/core';

import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusDirective } from './directives/focuslastelement.directive';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DynamicFormComponent,
    FocusDirective,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    DynamicFormComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    FocusDirective,
  ]
})
export class SharedModule { }
