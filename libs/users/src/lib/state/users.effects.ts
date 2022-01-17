import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, concatMap, map } from 'rxjs/operators';
import { LocalstorageService } from '../services/localstorage.service';
import { UsersService } from '../services/users.service';

import * as UsersActions from './users.actions';

@Injectable()
export class UsersEffects {
  buildUserSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.buildUserSession),
      concatMap(() => {
        if (this.localStorageService.isValidToken()) {
          const userId = this.localStorageService.getUserIdFromToken();
          if (userId) {
            return this.usersService.getUser(userId).pipe(
              map((users) => {
                return UsersActions.buildUsersSessionSuccess({ user: users });
              }),
              catchError(() => of(UsersActions.buildUsersSessionFailed()))
            );
          } else {
            return of(UsersActions.buildUsersSessionFailed());
          }
        } else {
          return of(UsersActions.buildUsersSessionFailed());
        }
      })
    )
  );

  constructor(
    private readonly actions$: Actions,
    private localStorageService: LocalstorageService,
    private usersService: UsersService
  ) {}
}
