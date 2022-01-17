import { Component } from '@angular/core';
import { AuthService } from '@bluebits/users';

@Component({
  selector: 'admin-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(private AuthService: AuthService) {}

  // ngOnInit(): void {}
  logoutUser() {
    this.AuthService.logout();
  }
}
