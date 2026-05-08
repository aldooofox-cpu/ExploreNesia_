import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WisataService } from './wisata.service';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';

/*
Example:
POST /wisata
{
  "nama": "Bali Beach",
  "deskripsi": "Beautiful beach in Bali",
  "lokasi": "Bali",
  "gambar": "bali.jpg"
}
Response: {id:1, ...}
*/

@Controller('wisata')
export class WisataController {
  constructor(private readonly wisataService: WisataService) {}

  /**
   * @description Buat wisata baru
   * @example POST /wisata body: {\"nama\":\"Bali\",\"deskripsi\":\"Pantai\",\"lokasi\":\"Bali\",\"gambar\":\"bali.jpg\"}
   * @returns Wisata created with ID
   */
  @Post()
  create(@Body() createWisataDto: CreateWisataDto) {
    return this.wisataService.create(createWisataDto);
  }

  /**
   * @description Dapatkan semua wisata
   * @returns Array list wisata
   */
  @Get()
  findAll() {
    return this.wisataService.findAll();
  }

  /**
   * @description Dapatkan detail wisata by ID
   * @param id Wisata ID
   * @returns Wisata detail or 404 if not found
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.wisataService.findOne(+id);
  }

  /**
   * @description Update wisata by ID
   * @param id Wisata ID
   * @param updateWisataDto Data update (partial)
   * @returns Updated wisata
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWisataDto: UpdateWisataDto) {
    return this.wisataService.update(+id, updateWisataDto);
  }

  /**
   * @description Hapus wisata by ID
   * @param id Wisata ID
   * @returns Void (no content)
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wisataService.remove(+id);
  }
}
