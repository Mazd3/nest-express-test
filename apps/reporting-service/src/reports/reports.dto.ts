import {
  ArrayMinSize,
  ArrayUnique,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  serviceName: string;

  @IsNotEmpty()
  @IsString()
  dataEndpoint: string;

  @IsArray()
  @IsNotEmpty()
  @ArrayMinSize(1)
  @ArrayUnique()
  @IsString({ each: true })
  tableHeaders: string[];

  @IsNotEmpty()
  @IsNumber()
  limit: number;
}
