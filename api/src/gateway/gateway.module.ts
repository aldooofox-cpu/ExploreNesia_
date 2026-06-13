import { Module } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { WisataModule } from '../wisata/wisata.module';
import { TripModule } from '../trip/trip.module';
import { BookingModule } from '../booking/booking.module';

@Module({
  imports: [WisataModule, TripModule, BookingModule],
  controllers: [GatewayController],
  providers: [],
})
export class GatewayModule {}



