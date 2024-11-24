import { IsArray, IsNotEmpty } from 'class-validator';

export class GenerateTruthTableDto {
  @IsNotEmpty()
  @IsArray()
  expressions: string[];
}
