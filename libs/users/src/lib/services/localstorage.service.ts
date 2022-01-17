import { Injectable } from '@angular/core';

const TOKEN = 'jwtToken';
@Injectable({
  providedIn: 'root',
})
export class LocalstorageService {
  // constructor() { }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setToken(data: any) {
    localStorage.setItem(TOKEN, data);
  }

  getToken() {
    return localStorage.getItem(TOKEN) as string;
  }

  removeToken() {
    localStorage.removeItem(TOKEN);
  }

  isValidToken() {
    const token = this.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      return !this._tokenExpired(tokenDecode.exp);
    } else {
      return false;
    }
  }

  getUserIdFromToken() {
    const token = this.getToken();
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      if (tokenDecode) {
        return tokenDecode?.userId;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  private _tokenExpired(exp: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= exp;
  }
}
