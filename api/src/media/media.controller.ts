import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import fetch from 'node-fetch';

@Controller('media')
export class MediaController {
  @Get('proxy')
  async proxy(
    @Query('url') url: string,
    @Res() res: Response,
  ) {
    if (!url) {
      return res.status(400).json({ message: 'Missing query param: url' });
    }


    const upstream = await fetch(url, {

      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ExploreNesia CMS/MediaProxy)',
        Accept: 'image/*,*/*;q=0.8',
      },
    });

    if (!upstream.ok) {
      return res
        .status(upstream.status)
        .json({ message: `Upstream image fetch failed: ${upstream.status}` });
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream';
    res.setHeader('Content-Type', contentType);

    const arrayBuffer = await upstream.arrayBuffer();
    res.send(Buffer.from(arrayBuffer));
  }
}

