import { BadRequestException, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { GenerateTruthTableDto } from './models/tables.dto';
import { TruthTableEntity } from './models/tables.entity';

@Injectable()
export class TablesService {
  async generateTruthTable(
    dto: GenerateTruthTableDto,
  ): Promise<TruthTableEntity> {
    const truthTable: TruthTableEntity = {};
    const variables = Object.keys(dto.variables);
    const numRows = 2 ** variables.length;

    variables.forEach((variable) => {
      truthTable[variable] = [];
    });
    truthTable['result'] = [];

    for (let i = 0; i < numRows; i++) {
      const rowValues: Record<string, boolean> = {};

      variables.forEach((variable, index) => {
        const value = Boolean((~i >> (variables.length - index - 1)) & 1);
        truthTable[variable].push(value);
        rowValues[variable] = value;
      });

      const result = await this.resolveExpression(dto.expression, rowValues);

      truthTable['result'].push(result);
    }

    return truthTable;
  }

  async resolveExpression(
    expression: string,
    variables: Record<string, boolean>,
  ): Promise<boolean> {
    expression = expression.replace(/\{(\w+)\}/g, (_, varName) => {
      return variables[varName] !== undefined
        ? variables[varName]
          ? 'T'
          : 'F'
        : `{${varName}}`;
    });

    const executablePath = path.join(
      process.cwd(),
      '..',
      'algorithms',
      'logicalExpressionEvaluator',
    );

    return new Promise((resolve, reject) => {
      exec(`${executablePath} "${expression}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          console.error(`Error: ${error.message}`);
          reject(new BadRequestException(`Execution to resolve expression`));
          return;
        }
        if (stderr) {
          console.error(`Error no stderr: ${stderr}`);
          reject(new BadRequestException(`Execution to resolve expression`));
          return;
        }

        resolve(Boolean(Number(stdout.trim())));
      });
    });
  }
}
