import { NgModule } from '@angular/core';
import { MatDialogModule, MatCardModule, MatButtonModule,
  MatToolbarModule, MatInputModule, MatFormFieldModule,
  MatSnackBarModule, MatChipsModule, MatTooltipModule,
  MatIconModule } from '@angular/material';

const modules = [MatDialogModule, MatCardModule, MatButtonModule, MatToolbarModule,
  MatInputModule, MatFormFieldModule, MatSnackBarModule, MatChipsModule, MatTooltipModule,
  MatIconModule];

@NgModule({
  imports: modules,
  exports: modules
})
export class MaterialModule { }
