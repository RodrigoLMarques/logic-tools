import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class GenerateTruthTableDto {
  // @IsNotEmpty()
  // @IsObject()
  // variables: { [key: string]: boolean };

  @IsNotEmpty()
  @IsArray()
  variables: string[];

  @IsNotEmpty()
  @IsString()
  expression: string;
}
