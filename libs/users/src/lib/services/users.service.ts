/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../Models/user';
import { environment } from '@env/environment';
import * as countriesLib from 'i18n-iso-countries';
import { UsersFacade } from '../state/users.facade';

declare const require: any;
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  apiURlUsers = environment.apiURl + 'users';

  constructor(private http: HttpClient, private usersFacade: UsersFacade) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiURlUsers);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiURlUsers, user);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiURlUsers}/${userId}`);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiURlUsers}/${userId}`);
  }

  updateUser(userId: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiURlUsers}/${userId}`, user);
  }

  getUsersCount(): Observable<any> {
    return this.http.get<any>(`${this.apiURlUsers}/get/count`);
  }

  getCountries(): { id?: string; name?: string }[] {
    let countries: { id?: string; name?: string }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    countriesLib.registerLocale(require('i18n-iso-countries/langs/en.json'));
    countries = Object.entries(
      countriesLib.getNames('en', { select: 'official' })
    ).map((entry) => {
      return {
        id: entry[0],
        name: entry[1],
      };
    });
    return countries;
  }

  initAppSession() {
    this.usersFacade.buildUserSession();
  }

  observeCurrentUser(): Observable<User> {
    return this.usersFacade.currentUser$;
  }
  isCurrentUserAuthenticated(): Observable<boolean> {
    return this.usersFacade.isAuthenticated$;
  }
}
