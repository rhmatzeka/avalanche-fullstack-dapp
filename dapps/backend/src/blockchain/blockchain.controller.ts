import { Controller, Get, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { BlockchainService } from './blockchain.service';
import { GetEventsDto } from './dto/get-events.dto';

@Controller('blockchain')
export class BlockchainController {
  constructor(private readonly blockchainService: BlockchainService) {}

  @Get("value")
  async getValue() {
    return await this.blockchainService.getLatestValue();
  }

  // Gunakan GET agar bisa langsung dipanggil di browser
  @Get("events")
  @UsePipes(new ValidationPipe({ transform: true }))
  async getEvents(@Query() query: GetEventsDto) {
    // Jika query kosong, gunakan angka default agar tidak error BigInt
    const from = query.fromBlock ?? 50511090;
    const to = query.toBlock ?? 50513090;
    
    return await this.blockchainService.getValueUpdatedEvents(from, to);
  }
}