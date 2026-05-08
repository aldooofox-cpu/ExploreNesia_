import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Wisata } from '../../wisata/entities/wisata.entity';
import { Booking } from '../../booking/entities/booking.entity';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namaTrip: string;

  @Column('decimal')
  harga: number;

  @Column()
  tanggal: string;

  @Column('int')
  kuota: number;

  @Column('text')
  deskripsi: string;

  @ManyToOne(() => Wisata, wisata => wisata.trips)
  wisata: Wisata;

  @OneToMany(() => Booking, booking => booking.trip)
  bookings: Booking[];
}
