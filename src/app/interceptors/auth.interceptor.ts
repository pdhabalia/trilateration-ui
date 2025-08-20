import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../service/authentication.service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  // List of endpoints that don't require authentication
  const publicEndpoints = ['/login', '/register', '/forgot-password', '/reset-password'];

  // Skip authentication for public endpoints
  const isPublicEndpoint = publicEndpoints.some(endpoint => req.url.includes(endpoint));
  if (isPublicEndpoint) {
    return next(req);
  }

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    // User is not authenticated, redirect to login
    router.navigate(['/login']);
    return throwError(() => new Error('User not authenticated'));
  }

  // Get the token
  const token = authService.getToken();
  
  // Clone the request and add the authorization header
  const authReq = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }) : req;

  // Handle the request and catch any authentication errors
  return next(authReq).pipe(
    catchError((error) => {
      // If we get a 401 or 403, the token might be expired or invalid
      if (error.status === 401 || error.status === 403) {
        // Clear the token and redirect to login
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
