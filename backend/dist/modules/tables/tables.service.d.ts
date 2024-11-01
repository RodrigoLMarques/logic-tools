import { GenerateTruthTableDto } from './models/tables.dto';
import { TruthTableEntity } from './models/tables.entity';
export declare class TablesService {
    generateTruthTable(dto: GenerateTruthTableDto): Promise<TruthTableEntity>;
    resolveExpression(expression: string, variables: Record<string, boolean>): Promise<boolean>;
}
