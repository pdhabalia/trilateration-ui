import { Component, OnInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar, MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { AuthenticationService } from '../../service/authentication.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatMenuModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit{
  // Show navigation only when user is authenticated
  showIcon = computed(() => {
    const user = this.authService.user();
    return user !== null && this.authService.isAuthenticated();
  });

  // Get current user information
  currentUser = computed(() => this.authService.user());
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  ngOnInit () {
    // No need to set showIcon here anymore - it's reactive
  }
  async logout() {
    try {
      await this.authService.logout();
      // The showIcon computed signal will automatically update when user signal changes
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout even if server call fails
      this.authService.clearUserData();
      this.router.navigate(['/login']);
    }
  }

  navigateToLocation() {
    this.router.navigate(['/location']);
  }

  navigateToHistory() {
    this.router.navigate(['/history']);
  }
}
