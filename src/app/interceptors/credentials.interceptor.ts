import { HttpInterceptorFn } from '@angular/common/http';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const credentialedRequest = req.clone({
    withCredentials: true
  });

  return next(credentialedRequest);
};