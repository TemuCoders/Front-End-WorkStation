import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { IamService } from './iam.service';

/**
 * HTTP Interceptor que agrega automáticamente el JWT token a todas las peticiones
 *
 * Este interceptor se ejecuta antes de cada petición HTTP y agrega el header
 * Authorization: Bearer {token} si existe un token guardado.
 */
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const iamService = inject(IamService);
  const token = iamService.getToken();

  // Si hay token, clonar la request y agregar el header Authorization
  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  // Si no hay token, continuar sin modificar la request
  return next(req);
};
