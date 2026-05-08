import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

/*
Example:
POST /booking
{
  "namaUser": "John Doe",
  "email": "john@example.com",
  "jumlahTiket": 2,
  "tripId": 1
}
Response: {id:1, totalHarga: 200000, status: 'pending', ...}

PATCH /booking/1
{
  "status": "paid"
}
*/

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  create(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }

  @Get()
  findAll() {
    return this.bookingService.findAll();
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.bookingService.updateStatus(+id, updateStatusDto);
  }
}
