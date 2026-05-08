import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Trip } from '../../trip/entities/trip.entity';

@Entity()
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  namaUser: string;

  @Column()
  email: string;

  @Column('int')
  jumlahTiket: number;

  @Column('decimal')
  totalHarga: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid';

  @ManyToOne(() => Trip, trip => trip.bookings)
  @JoinColumn({ name: 'tripId' })
  trip: Trip;

  @Column()
  tripId: number;
}
