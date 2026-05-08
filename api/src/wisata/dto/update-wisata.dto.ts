import { PartialType } from '@nestjs/mapped-types';
import { CreateWisataDto } from './create-wisata.dto';

export class UpdateWisataDto extends PartialType(CreateWisataDto) {} // Fixed import if needed, but add @nestjs/mapped-types dep if missing
