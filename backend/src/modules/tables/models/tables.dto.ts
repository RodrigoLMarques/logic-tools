import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateTruthTableDto {
  @IsNotEmpty()
  @IsString()
  expression: string;
}
