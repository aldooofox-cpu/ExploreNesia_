import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Booking } from './entities/booking.entity';
import { TripService } from '../trip/trip.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepository: Repository<Booking>,
    private readonly tripService: TripService,
  ) {}

  async create(createBookingDto: CreateBookingDto): Promise<Booking> {
    const trip = await this.tripService.findOne(createBookingDto.tripId);
    if (trip.kuota < createBookingDto.jumlahTiket) {
      throw new BadRequestException('Kuota trip tidak cukup');
    }

    const totalHarga = createBookingDto.jumlahTiket * trip.harga;
    const booking = this.bookingRepository.create({
      ...createBookingDto,
      totalHarga,
    });

    const savedBooking = await this.bookingRepository.save(booking);
    trip.kuota -= createBookingDto.jumlahTiket;
    await this.tripService.update(trip.id, { kuota: trip.kuota });
    return savedBooking;
  }

  findAll(): Promise<Booking[]> {
    return this.bookingRepository.find({ relations: ['trip', 'trip.wisata'] });
  }

  async findOne(id: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({ 
      where: { id }, 
      relations: ['trip', 'trip.wisata'] 
    });
    if (!booking) {
      throw new NotFoundException(`Booking #${id} not found`);
    }
    return booking;
  }

  async updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<Booking> {
    await this.findOne(id);
    await this.bookingRepository.update(id, { status: updateStatusDto.status });
    return this.findOne(id);
  }
}
