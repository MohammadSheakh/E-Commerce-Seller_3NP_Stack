import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SellerService } from 'src/seller/seller.service';

// for jwt
import { CookieSerializeOptions, serialize } from 'cookie';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Seller } from 'src/seller/entities/seller.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SellerAuthService {
  
  constructor(
    //private sellerService: SellerService, // Repository bad diye service niye kaj korle valo hoito 
    @InjectRepository(Seller) private sellersRepository: Repository<Seller>,
    private jwtService: JwtService
  ){}

  // this is for local strategy
  async validateSeller(sellerEmailAddress: string, sellerPassword: string): Promise<any> {
    //const user = await this.sellerService.findOneByEmail(sellerEmailAddress);
    /**
     * 🔴🔴🔴🔴🔴 why seller service can not be used here ? 
     */
    console.log("in seller auth service -> validateSeller method for jwt strategy ")
    try{
      const user = await this.sellersRepository.findOneOrFail({
        where : {
                  sellerEmailAddress: sellerEmailAddress
                  
                }
      });

    // db te password ase hashed obosthay .. 


        const isMatch = await bcrypt.compare(sellerPassword, user.sellerPassword); //  dbpassword = user.sellerPassword
        console.log( "========== in seller-auth.service === ", isMatch, "-- seller given Password --", sellerPassword, "--  user.sellerPassword  --", user.sellerPassword);
        
        
        // if (user && user.sellerPassword === sellerPassword) {
          if (user && isMatch) {
            console.log("User is found is database by email and also password is matched with hashed password from db --- in seller-auth.service.ts -> validateSeller()");
            const { sellerPassword, ...result } = user;
            
            return result; // karon front-end e password send korar to dorkar nai .. password chara baki information jabe
            }
            else{
              return null;
            }
      }catch(err){
        console.log("============== in catch ============")
        throw new HttpException(
        {
          status : HttpStatus.UNAUTHORIZED, // statusCode - 401
          error : "Custom Error Message from local-stategy.ts : Credential is wrong form seller-auth.service.ts", // short description
        }, 
        HttpStatus.UNAUTHORIZED // 2nd argument which is status 
        ,
        {
          //optional //provide an error cause. 
          cause : err
        }
        );
      }

      console.log("============== return null from seller-auth.service.ts ============")



      
  }

  // loginWithJWT
  async loginWithJWT(seller: any/*, res:any*/){
    //console.log("auth service -> loginWithJWT(seller) => ", seller);
    //console.log("============= seller🟢🟢", seller);

    try{
      const user = await this.sellersRepository.findOneOrFail({
        where : {
                  sellerEmailAddress: seller.sellerEmailAddress
                  
                }
      });

    // db te password ase hashed obosthay .. 


        const isMatch = await bcrypt.compare(seller.sellerPassword, user.sellerPassword); //  dbpassword = user.sellerPassword
        //console.log( "========== in seller-auth.service === ", isMatch, "-- seller given Password --", seller.sellerPassword, "--  user.sellerPassword  --", user.sellerPassword);
        
        
        // if (user && user.sellerPassword === sellerPassword) {
          if (user && isMatch) {

            const payload = { sellerEmailAddress: seller.sellerEmailAddress, sub: user.id }; // this seller.id is sellers actual id 
            //console.log("auth service -> loginWithJWT(seller){payload} => ", payload);
            //console.log("auth service -> loginWithJWT(seller){return access_token} => ", await this.jwtService.signAsync(payload,{secret : "SECRET"}));
            

            // Set JWT token in a cookie
            // const cookieOptions: CookieSerializeOptions = {
            //   httpOnly: true, // This prevents client-side JavaScript from accessing the cookie
            //   maxAge: 60 * 60 * 24 * 7, // Cookie will expire in 7 days (adjust as needed)
            //   sameSite: 'strict', // Ensures the cookie is sent only in a first-party context
            //   secure: 'production', // Ensures the cookie is only sent over HTTPS in a production environment
            // };

          //const access_token =  

          // res.setHeader('Set-Cookie', serialize('access_token',access_token , cookieOptions));

          console.log("user is validate from seller-auth.service.ts")
          
          console.log({
            access_token: await this.jwtService.signAsync(payload,{secret : "SECRET", expiresIn: "60s"}),// ,{secret : "SECRET"} // secret are given in seller-auth.module.ts
            userId : user.id,
            userName : user.sellerName,
            userEmailAddress : user.sellerEmailAddress,
          });
            return {
              access_token: await this.jwtService.signAsync(payload,{secret : "SECRET", expiresIn: "60s"}),// ,{secret : "SECRET"} // secret are given in seller-auth.module.ts
              userId : user.id,
              userName : user.sellerName,
              userEmailAddress : user.sellerEmailAddress,
            }
          }else{
            return null; // not sure 
          }
      }catch(err){
          // generate exception 
          throw new HttpException(
            {
              status : HttpStatus.UNAUTHORIZED, // statusCode - 401
              error : "Custom Error Message from seller-auth.service.ts -> signIn method -> for jwt: Credential is wrong", // short description
            }, 
            HttpStatus.UNAUTHORIZED // 2nd argument which is status 
            ,
            {
              //optional //provide an error cause. 
              cause : err
            }
            );
      }


    
    
    
  }
}


// Our AuthService has the job of retrieving a user and verifying the
  // password. We create a validateUser() method for this purpose. In the 
  // code below, we use a convenient ES6 spread operator to strip the
  // password property from the user object before returning it. 
  // We'll be calling into the validateUser() method from our Passport local
  // strategy in a moment.
 