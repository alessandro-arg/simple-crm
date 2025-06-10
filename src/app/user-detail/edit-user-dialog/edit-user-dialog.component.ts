import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
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
import { Firestore, doc, updateDoc } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-edit-user-dialog',
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
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit {
  firestore = inject(Firestore);
  loading = false;

  userId!: string | null;
  userSubscription?: Subscription;
  user!: User;
  originalUser!: User;
  birthDate!: Date;

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string; user: any }
  ) {
    this.userId = data.userId;
    this.originalUser = new User(data.user);
    this.user = new User(data.user);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.user && this.user.birthDate) {
      this.birthDate = new Date(this.user.birthDate);
    }
  }

  async saveUser(form: NgForm) {
    if (form.invalid || !this.userId) return;

    if (!this.hasUserChanged()) {
      this.dialogRef.close();
      return;
    }

    this.loading = true;

    try {
      const birthDateTimestamp = this.birthDate.getTime();

      const userDocRef = doc(this.firestore, 'users', this.userId);
      await updateDoc(userDocRef, {
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        birthDate: birthDateTimestamp,
        street: this.user.street,
        zipCode: this.user.zipCode,
        city: this.user.city,
      });
      this.snackBar.open('User updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-success'],
        verticalPosition: 'bottom',
      });
      this.dialogRef.close(this.user);
    } catch (error) {
      console.error('Error updating user:', error);
      this.snackBar.open('Failed to update the user.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
        verticalPosition: 'bottom',
      });
    } finally {
      this.loading = false;
    }
  }

  hasUserChanged(): boolean {
    const fields: (keyof User)[] = [
      'firstName',
      'lastName',
      'email',
      'street',
      'zipCode',
      'city',
    ];

    for (const field of fields) {
      if (this.user[field] !== this.originalUser[field]) {
        return true;
      }
    }

    return (
      this.birthDate.getTime() !==
      new Date(this.originalUser.birthDate).getTime()
    );
  }
}
