
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constant';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'sellerEmailAddress', // not sure 
      passwordField: 'sellerPassword',  // not sure 
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: "SECRET",
    });
  }

  async validate(payload: any) {
    console.log("user is validated .. ")
    //console.log("in jwt folder -> jwt strategy -> validate function")
    // ekhane user er shob info pull kore niye eshe return korte hobe .. 
    return { sellerId: payload.sub, sellerEmailAddress: payload.sellerEmailAddress };
  }
}
