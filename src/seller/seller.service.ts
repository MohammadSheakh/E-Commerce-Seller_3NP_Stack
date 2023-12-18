import { Body, HttpException, HttpStatus, Injectable, NotFoundException, ParseIntPipe, Post } from '@nestjs/common';
import { CreateSellerDto } from './dto/seller/create-seller.dto';
import { UpdateSellerDto } from './dto/seller/update-seller.dto';
import { Seller } from './entities/seller.entity';
import { Product } from './entities/product/product.entity';
import { ReviewCategoryEnum } from './model/review.model';
import { Order } from './entities/order.entity';
import { OrderStatusEnum, PaymentStatusEnum } from './model/preOrder.model';
import { Notification } from './entities/notification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Like, Repository } from 'typeorm';
import { AvailableQuality } from './entities/product/availableQuality.entity';
import { Specification } from './entities/product/specificaiton.entity';
import { Review } from './entities/product/review/review.entity';
import { ReviewReply } from './entities/product/review/reviewReply.entity';
import { SellerAuthService } from 'src/seller-auth/seller-auth.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as bcrypt from 'bcrypt';
import { session } from 'passport';
import { Category } from './entities/product/category.entity';
import { Brand } from './entities/product/brand.entity';
import { ProductCategorySeller } from './entities/product/productCategoryAndSeller/productCategorySeller';
import { LikeDislike } from './entities/product/review/likeDislike.entity';

// Status📃(total: problem : )
@Injectable()
export class SellerService {

  constructor(
    @InjectRepository(Seller) private sellersRepository: Repository<Seller>,
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(AvailableQuality) private availableQualitysRepository: Repository<AvailableQuality>,
    @InjectRepository(Specification) private availableSpecificaitonsRepository: Repository<Specification> ,
    @InjectRepository(Review) private reviewsRepository: Repository<Review> ,
    @InjectRepository(ReviewReply) private reviewRepliesRepository: Repository<ReviewReply> ,
    @InjectRepository(Category) private categoriesRepository: Repository<Category> ,
    @InjectRepository(Brand) private brandsRepository: Repository<Brand> ,
    @InjectRepository(ProductCategorySeller) private productCategoryRepository: Repository<ProductCategorySeller>,
    @InjectRepository(LikeDislike) private likeDislikeRepository: Repository<LikeDislike> ,
      private sellerAuthService: SellerAuthService,
      private mailerService: MailerService

    ){}

  /*
      //🟢 category should be another table / entity .. product and category should have .... relationship 
        category -> id , name 
      */

  
  // private notifications: Notification[] = [
  //   {
  //     notificationId : 1,
  //     notificationDetails : 'notification1',
  //   },
  // ];

  // 1 done // 🟢🔴
  async create(createSellerDto: CreateSellerDto) : Promise<Seller> {
    // try catch use korte hobe ..
    let newSeller;
    let sellerPassword = createSellerDto.sellerPassword;
    const salt = await bcrypt.genSalt();
    const hassedpassed = await bcrypt.hash(sellerPassword, salt);
    console.log("hassed password : ",hassedpassed);
    if(createSellerDto.id){
      newSeller = {
        ...createSellerDto,
        sellerPassword: hassedpassed
      }
    }else{
      newSeller = {
        id: Date.now(), 
        ...createSellerDto,
        sellerPassword: hassedpassed}
    }
    
    await this.sellersRepository.save(newSeller);
    return newSeller;
  }

  ////////////////////////////////////////////////////////////////////////////////////////
  async uploadAgain(sellerImage,shopLogo, createSellerDto){
    //console.log(" In service ==, file", sellerImage); // shopLogo

    const sellerImageFileName = sellerImage.map(sellerImage => sellerImage.filename)
    const shopLogoFileName = shopLogo.map(shopLogo => shopLogo.filename)
    

    const sellerImageFileNameString = sellerImageFileName.toString();
    const shopLogoFileNameString = shopLogoFileName.toString();


    let sellerPassword = createSellerDto.sellerPassword;
    const salt = await bcrypt.genSalt();
    const hassedpassed = await bcrypt.hash(sellerPassword, salt);
    console.log("hassed password : ",hassedpassed);

    let newSeller;
    if(createSellerDto.id){
      newSeller = {
        ...createSellerDto,
         sellerImage: sellerImageFileNameString,
         shopLogo: shopLogoFileNameString,
         sellerPassword: hassedpassed
        
      };
    }else{
      newSeller = {
        id: Date.now(), 
        ...createSellerDto,
         sellerImage: sellerImageFileNameString, 
         shopLogo: shopLogoFileNameString,
         sellerPassword: hassedpassed
      }
    }
    //
    this.sellersRepository.save(newSeller);
  }
//////////////////////////////////////////////////////////
  async getShopLogo(sellerId){
    //
    console.log("in service => sellerId", sellerId)
    const user =  await this.sellersRepository.findOne({ //🟢 findOneOrFail use korte hobe ..
      where: {id : sellerId} // 🤔😥 // it means {id : id}
    });
    
    // extract shoplogo 
    let sellerImage;
    let sellerShopLogo;
    if(user){
       sellerShopLogo = await user.shopLogo;
       sellerImage = await user.sellerImage;
    }else{
      throw new HttpException(
        {
          status : HttpStatus.NOT_FOUND, // statusCode - 401
          error : "user not found.", // short description
        }, 
        HttpStatus.NOT_FOUND // 2nd argument which is status 
        );
    }
    
    return sellerShopLogo;
  }
  

  // 2 🟢🟢
  async findAll() : Promise<Seller[]> {
    //return [];
    return await this.sellersRepository.find();
    //return this.sellers;
  }

  // 3 done //  🟢🟢
  async findOne(id: number) : Promise<Seller> {
    if(id != null && id != undefined){

      
      const user =  await this.sellersRepository.findOne({ //🟢 findOneOrFail use korte hobe ..
        where: {id} // 🤔😥 // it means {id : id}
      });

      // console.log("===================================================")
      // console.log("in findOne service, id : ", id, " : user : ", user)
      return user;


    }else{
      throw new HttpException(
        {
          status : HttpStatus.NOT_FOUND, // statusCode - 401
          error : "user not found.", // short description
        }, 
        HttpStatus.NOT_FOUND // 2nd argument which is status 
        );
    }
    //return this.sellers.find(seller => seller.id == id);
  }

  // 🏠
  async findOneProduct(id: number) : Promise<Product> {
    if(id != null && id != undefined){

      
      const product =  await this.productsRepository.findOne({ //🟢 findOneOrFail use korte hobe ..
        where: {id} // 🤔😥 // it means {id : id}
      });
      return product;


    }else{
      throw new HttpException(
        {
          status : HttpStatus.NOT_FOUND, // statusCode - 401
          error : "product not found.", // short description
        }, 
        HttpStatus.NOT_FOUND // 2nd argument which is status 
        );
    }
   }

   // 🏠
   async getProductsBySearch(searchValue){
    console.log("==============",`%${searchValue}%`)
    //const result =  await this.productsRepository.find({where: { name: `%${searchValue}%`}})
    //const result =  await this.productsRepository.find({where: { name : `Lenovo`}})
    const result =  await this.productsRepository.find({ where: { name: ILike(`%${searchValue}%`) } })
    console.log("== result : ", result);
    return result;
   }



  // this is for jwt authentication login .. called in seller-auth.service.ts
  async findOneByEmail(email: string): Promise<Seller> {
    if (email != null && email != undefined) {
        try {
            return await this.sellersRepository.findOneOrFail({
                where: { sellerEmailAddress : email }
            });
        } catch (error) {
            // Handle the error when the seller with the given email is not found.
            throw new Error(`Seller with email ${email} not found`);
        }
    }
    // Handle the case when email is null or undefined (optional).
    return null;
}

  // 4 done 🟢🔴 // kichu field er logic add korte hobe .. kono error nai 
  async update(id: number, updateSellerDto: UpdateSellerDto) : Promise<Seller | string>  {
    // let seller = this.sellers.find(seller => seller.id === id);
    // seller = {...seller, ...updateSellerDto}; // ⭕ Industry te bad practice 
    const seller = await this.findOne(id); //🟢 findOneOrFail use korte hobe ..
    //console.log("///////////////////////////////////",seller)
    console.log("///////////////////////////////////updateSellerDto from service : ",id,updateSellerDto)
    if(seller == undefined){
      throw new NotFoundException();
    }
    if (seller){

      // better hoito ekta object banaye .. sheta return kora .. 
      

      // if(updateSellerDto.id){
      //   seller.id = seller.id;  
         
      // }
      if(updateSellerDto.sellerName){ // check
        seller.sellerName = updateSellerDto.sellerName;
      }
      if(updateSellerDto.sellerEmailAddress){// check
        seller.sellerEmailAddress = updateSellerDto.sellerEmailAddress;
      }
  
      if(updateSellerDto.sellerPassword){// check
        seller.sellerPassword = updateSellerDto.sellerPassword;
      }
      if(updateSellerDto.sellerPhoneNumber){ // check
        seller.sellerPhoneNumber =  updateSellerDto.sellerPhoneNumber;
      }
      if(updateSellerDto.sellerDescription){ // check
        seller.sellerDescription = updateSellerDto.sellerDescription;
      }
      if(updateSellerDto.shopName){
        seller.shopName = updateSellerDto.shopName;
      }
      if(updateSellerDto.shopDescription){
        seller.shopDescription = updateSellerDto.shopDescription;
      }
      
      if(updateSellerDto.status){
        seller.status = updateSellerDto.status;
      }

      if(updateSellerDto.rating){
        seller.rating = updateSellerDto.rating;
      }
      
      if(updateSellerDto.offlineShopAddress){
        seller.offlineShopAddress = updateSellerDto.offlineShopAddress;
      }
      
      if(updateSellerDto.googleMapLocation){
        seller.googleMapLocation = updateSellerDto.googleMapLocation;
      }
      
      const r =  await this.sellersRepository.save(seller);
      console.log(r);
      return this.findOne(id); // 😥
      // return r;
    }else{
      throw new HttpException(
        {
          status : HttpStatus.NOT_FOUND, // statusCode - 401
          error : "Cant find that user.", // short description
        }, 
        HttpStatus.NOT_FOUND // 2nd argument which is status 
        );
    }
    
  }

  // 5 done 🟢🟢
  async remove(id: number) : Promise<Seller> { // DeleteResult rakha jabe na 

    // this method is used for delete array element
    // const newArray =  this.sellers.filter(seller => seller.id !== id); // this actually returns new array 
    //this.sellers = newArray;
    
    const sellerToDeleted = await this.findOne(id); // string or number ? 😥

    if(sellerToDeleted == undefined){
      throw new NotFoundException();
    }
    return this.sellersRepository.remove(sellerToDeleted); // delete method use kora jabe na 
    
    
    //return this.sellers;
    
  }

  // 🏠
  async deleteProduct(id: number)  { // DeleteResult rakha jabe na 
    //: Promise<Product>
    
    const productToDeleted = await this.findOneProduct(id); // string or number ? 😥

    if(productToDeleted == undefined){
      throw new NotFoundException();
    }
    console.log("from service for delete product : ", productToDeleted)
    const deletedResult =  this.productsRepository.remove(productToDeleted); // delete method use kora jabe na 
    if(deletedResult){
      return "Successful";
    }
  }


  //8 🟢🔴 // id cant assign manually .. id set automatically
  async createNewProduct(createProductDto) : Promise<Product>{
    let newProduct;
    
    if(createProductDto.id){
      // newProduct = { id : createProductDto.id, ...createProductDto}// 🔴id cant assign manually
      newProduct = {...createProductDto}
    }else{
     
      // newProduct = {id: Date.now(), ...createProductDto}
      newProduct = {
        id: Date.now(), //
        name: createProductDto.name, //
        details: createProductDto.details, //
        // productImage
        price: createProductDto.price, //
        availableQuantity: createProductDto.availableQuantity, //
        lowestQuantityToStock: createProductDto.lowestQuantityToStock, //
        Category: createProductDto.category, ////////////////////////////////// 🔰 important ....... Category likhte hobe 
        //Brand: createProductDto.brand,
        /////sellerId: createProductDto.sellerId, // sellerid o front-end theke send korte hobe .. je kon seller product ta add korse 
        
      }
    }
    
    console.log(newProduct);
    await this.productsRepository.save(newProduct);
    
    return newProduct;
  }


  // 13 🟢🟢
  addAvailableQualityOfAProduct(createAvailableQualityOfAProductDto){
    this.availableQualitysRepository.create(createAvailableQualityOfAProductDto);
    this.availableQualitysRepository.save(createAvailableQualityOfAProductDto);
    // return {
    //   message : `New Available Quality Added`,
    //   data : createAvailableQualityDto,
    // }
    return createAvailableQualityOfAProductDto;
  }

  // 14 🟢🟢
  async getAllProductsDetails(){

    return await this.productsRepository.find();
  }

  //🏠
  async getAllCategory(){

    return await this.categoriesRepository.find();
  }
  // 🏠
  async getAllBrand(){

    return await this.brandsRepository.find();
  }

  // 🏠
  async saveCategory(id:any, createCategory:any){
    /// seller id ta diye seller ke khuje ber korte hobe .. 
    // seller er categoriesCategoryID er moddhe category id gula save korte hobe ..

    // createCategory er moddhe array of categoryId ashbe .. 
    /**
     * category id gular upor loop chaliye .. category id and seller id database e save korte hobe.. 
     */

    const seller = await this.sellersRepository.findOne({where: {id: id}});

    // if seller found , then save category id and seller id in database ..
    if(seller){
      // seller.categoriesCategoryID = createCategory;
      // await this.sellersRepository.save(seller);
      // return seller;
      //return await this.sellersRepository.update(id,createCategory);

      console.log("seller is found from saveCategory service : ..", seller);

      const res =await createCategory.map(  async(categoryId :any) => {
        //console.log("categoryId : ..", categoryId);
        
        const res2 = await this.productCategoryRepository.create({
          sellerId:id,
          categoryId:categoryId
        });
        if(res2){
          console.log("creation done ")
          this.productCategoryRepository.save(res2);
        }
        
      })

      
      console.log("done from saveCategory service");


    }


    //return await this.sellersRepository.update(id,createCategory);
  }

  // 🏠
  async getSelectedCategoryForSeller(sellerId:any){

    const seletedCategories = await this.productCategoryRepository.find({where: {sellerId: sellerId}});
    //const seletedCategories = await this.productCategoryRepository.find();
    //console.log("getSelectedCategoryForSeller service", seletedCategories)
    return seletedCategories;
  }

// 🏠
async getAProductsDetailsById(productId: number){

  return await this.productsRepository.findOneOrFail({where: {id: productId}});
}


  // 🟢
  async getAllProductsDetailsBySellerId(sellerId: number){

    return await this.productsRepository.find({where: {sellerId: sellerId}});
  }

  // 15 🟢🟢
  async addSpecificationOfAProduct(addSpecificationOfAProductDto){
     // kono ekta category er product er jonno specification er title gula show korbe 
  // so, kono ekta category er product er jonno specification title add korte hobe .. 

    //this.availableSpecificaitonsRepository.create(addSpecificationOfAProductDto);
    this.availableSpecificaitonsRepository.save(addSpecificationOfAProductDto);
    
    return addSpecificationOfAProductDto;
  }


  // 16  🟢🟢

  async addReviewToAProduct(createReviewDto){
    const newReview = {...createReviewDto} ;
    //this.reviewsRepository.create(newReview);
    this.reviewsRepository.save(newReview);
    // 🔴 error handle kora hoy nai 
    return newReview;
    // return 
  }

  
  // 17 🟢🟢 
  async addReplyToAReview(createReviewReplyDto){
    
    let newReviewReply = {...createReviewReplyDto} ;
    //this.reviewRepliesRepository.create(newReviewReply);
    this.reviewRepliesRepository.save(newReviewReply);
    // 🔴 error handle kora hoy nai 
    return newReviewReply;
    // return 
  }

  async getAllGeneralReview(sellerId){
    //console.log("seller id from front-end from service: ", sellerId)
    const reviews = await this.reviewsRepository.find({where:{sellerIdObject : sellerId, reviewCategory : ReviewCategoryEnum.General}});//{where:{sellerId : sellerId}}
    //console.log("reviews from service : ", reviews);
    return reviews;
  }

  //🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠🏠
  async getAllAfterSalesReview(sellerId){
    //console.log("seller id from front-end from service: ", sellerId)
    // const AfterSales = "getAllAfterSalesReview";
    const reviews = await this.reviewsRepository.find({where:{sellerIdObject : sellerId, reviewCategory : ReviewCategoryEnum.AfterSalesExperience} });//{where:{sellerId : sellerId}}
    //console.log("reviews from service : ", reviews);
    return reviews;
  }

  async deleteReviewByReviewId(reviewId){
    const review = await this.reviewsRepository.findOneOrFail({where:{reviewId : reviewId}});
    if(review){
      const deletedReview = await this.reviewsRepository.remove(review);
      return deletedReview;
    }
  }


  // 🏠
  async doLikeDislikeToAReview(reviewId, sellerId, likeDislikeStatusComingFromFE){
    //console.log("from service : ", reviewId, sellerId, likeDislikeStatusComingFromFE);
    const data = await this.likeDislikeRepository.find({where:{review:{reviewId}, seller: { id: sellerId } }})

    const review = await this.reviewsRepository.findOneOrFail({where:{reviewId : reviewId}});
    // console.log(data)
    console.log("----0--- likeDislikeStatusComingFromFE : ", likeDislikeStatusComingFromFE)
    if(data.length == 0){
      //data does not exist .. 
      // create korte hobe .. 
      // lets create 

      const data =  await this.likeDislikeRepository.save({
        type: likeDislikeStatusComingFromFE,
        seller:sellerId,
        review : reviewId
      })

      if(likeDislikeStatusComingFromFE == "like"){
        review.likeCount = review.likeCount + 1;
        await this.reviewsRepository.save(review);
      }else{
        review.disLikeCount = review.disLikeCount + 1;
        await this.reviewsRepository.save(review);
      }
      
      //console.log("Like done")
      console.log("----1---data do not exist .. create new entry")
    }else{
      // like dislike kichu ekta kora ase .. 
      // dekhte hobe ki kora ase .. 

      
      const reactionFromDB =  data.map((data) =>  data.type)
      console.log("----1---data exist .. reactionFromDB : ", reactionFromDB)
      
      console.log( reactionFromDB[0])
      if((reactionFromDB[0] == "like") && (likeDislikeStatusComingFromFE == "like")){
        console.log("change type -> normal");
        // const data =  await this.likeDislikeRepository.save({
        //   type: "normal",
        //   seller:sellerId,
        //   review : reviewId
        // })
        data.map((data) =>  {
          data.type = "normal";
          this.likeDislikeRepository.save(data);
        })

        review.likeCount = review.likeCount - 1;
        await this.reviewsRepository.save(review);
        
      }else if((reactionFromDB[0] == "dislike") && (likeDislikeStatusComingFromFE == "dislike")){
        console.log("change type -> normal");
        data.map((data) =>  {
          data.type = "normal";
          this.likeDislikeRepository.save(data);
        })

        review.disLikeCount = review.disLikeCount - 1;
        await this.reviewsRepository.save(review);

      }else if((reactionFromDB[0] == "normal") && (likeDislikeStatusComingFromFE == "like")){
        console.log("change type -> like");
        data.map((data) =>  {
          data.type = "like";
          this.likeDislikeRepository.save(data);
        })

        review.likeCount = review.likeCount + 1;
        await this.reviewsRepository.save(review);

      }else if((reactionFromDB[0] == "normal") && (likeDislikeStatusComingFromFE == "dislike")){
        console.log("change type -> dislike");
        data.map((data) =>  {
          data.type = "dislike";
          this.likeDislikeRepository.save(data);
        })

        review.disLikeCount = review.disLikeCount + 1;
        await this.reviewsRepository.save(review);
      }else if((reactionFromDB[0] == "like") && (likeDislikeStatusComingFromFE == "dislike")){
        console.log("change type -> dislike");
        data.map((data) =>  {
          data.type = "dislike";
          this.likeDislikeRepository.save(data);
        })
        review.likeCount = review.likeCount - 1;
        review.disLikeCount = review.disLikeCount + 1;
        await this.reviewsRepository.save(review);
      }else if((reactionFromDB[0] == "dislike") && (likeDislikeStatusComingFromFE == "like")){
        console.log("change type -> like");
        data.map((data) =>  {
          data.type = "like";
          this.likeDislikeRepository.save(data);
        })

        review.disLikeCount = review.disLikeCount - 1;
        review.likeCount = review.likeCount + 1;
        await this.reviewsRepository.save(review);
      }
      
    }
    /////////console.log('data from like dislike', data)
    /**
     * 
     * like korte chaile 
     * review id and seller id and "like" er against  e
     * dekhbe likeDislike entity te kono entry ase kina 
     * 
     * kono data na pele .. 
     * 
     * like korbo 
     * 
     * and review entity te like count increase korbo
     * 
     * and jodi data pai .. like korte chaile
     *  check korbo sheta 
     * like naki dislike .. 
     * 
     * 
     * like hoile dislike korbo 
     * dislike hoile like korbo 
     * 
     * normal hoile like korbo 
     * 
     * 
     * 
     */



  }

  // 9 done partially
  checkForStockAndsendStockLessNotification(){
    /*
    const stockLessProducts = this.products.filter(product => product.availableQuantity <= product.lowestValueToStock);
    if(stockLessProducts.length > 0){
      // create a notification
      const newNotification = {
        notificationId : Date.now(),
        notificationDetails : `Stock Less Product Found : `+ stockLessProducts.toString(), // 🔰 product er id gula return korte hobe .. 
      }

      // push notification to notification array
      this.notifications.push(newNotification);
      
      return newNotification;
    }
*/
    return `No Stock Less Product Found`;
  }

  // 9 🟢🟢
  async checkForLowQuantity(){
    // custom query
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .where('product.availableQuantity <= product.lowestQuantityToStock')
      .getMany();
    
    
    return products.map((product) => ({
      id: product.id,
      name: product.name,
      availableQuantity: product.availableQuantity,
      lowestValueToStock: product.lowestQuantityToStock,
    }))
    // error handling korte hobe .. 
  }



  // 10  🟢🟢
  async getAllNegetiveReview(){
    // amar product id gula dorkar 
    /**
     * seller er under e joto gula product er negative review ase
     * shegular product name, id and negetive review gula show korbe  
     */
    const products = await this.productsRepository
      .createQueryBuilder('product')
      .select(['product.id', 'product.name'])
      .leftJoin('product.reviews', 'review')
      .where('review.reviewCategory = :category', { category: ReviewCategoryEnum.NegetiveReview })
      .addSelect(['review.reviewDetails'])
      .getMany();

  return products;
  
  }

  // 11 done partially
  getOrderStatusPending(){
    /*
    const orderStatusPending = this.Order.filter(preOrder => preOrder.orderStatus === OrderStatusEnum.OrderPending);
    if(orderStatusPending.length > 0){
      return orderStatusPending;
    }
    */
    return `No Order Status Pending Found`;
  }

  //12 done partially
  getPaymentCompleteStatusOfPreOrder(){
    /*
    const paymentComplete = this.Order.filter(preOrder => preOrder.orderStatus === PaymentStatusEnum.PaymentComplete);
    if(paymentComplete.length > 0){
      // 🔰 jader payment complete tader details chole ashbe .. 
      return paymentComplete; 
    }
    */
    return `No Payment Complete Status Found`;
  }

  // 
  // postImage(file){
  //   console.log(file);
  // }

  
  

  // send email 
  async sendEmail(to, emailSubject, emailBody){
    try{
      await this.mailerService.sendMail({
        to: to,
        subject: emailSubject,
        text: emailBody
        });
    }
    catch(err){
      console.log(err);
    }
    
  }
}
