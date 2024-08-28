import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { CreateReportDto } from './reports.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Post()
  createReport(@Body() createReportDto: CreateReportDto) {
    return this.reportService.createReport(createReportDto);
  }

  @Get(':id')
  getReport(@Param('id', ParseIntPipe) id: number) {
    return this.reportService.getReportById(id);
  }

  @Get('file/:filename')
  getFile(@Param('filename') filename: string): StreamableFile {
    return this.reportService.getReportFile(filename);
  }
}
