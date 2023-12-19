import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  
}



// import {
//   CanActivate,
//   ExecutionContext,
//   HttpException,
//   HttpStatus,
//   Injectable,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
// //import { jwtConstants } from './constants';
// import { Request } from 'express';

// @Injectable()
// export class JwtAuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       // throw new UnauthorizedException();
//       throw new HttpException(
//         {
//           status : HttpStatus.UNAUTHORIZED, // statusCode - 401
//           error : "Custom Error Message from jwt-auth.guard.ts -> canActivate method -> for jwt: token is not found", // short description
//         }, 
//         HttpStatus.UNAUTHORIZED // 2nd argument which is status 
//         ,
//         {
//           //optional //provide an error cause. 
//           //cause : err
//         }
//         );
//     }
//     try {
//       console.log("token from jwt-auth.guard.ts : ", token );
//       const payload = await this.jwtService.verifyAsync(
//         token,
//         {
//           secret: "SECRET"  // this should come from env file
//         }
//       );
//       console.log("payload from jwt-auth.guard.ts : ", payload );
//       // 💡 We're assigning the payload to the request object here
//       // so that we can access it in our route handlers
//       request['user'] = payload;
//     } catch {
//       //throw new UnauthorizedException();

//       // generate exception 
//       throw new HttpException(
//         {
//           status : HttpStatus.UNAUTHORIZED, // statusCode - 401
//           error : "Custom Error Message from jwt-auth.guard.ts -> canActivate method -> for jwt: Credential is wrong", // short description
//         }, 
//         HttpStatus.UNAUTHORIZED // 2nd argument which is status 
//         ,
//         {
//           //optional //provide an error cause. 
//           //cause : err
//         }
//         );
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }
// }
