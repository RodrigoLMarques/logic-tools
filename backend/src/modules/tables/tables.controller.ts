import { Body, Controller, Post } from '@nestjs/common';
import { GenerateTruthTableDto } from './models/tables.dto';
import { TruthTableEntity } from './models/tables.entity';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post('truth')
  async generateTruthTable(
    @Body() body: GenerateTruthTableDto,
  ): Promise<TruthTableEntity> {
    return await this.tablesService.generateTruthTable(body);
  }
}
