import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../../../models/user.class';
import { FormsModule, NgForm } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-add-user-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatButtonModule,
    MatDialogActions,
    MatDialogTitle,
    MatDialogContent,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    FormsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss',
})
export class AddUserDialogComponent {
  firestore = inject(Firestore);
  user = new User();
  birthDate!: Date;
  loading = false;

  constructor(
    public dialogRef: MatDialogRef<AddUserDialogComponent>,
    private snackBar: MatSnackBar
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveUser(form: NgForm) {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.user.birthDate = this.birthDate.getTime();
    console.log('Current user is ', this.user);
    this.loading = true;

    try {
      const usersRef = collection(this.firestore, 'users');
      const result = await addDoc(usersRef, this.user.toJSON());
    } catch (err) {
      console.error('Error adding user:', err);
      this.snackBar.open('Failed to create user.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'bottom',
      });
    } finally {
      this.snackBar.open('User created successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        verticalPosition: 'bottom',
      });
      this.loading = false;
      this.dialogRef.close();
    }
  }
}
