import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanActivateFn,
} from '@angular/router';
import { Router } from '@angular/router'; // Đảm bảo bạn đã import Router ở đây.
import { inject } from '@angular/core';
import { of, Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { UserResponse } from '../responses/user/user.response';
import { TokenService } from '../services/token.service';
import { ROLE_ADMIN } from '../responses/user/role.response';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class AdminGuard {
  userResponse?: UserResponse | null;
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isTokenExpired = this.tokenService.isTokenExpired();
    const isUserIdValid = this.tokenService.getUserId().trim() !== '';
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    const isAdmin = this.userResponse?.role.name === ROLE_ADMIN;
    debugger;
    if (!isTokenExpired && isUserIdValid && isAdmin) {
      return true;
    } else {
      this.router.navigate(['/login']);
      this.toastr.info('Bạn không có quyền truy cập', '', {
        timeOut: 3000,
        progressBar: true,
      });
      return false;
    }
  }
}

export const AdminGuardFn: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  debugger;
  return inject(AdminGuard).canActivate(next, state);
};
