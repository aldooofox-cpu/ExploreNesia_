import { IsString, IsNotEmpty, IsNumber, IsInt, Min } from 'class-validator';

export class CreateTripDto {
  @IsString()
  @IsNotEmpty()
  namaTrip: string;

  @IsNumber()
  harga: number;

  @IsString()
  @IsNotEmpty()
  tanggal: string;

  @IsInt()
  @Min(0)
  kuota: number;

  @IsString()
  deskripsi: string;

  @IsInt()
  wisataId: number;
}
