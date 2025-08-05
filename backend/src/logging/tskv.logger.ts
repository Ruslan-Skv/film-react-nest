import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: string,
    message: any,
    context?: string,
    ...optionalParams: any[]
  ): string {
    const params = optionalParams.length ? optionalParams : undefined;
    const parts = [
      `timestamp=${new Date().toISOString()}`,
      `level=${level}`,
      `context=${context || ''}`,
      `message=${this.escapeValue(message)}`,
    ];

    if (params) {
      parts.push(`params=${this.escapeValue(JSON.stringify(params))}`);
    }

    return parts.join('\t');
  }

  private escapeValue(value: any): string {
    if (typeof value === 'string') {
      return value
        .replace(/\n/g, '\\n')
        .replace(/\t/g, '\\t')
        .replace(/\r/g, '\\r');
    }
    return String(value);
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
