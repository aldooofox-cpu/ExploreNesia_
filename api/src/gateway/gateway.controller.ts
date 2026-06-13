import {
  Controller,
} from '@nestjs/common';

import { WisataService } from '../wisata/wisata.service';
import { TripService } from '../trip/trip.service';
import { BookingService } from '../booking/booking.service';

@Controller('api')
export class GatewayController {
  constructor(
    private readonly wisataService: WisataService,
    private readonly tripService: TripService,
    private readonly bookingService: BookingService,
  ) {}
}