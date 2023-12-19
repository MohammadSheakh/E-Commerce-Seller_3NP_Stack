import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import session from 'express-session';
const express = require('express');
const session = require('express-session');
// import * as dotenv from 'dotenv';
async function bootstrap() {
  // dotenv.config();

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // Replace with your frontend app's URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //credentials: true, // Set this to true if your frontend app includes credentials (e.g., cookies, HTTP authentication)
  });
  

  // app.use(
  //   session({
  //   secret: 'SECRET',
  //   resave: false,
  //   saveUninitialized: false,
  //   cookie:{
  //     maxAge: 1800000, // 30 minutes
  //   }
  //   }),
  //   );
    
  await app.listen(3000);

}
bootstrap();
