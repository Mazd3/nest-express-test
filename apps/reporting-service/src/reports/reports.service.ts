import {
  BadRequestException,
  Injectable,
  StreamableFile,
} from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { CreateReportDto } from './reports.dto';
import * as Excel from 'exceljs';
import { join } from 'path';
import { createReadStream } from 'fs';
import { getUnmatchedKeys } from 'src/utils/getUnmatchedKeys';

@Injectable()
export class ReportsService {
  constructor(private dbService: DbService) {}

  async getReportById(id: number) {
    const report = await this.dbService.report.findUnique({ where: { id } });
    return report;
  }

  getReportFile(filename: string) {
    const file = createReadStream(join(process.cwd(), 'public', filename));
    return new StreamableFile(file, {
      type: 'application/json',
      disposition: `attachment; filename="${filename}"`,
    });
  }

  async createReport({
    dataEndpoint,
    serviceName,
    tableHeaders,
    limit,
  }: CreateReportDto) {
    // проверка на существование данных сервиса и совпадение колонок таблицы с данными сервиса
    const data = await fetch(`${dataEndpoint}?limit=${1}&page=${1}`)
      .then((res) => res.json())
      .then((data) => data)
      .catch(() => {
        throw new BadRequestException('Data endpoint is empty');
      });
    const unmatchedHeaders = getUnmatchedKeys(tableHeaders, data[0]);
    if (unmatchedHeaders.length > 0) {
      throw new BadRequestException(
        'Headers do not match data keys: ' + unmatchedHeaders.join(', '),
      );
    }

    // создание записи об отчете в бд
    const report = await this.dbService.report.create({
      data: { status: 'pending' },
    });

    // формирование отчета

    (async () => {
      const workbook = new Excel.stream.xlsx.WorkbookWriter({
        filename: `./public/${serviceName}-${report.id}.xlsx`,
        useStyles: true,
        useSharedStrings: true,
      });
      const worksheet = workbook.addWorksheet(serviceName);
      worksheet.columns = tableHeaders.map((key) => ({ header: key, key }));

      for (let i = 0; i < limit; i += 100) {
        const dataChunk = await fetch(
          `${dataEndpoint}?limit=${100}&page=${Math.floor(i / 100) + 1}`,
        )
          .then((res) => res.json())
          .then((data) => data);

        if (dataChunk.length === 0) break;

        const worksheet = workbook.getWorksheet(serviceName);

        for (const item of dataChunk) {
          worksheet.addRow(item).commit();
        }
      }

      await workbook.commit();

      await this.dbService.report.update({
        where: { id: report.id },
        data: {
          status: 'complete',
          url: `http://localhost:3000/reports/file/${serviceName}-${report.id}.xlsx`,
        },
      });
    })().catch(async () => {
      await this.dbService.report.update({
        where: { id: report.id },
        data: { status: 'failed' },
      });
    });

    return { id: report.id };
  }
}
