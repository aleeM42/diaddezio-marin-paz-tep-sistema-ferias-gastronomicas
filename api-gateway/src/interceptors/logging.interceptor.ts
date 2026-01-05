import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = request;
    const now = Date.now();

    const user = request.user ? request.user.email || request.user.sub : 'anonymous';

    this.logger.log(
      `[${method}] ${url} - Usuario: ${user} - Timestamp: ${new Date().toISOString()}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const response = context.switchToHttp().getResponse();
          const { statusCode } = response;
          const duration = Date.now() - now;

          this.logger.log(
            `[${method}] ${url} - Status: ${statusCode} - Duración: ${duration}ms - Resultado: ÉXITO`,
          );
        },
        error: (error) => {
          const duration = Date.now() - now;
          const statusCode = error.status || 500;

          this.logger.error(
            `[${method}] ${url} - Status: ${statusCode} - Duración: ${duration}ms - Resultado: ERROR - ${error.message}`,
          );
        },
      }),
    );
  }
}

