import { NgModule } from '@angular/core';
import { MatDialogModule, MatCardModule, MatButtonModule,
  MatToolbarModule, MatInputModule, MatFormFieldModule,
  MatSnackBarModule, MatChipsModule, MatTooltipModule } from '@angular/material';

const modules = [MatDialogModule, MatCardModule, MatButtonModule, MatToolbarModule,
  MatInputModule, MatFormFieldModule, MatSnackBarModule, MatChipsModule, MatTooltipModule];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
