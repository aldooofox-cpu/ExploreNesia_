import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateWisataDto {
  @IsString()
  @IsNotEmpty()
  nama: string;

  @IsString()
  deskripsi: string;

  @IsString()
  @IsNotEmpty()
  lokasi: string;

  @IsString()
  @IsNotEmpty()
  gambar: string;
}
