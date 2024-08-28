import { Module } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { ReportsModule } from './reports/reports.module';
import { DbModule } from './db/db.module';

@Module({
  imports: [ReportsModule, DbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
