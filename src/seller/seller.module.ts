import { Module } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerController } from './seller.controller';
import { Seller } from './entities/seller.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product/product.entity';
import { Order } from './entities/order.entity';
import { AvailableQuality } from './entities/product/availableQuality.entity';
import { Specification } from './entities/product/specificaiton.entity';
import { Review } from './entities/product/review/review.entity';
import { Repository } from 'typeorm';
import { ReviewReply } from './entities/product/review/reviewReply.entity';
import { Category } from './entities/product/category.entity';
import { Brand } from './entities/product/brand.entity';
import { Buyer } from './entities/buyer.entity';
import { SellerAuthService } from 'src/seller-auth/seller-auth.service';
import { JwtService } from '@nestjs/jwt';
import { ProductCategorySeller } from './entities/product/productCategoryAndSeller/productCategorySeller';
import { SpecificationCategory } from './entities/product/specificationCategory.entity';
import { LikeDislike } from './entities/product/review/likeDislike.entity';

@Module({
  // ProductCategorySeller
  imports: [SellerModule,TypeOrmModule.forFeature([Seller,Buyer, Order, Product,ProductCategorySeller, Category , Brand, AvailableQuality, Specification,SpecificationCategory , Review, ReviewReply, LikeDislike])],
  controllers: [SellerController],
  providers: [SellerService, Repository, SellerAuthService, JwtService],
  exports: [SellerService], // (we'll soon use it in our seller-auth service).
})
export class SellerModule {}
