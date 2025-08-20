import { Injectable, ConsoleLogger } from '@nestjs/common';

@Injectable()
export class DevLogger extends ConsoleLogger {
  constructor(context?: string) {
    super(context);
    this.setLogLevels(['log', 'error', 'warn', 'debug', 'verbose']);
  }
}