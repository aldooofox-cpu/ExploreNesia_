import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /**
   * Root endpoint - Test API health
   * @returns Success message + endpoint list for presentation
   */
  @Get()
  getHello(): string {
    return 'ExploreNesia API Backend Berhasil! Gunakan /wisata, /trip, /booking.';
  }
}
