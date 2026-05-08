import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Trip } from '../../trip/entities/trip.entity';

@Entity()
export class Wisata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nama: string;

  @Column('text')
  deskripsi: string;

  @Column()
  lokasi: string;

  @Column()
  gambar: string;

  @OneToMany(() => Trip, trip => trip.wisata)
  trips: Trip[];
}
