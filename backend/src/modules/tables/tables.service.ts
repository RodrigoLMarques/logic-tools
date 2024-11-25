import { BadRequestException, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { GenerateTruthTableDto } from './models/tables.dto';
import { TruthTableEntity } from './models/tables.entity';

type Expression = {
  expr: string;
  expr2: string;
  variables: string[];
};

@Injectable()
export class TablesService {
  private readonly operatorMappings = [
    { operator: 'AND', precedence: 2, symbols: ['AND', '&'] },
    { operator: 'OR', precedence: 2, symbols: ['OR', '|'] },
    { operator: 'NOT', precedence: 3, symbols: ['NOT', '!', '~'] },
    { operator: 'XOR', precedence: 2, symbols: ['XOR', '^'] },
    { operator: 'IMPLIES', precedence: 3, symbols: ['IMPLIES', '->', '=>'] },
  ];

  async generateTruthTable(
    dto: GenerateTruthTableDto,
  ): Promise<TruthTableEntity> {
    console.log(dto.expressions);

    const expressions = dto.expressions.map((expr) =>
      this.extractVariables(expr),
    );
    const allVariables = Array.from(
      new Set(expressions.flatMap((expr) => expr.variables)),
    );

    const truthTable: TruthTableEntity = {};
    const numRows = 2 ** allVariables.length;

    allVariables.forEach((variable) => {
      truthTable[variable] = [];
    });
    expressions.forEach((expression) => {
      truthTable[expression.expr2] = [];
    });

    for (let i = 0; i < numRows; i++) {
      const rowValues: Record<string, boolean> = {};

      allVariables.forEach((variable, index) => {
        const value = Boolean((~i >> (allVariables.length - index - 1)) & 1);
        truthTable[variable].push(value);
        rowValues[variable] = value;
      });

      for (const expression of expressions) {
        const result = await this.resolveExpression(expression.expr, rowValues);
        truthTable[expression.expr2].push(result);
      }
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
      'src',
      'bin',
      'logicalExpressionEvaluator',
    );

    return new Promise((resolve, reject) => {
      exec(`${executablePath} "${expression}"`, (error, stdout, stderr) => {
        if (error || stderr) {
          console.error(`Error: ${error.message}`);
          reject(new BadRequestException(`Execution to resolve expression`));
          return;
        }
        resolve(Boolean(Number(stdout.trim())));
      });
    });
  }

  extractVariables(expression: string): Expression {
    const operatorSymbols = this.operatorMappings.flatMap(
      (mapping) => mapping.symbols,
    );
    const variableRegex = /\b[A-Za-z]+\b/g;
    const variables = (expression.match(variableRegex) || []).filter(
      (word) => !operatorSymbols.includes(word),
    );
    const uniqueVariables = Array.from(new Set(variables));

    let modifiedExpression = expression;
    uniqueVariables.forEach((variable) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      modifiedExpression = modifiedExpression.replace(regex, `{${variable}}`);
    });

    return {
      expr: modifiedExpression,
      expr2: expression,
      variables: uniqueVariables,
    };
  }
}
