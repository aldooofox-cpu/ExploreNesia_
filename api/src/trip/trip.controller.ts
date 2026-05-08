import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TripService } from './trip.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

/*
Example:
POST /trip
{
  "namaTrip": "Sunset Tour",
  "harga": 100000,
  "tanggal": "2024-12-01",
  "kuota": 50,
  "deskripsi": "Tour at sunset",
  "wisataId": 1
}
GET /trip/wisata/1
*/

@Controller('trip')
export class TripController {
  constructor(private readonly tripService: TripService) {}

  /**
   * Buat trip tiket wisata baru
   * @param createTripDto Data trip: namaTrip, harga, tanggal, kuota, wisataId
   * @returns Trip created
   */
  @Post()
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripService.create(createTripDto);
  }

  /**
   * List semua trip dengan relations wisata
   * @returns Array Trip[]
   */
  @Get()
  findAll() {
    return this.tripService.findAll();
  }

  /**
   * Dapatkan trip milik wisata tertentu
   * @param wisataId - ID wisata
   * @returns Array trip milik wisata
   * @example GET /trip/wisata/1
   */
  @Get('wisata/:wisataId')
  findByWisata(@Param('wisataId') wisataId: string) {
    return this.tripService.findByWisata(+wisataId);
  }

  /**
   * Detail trip by ID with relations
   * @param id Trip ID
   * @returns Trip or 404
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  /**
   * Update trip by ID
   * @param id Trip ID
   * @param updateTripDto Partial update
   * @returns Updated trip
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTripDto: UpdateTripDto) {
    return this.tripService.update(+id, updateTripDto);
  }

  /**
   * Hapus trip by ID
   * @param id Trip ID
   * @returns Void
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}
