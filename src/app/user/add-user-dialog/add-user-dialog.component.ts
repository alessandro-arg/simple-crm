import { Component, inject } from '@angular/core';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { User } from '../../../models/user.class';
import { FormsModule } from '@angular/forms';
import {
  Firestore,
  collectionData,
  collection,
  addDoc,
} from '@angular/fire/firestore';

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
  ],
  templateUrl: './add-user-dialog.component.html',
  styleUrl: './add-user-dialog.component.scss',
})
export class AddUserDialogComponent {
  firestore = inject(Firestore);
  user = new User();
  birthDate!: Date;

  constructor(public dialogRef: MatDialogRef<AddUserDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  async saveUser() {
    this.user.birthDate = this.birthDate.getTime();
    console.log('Current user is ', this.user);

    try {
      const usersRef = collection(this.firestore, 'users');
      const result = await addDoc(usersRef, this.user.toJSON());
      console.log('User added with ID:', result.id);
    } catch (err) {
      console.error('Error adding user:', err);
    }
  }
}
