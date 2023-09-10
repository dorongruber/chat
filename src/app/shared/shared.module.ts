import { NgModule } from '@angular/core';

import { AlertComponent } from './components/alert/alert.component';
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';


import { MatIconModule } from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule} from '@angular/material/button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FocusDirective } from './directives/focuslastelement.directive';
import { Page404Component } from './components/page404/page404.component';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
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
