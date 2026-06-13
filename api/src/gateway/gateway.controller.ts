import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

import { WisataService } from '../wisata/wisata.service';
import { TripService } from '../trip/trip.service';
import { BookingService } from '../booking/booking.service';
import { CreateWisataDto } from '../wisata/dto/create-wisata.dto';
import { UpdateWisataDto } from '../wisata/dto/update-wisata.dto';
import { CreateTripDto } from '../trip/dto/create-trip.dto';
import { UpdateTripDto } from '../trip/dto/update-trip.dto';


@Controller('api')
export class GatewayController {
  constructor(
    private readonly wisataService: WisataService,
    private readonly tripService: TripService,
    private readonly bookingService: BookingService,
  ) {}

//Wisata
  @Post('wisata')
  createWisata(@Body() dto: CreateWisataDto) {
    return this.wisataService.create(dto);
  }

  @Get('wisata')
  getAllWisata() {
    return this.wisataService.findAll();
  }

  @Get('wisata/:id')
  getWisataById(@Param('id') id: string) {
    return this.wisataService.findOne(+id);
  }

  @Patch('wisata/:id')
  updateWisata(@Param('id') id: string, @Body() dto: UpdateWisataDto) {
    return this.wisataService.update(+id, dto);
  }

  @Delete('wisata/:id')
  deleteWisata(@Param('id') id: string) {
    return this.wisataService.remove(+id);
  }

//trip
  @Post('trip')
  createTrip(@Body() dto: CreateTripDto) {
    return this.tripService.create(dto);
  }

  @Get('trip')
  getAllTrip() {
    return this.tripService.findAll();
  }

  @Get('trip/wisata/:wisataId')
  getTripByWisata(@Param('wisataId') wisataId: string) {
    return this.tripService.findByWisata(+wisataId);
  }

  @Get('trip/:id')
  getTripById(@Param('id') id: string) {
    return this.tripService.findOne(+id);
  }

  @Patch('trip/:id')
  updateTrip(@Param('id') id: string, @Body() dto: UpdateTripDto) {
    return this.tripService.update(+id, dto);
  }

  @Delete('trip/:id')
  deleteTrip(@Param('id') id: string) {
    return this.tripService.remove(+id);
  }
}


