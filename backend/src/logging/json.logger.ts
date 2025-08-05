import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: any,
    context?: string,
    ...optionalParams: any[]
  ) {
    return JSON.stringify({
      timestamp: new Date().toISOString(),
      level,
      context,
      message,
      ...(optionalParams.length ? { params: optionalParams } : {}),
    });
  }

  log(message: any, context?: string, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, context, ...optionalParams));
  }

  error(message: any, context?: string, ...optionalParams: any[]) {
    console.error(
      this.formatMessage('error', message, context, ...optionalParams),
    );
  }

  warn(message: any, context?: string, ...optionalParams: any[]) {
    console.warn(
      this.formatMessage('warn', message, context, ...optionalParams),
    );
  }

  debug(message: any, context?: string, ...optionalParams: any[]) {
    console.debug(
      this.formatMessage('debug', message, context, ...optionalParams),
    );
  }

  verbose(message: any, context?: string, ...optionalParams: any[]) {
    console.info(
      this.formatMessage('verbose', message, context, ...optionalParams),
    );
  }
}