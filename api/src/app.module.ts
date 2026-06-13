import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WisataModule } from './wisata/wisata.module';
import { TripModule } from './trip/trip.module';
import { BookingModule } from './booking/booking.module';
import { MediaModule } from './media/media.module';
import { GatewayModule } from './gateway/gateway.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'password'),
        database: configService.get('DB_NAME', 'explonesia'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: true,
      }),
      inject: [ConfigService],
    }),
    WisataModule,
    TripModule,
    BookingModule,
    MediaModule,
    GatewayModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
