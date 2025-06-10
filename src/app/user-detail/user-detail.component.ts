import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { doc, Firestore, docData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.class';
import { MatDialog } from '@angular/material/dialog';
import { EditUserDialogComponent } from './edit-user-dialog/edit-user-dialog.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatMenuModule,
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  firestore = inject(Firestore);

  userId!: string | null;
  userSubscription?: Subscription;
  user: User = new User();

  position = 'left';

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id');
      if (this.userId) {
        this.getUser();
      }
    });
  }

  getUser() {
    if (!this.userId) return;

    const userDocRef = doc(this.firestore, 'users', this.userId);
    const user$ = docData(userDocRef, { idField: 'id' });

    this.userSubscription = user$.subscribe({
      next: (user) => {
        this.user = new User(user);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }

  openEditUser() {
    const userId = this.route.snapshot.paramMap.get('id');
    if (userId && this.user) {
      const userCopy = JSON.parse(JSON.stringify(this.user));
      this.dialog.open(EditUserDialogComponent, {
        data: {
          userId: userId,
          user: userCopy,
        },
      });
    }
  }
}
