"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TablesService = void 0;
const common_1 = require("@nestjs/common");
const child_process_1 = require("child_process");
const path = require("path");
let TablesService = class TablesService {
    async generateTruthTable(dto) {
        const truthTable = {};
        const variables = Object.keys(dto.variables);
        const numRows = 2 ** variables.length;
        variables.forEach((variable) => {
            truthTable[variable] = [];
        });
        truthTable['result'] = [];
        for (let i = 0; i < numRows; i++) {
            const rowValues = {};
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
    async resolveExpression(expression, variables) {
        expression = expression.replace(/\{(\w+)\}/g, (_, varName) => {
            return variables[varName] !== undefined
                ? variables[varName]
                    ? 'T'
                    : 'F'
                : `{${varName}}`;
        });
        const executablePath = path.join(process.cwd(), '..', 'algorithms', 'logicalExpressionEvaluator');
        return new Promise((resolve, reject) => {
            (0, child_process_1.exec)(`${executablePath} "${expression}"`, (error, stdout, stderr) => {
                if (error || stderr) {
                    console.error(`Error: ${error.message}`);
                    reject(new common_1.BadRequestException(`Execution to resolve expression`));
                    return;
                }
                if (stderr) {
                    console.error(`Error no stderr: ${stderr}`);
                    reject(new common_1.BadRequestException(`Execution to resolve expression`));
                    return;
                }
                resolve(Boolean(Number(stdout.trim())));
            });
        });
    }
};
exports.TablesService = TablesService;
exports.TablesService = TablesService = __decorate([
    (0, common_1.Injectable)()
], TablesService);
//# sourceMappingURL=tables.service.js.map