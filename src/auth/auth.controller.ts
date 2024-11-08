import { Controller, Get, Query, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from './entities/user.entity';
import { GetUser } from './decorators/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const url = await this.authService.getAuthUrl();
    res.redirect(url);
  }

  @Get('google/callback')
  async googleCallback(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      return res.status(400).send('Authorization code not found');
    }
    const jwtToken = await this.authService.handleGoogleCallback(code);

    console.log(jwtToken);
    res.cookie('authGoogle', JSON.stringify(jwtToken));
    res.redirect(`${process.env.FRONTEND_URL}/professional`);
    //en el forntend validar con el jwt ademas validar el token guardado en base de datos de google que este activo esto tanto para las rutas para los pagos como para hacer la peticion de la reserva en google calendar
  }

  @UseGuards(JwtAuthGuard)
  @Get('validate-token')
  async validateToken(@GetUser() user: User, @Res() res: Response) {
    const jwtToken = await this.authService.validateToken(user);

    res.cookie('authGoogle', JSON.stringify(jwtToken));
    return res.status(200).send('Token is valid');
  }
}
