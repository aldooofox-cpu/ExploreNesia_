import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWisataDto } from './dto/create-wisata.dto';
import { UpdateWisataDto } from './dto/update-wisata.dto';
import { Wisata } from './entities/wisata.entity';

@Injectable()
export class WisataService {
  constructor(
    @InjectRepository(Wisata)
    private readonly wisataRepository: Repository<Wisata>,
  ) {}

  /**
   * Buat wisata baru dari DTO
   * @param createWisataDto - Data wisata baru (validated)
   * @returns Wisata saved with auto ID
   */
  create(createWisataDto: CreateWisataDto): Promise<Wisata> {
    const wisata = this.wisataRepository.create(createWisataDto);
    return this.wisataRepository.save(wisata);
  }

  findAll(): Promise<Wisata[]> {
    return this.wisataRepository.find();
  }

  async findOne(id: number): Promise<Wisata> {
    const wisata = await this.wisataRepository.findOne({ where: { id } });
    if (!wisata) {
      throw new NotFoundException(`Wisata #${id} not found`);
    }
    return wisata;
  }

  async update(id: number, updateWisataDto: UpdateWisataDto): Promise<Wisata> {
    await this.findOne(id);
    await this.wisataRepository.update(id, updateWisataDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.wisataRepository.delete(id);
  }
}
