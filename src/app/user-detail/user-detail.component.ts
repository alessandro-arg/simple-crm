import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ActivatedRoute } from '@angular/router';
import { doc, Firestore, docData } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { User } from '../../models/user.class';

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
  ],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent implements OnInit {
  firestore = inject(Firestore);

  userId!: string | null;
  userSubscription?: Subscription;
  user: User = new User();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      this.userId = paramMap.get('id');
      console.log('user ID is:', this.userId);
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
        console.log('User data:', this.user);
      },
      error: (error) => {
        console.error('Error fetching user:', error);
      },
    });
  }
}
