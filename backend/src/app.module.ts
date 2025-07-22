import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { configProvider } from './app.config.provider';
import { join } from 'path';
import { FilmsModule } from './films/films.module';
import { OrdersModule } from './order/orders.module';
import { DatabaseModule } from './database/database.module';
import { MongooseModule } from '@nestjs/mongoose';

const databaseModule = process.env.DATABASE_DRIVER === 'mongodb' 
  ? MongooseModule.forRoot(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DATABASE,
    })
  : DatabaseModule;


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
    }),
    databaseModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api/*'],
      serveStaticOptions: {
        maxAge: 86400000, // 1 день
        cacheControl: true,
      },
    }),
    FilmsModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [configProvider],
})
export class AppModule {}
