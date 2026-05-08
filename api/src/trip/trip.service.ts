import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Trip } from './entities/trip.entity';
import { WisataService } from '../wisata/wisata.service';

@Injectable()
export class TripService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    private readonly wisataService: WisataService,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<Trip> {
    await this.wisataService.findOne(createTripDto.wisataId);
    const trip = this.tripRepository.create(createTripDto);
    return this.tripRepository.save(trip);
  }

  findAll(): Promise<Trip[]> {
    return this.tripRepository.find({ relations: ['wisata'] });
  }

  async findOne(id: number): Promise<Trip> {
    const trip = await this.tripRepository.findOne({ 
      where: { id }, 
      relations: ['wisata'] 
    });
    if (!trip) {
      throw new NotFoundException(`Trip #${id} not found`);
    }
    return trip;
  }

  async findByWisata(wisataId: number): Promise<Trip[]> {
    await this.wisataService.findOne(wisataId);
    return this.tripRepository.find({ 
      where: { wisata: { id: wisataId } },
      relations: ['wisata']
    });
  }

  async update(id: number, updateTripDto: UpdateTripDto): Promise<Trip> {
    await this.findOne(id);
    await this.tripRepository.update(id, updateTripDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.tripRepository.delete(id);
  }
}
