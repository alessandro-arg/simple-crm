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
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
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
    CommonModule,
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit {
  firestore = inject(Firestore);
  birthDate!: Date;
  loading = false;

  userId!: string | null;
  userSubscription?: Subscription;
  user: User = new User();

  constructor(
    public dialogRef: MatDialogRef<EditUserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { userId: string }
  ) {
    this.userId = data.userId;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    if (this.userId) {
      this.getUser();
    }
  }

  getUser() {
    if (!this.userId) return;
    this.loading = true;
    const userDocRef = doc(this.firestore, 'users', this.userId);
    this.userSubscription = docData(userDocRef, { idField: 'id' }).subscribe({
      next: (userData) => {
        if (userData) {
          this.user = new User(userData);
          this.birthDate = new Date(this.user.birthDate);
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching user:', error);
        this.loading = false;
      },
    });
  }

  async saveUser(form: NgForm) {
    if (form.invalid || !this.userId) {
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
      this.dialogRef.close(this.user);
    } catch (error) {
      console.error('Error updating user:', error);
    } finally {
      this.loading = false;
    }
  }
}
