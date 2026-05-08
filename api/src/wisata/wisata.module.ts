import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wisata } from './entities/wisata.entity';
import { WisataController } from './wisata.controller';
import { WisataService } from './wisata.service';

@Module({
  imports: [TypeOrmModule.forFeature([Wisata])],
  controllers: [WisataController],
  providers: [WisataService],
  exports: [WisataService],
})
export class WisataModule {}
