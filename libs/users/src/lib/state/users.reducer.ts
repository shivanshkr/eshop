import { createReducer, on, Action } from '@ngrx/store';
import { User } from '../Models/user';

import * as UsersActions from './users.actions';

export const USERS_FEATURE_KEY = 'users';

export interface UsersState {
  user: User;
  isAuthenticated: boolean;
}

export interface UsersPartialState {
  readonly [USERS_FEATURE_KEY]: UsersState;
}

export const initialUsersState: UsersState = {
  user: {},
  isAuthenticated: false,
};

const usersReducer = createReducer(
  initialUsersState,
  on(UsersActions.buildUserSession, (state) => ({ ...state })),
  on(UsersActions.buildUsersSessionSuccess, (state, action) => ({
    ...state,
    user: action.user,
    isAuthenticated: true,
  })),
  on(UsersActions.buildUsersSessionFailed, (state) => ({
    ...state,
    user: {},
    isAuthenticated: false,
  }))
);

export function reducer(state: UsersState | undefined, action: Action) {
  return usersReducer(state, action);
}
