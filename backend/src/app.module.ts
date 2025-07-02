import { Module } from '@nestjs/common';
import {ServeStaticModule} from "@nestjs/serve-static";
import {ConfigModule} from "@nestjs/config";
import * as path from "node:path";

import {configProvider} from "./app.config.provider";
import { join } from 'path';
import { MongooseModule } from '@nestjs/mongoose';
// import { FilmsModule } from './films/films.module';
// import { OrdersModule } from './order/orders.module';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { FilmsModule } from './films/films.module';
import { OrdersModule } from './order/orders.module';

@Module({
  imports: [
	  ConfigModule.forRoot({
      isGlobal: true,
      cache: true
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL + '/afisha'),
    ServeStaticModule.forRoot({
      // rootPath: join(__dirname, '..', 'public', 'content', 'afisha'),
      // serveRoot: '/content/afisha',
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
      exclude: ['/api/*']
    }),
    FilmsModule,
    OrdersModule,
    
  ],
  controllers: [],
  providers: [configProvider],
})

export class AppModule {}

