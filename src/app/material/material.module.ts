import { NgModule } from '@angular/core';
import { MatButtonModule, MatToolbarModule, MatInputModule, MatFormFieldModule, MatSnackBarModule } from '@angular/material';

const modules = [MatButtonModule, MatToolbarModule, MatInputModule, MatFormFieldModule, MatSnackBarModule];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
