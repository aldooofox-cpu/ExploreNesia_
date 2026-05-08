import { IsString, IsNotEmpty, IsInt, Min, IsEmail } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  namaUser: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(1)
  jumlahTiket: number;

  @IsInt()
  tripId: number;
}
