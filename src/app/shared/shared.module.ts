import { NgModule } from '@angular/core';

import { AlertComponent } from './components/alert/alert.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyAutocompleteModule as MatAutocompleteModule } from '@angular/material/legacy-autocomplete';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusDirective } from './directives/focuslastelement.directive';
import { Page404Component } from './components/page404/page404.component';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    DynamicFormComponent,
    FocusDirective,
    Page404Component,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatButtonModule,
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
    MatMenuModule,
    MatAutocompleteModule,
    MatButtonModule,
    Page404Component,
  ]
})
export class SharedModule { }
