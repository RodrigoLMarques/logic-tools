import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class GenerateTruthTableDto {
  @IsNotEmpty()
  @IsObject()
  variables: { [key: string]: boolean };

  @IsNotEmpty()
  @IsString()
  expression: string;
}
