import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, UsersService } from '@bluebits/users';
import { MessageService, ConfirmationService } from 'primeng/api';
import * as countriesLib from 'i18n-iso-countries';

declare const require: any;

@Component({
  selector: 'admin-users-list',
  templateUrl: './users-list.component.html',
  styles: [],
})
export class UsersListComponent implements OnInit {
  users: User[] = [];
  constructor(
    private userService: UsersService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    this._getUsers();
  }

  getCountryName(country: string) {
    return countriesLib.getName(country, 'en', {
      select: 'official',
    });
  }
  private _getUsers() {
    this.userService.getUsers().subscribe((res) => {
      this.users = res;
    });
  }

  deleteUser(userId: string) {
    this.confirmationService.confirm({
      message: `Are you sure that you want to delete <b>${
        this.users.filter((user) => user.id == userId)[0].name
      }</b> User?`,
      header: 'Delete User',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userService.deleteUser(userId).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: `User ${
                this.users.filter((user) => user.id == userId)[0].name
              } is Deleted!`,
            });
            this._getUsers();
          },
          () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'User is not Deleted!',
            });
          }
        );
      },
    });
  }

  updateUser(userId: string) {
    this.router.navigateByUrl(`users/form/${userId}`);
  }
}
