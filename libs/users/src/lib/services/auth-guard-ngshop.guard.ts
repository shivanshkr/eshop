import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { LocalstorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardNgshopGuard implements CanActivate {
  constructor(private router: Router, private LSS: LocalstorageService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = this.LSS.getToken();
    console.log(token);
    if (token) {
      const tokenDecode = JSON.parse(atob(token.split('.')[1]));
      console.log(tokenDecode);
      if (!this._tokenExpired(tokenDecode.exp)) {
        return true;
      }
    }
    this.router.navigate(['/login']);
    return false;
  }

  private _tokenExpired(exp: number): boolean {
    return Math.floor(new Date().getTime() / 1000) >= exp;
  }
}
