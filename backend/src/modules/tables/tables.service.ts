import { BadRequestException, Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import * as path from 'path';
import { GenerateTruthTableDto } from './models/tables.dto';
import { TruthTableEntity } from './models/tables.entity';

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
    const [expression, variables] = this.extractVariables(dto.expression);

    const truthTable: TruthTableEntity = {};
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

      const result = await this.resolveExpression(expression, rowValues);

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
    const executablePath = path.join(process.env.PATH_TO_EXEC);

    console.log(executablePath);

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

  extractVariables(expression: string): [string, string[]] {
    // Cria um conjunto de todos os símbolos dos operadores para ignorar na busca por variáveis
    const operatorSymbols = this.operatorMappings.flatMap(
      (mapping) => mapping.symbols,
    );

    // Regex para encontrar palavras que não sejam operadores
    const variableRegex = /\b[A-Za-z]+\b/g;

    // Encontre todas as palavras na expressão
    const variables = (expression.match(variableRegex) || []).filter(
      (word) => !operatorSymbols.includes(word),
    ); // Filtra palavras que são operadores

    // Remover duplicatas
    const uniqueVariables = Array.from(new Set(variables));

    // Substituir as variáveis na expressão por chaves
    let modifiedExpression = expression;
    uniqueVariables.forEach((variable) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      modifiedExpression = modifiedExpression.replace(regex, `{${variable}}`);
    });

    return [modifiedExpression, uniqueVariables];
  }
}
