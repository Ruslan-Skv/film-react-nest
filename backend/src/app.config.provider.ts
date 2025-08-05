import { ConfigModule } from '@nestjs/config';
import 'dotenv/config';

import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  useFactory: (configService: ConfigService) => ({
    database: {
      driver: configService.get('DATABASE_DRIVER'),
      postgres: {
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
      },
      mongodb: {
        uri: configService.get('MONGO_URI'),
        dbName: configService.get('MONGO_DATABASE'),
      },
    },
  }),
  inject: [ConfigService],
};

export interface AppConfig {
  database: {
    driver: string;
    postgres?: {
      host: string;
      port: number;
    };
    mongodb?: {
      uri: string;
      dbName: string;
    };
  };
}
