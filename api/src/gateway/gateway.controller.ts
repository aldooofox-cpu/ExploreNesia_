import {
  Controller,
} from '@nestjs/common';

import { WisataService } from '../wisata/wisata.service';
import { TripService } from '../trip/trip.service';
import { BookingService } from '../booking/booking.service';
import { CreateWisataDto } from '../wisata/dto/create-wisata.dto';
import { UpdateWisataDto } from '../wisata/dto/update-wisata.dto';

@Controller('api')
export class GatewayController {
  constructor(
    private readonly wisataService: WisataService,
    private readonly tripService: TripService,
    private readonly bookingService: BookingService,
  ) {}

//Wisata
  @Post('wisata')
  @Get('wisata')
  @Get('wisata/:id')
  @Patch('wisata/:id')
  @Delete('wisata/:id')

}


