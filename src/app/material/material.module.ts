import { NgModule } from '@angular/core';
import { MatDialogModule, MatCardModule, MatButtonModule,
  MatToolbarModule, MatInputModule, MatFormFieldModule,
  MatSnackBarModule } from '@angular/material';

const modules = [MatDialogModule, MatCardModule, MatButtonModule, MatToolbarModule,
  MatInputModule, MatFormFieldModule, MatSnackBarModule];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
