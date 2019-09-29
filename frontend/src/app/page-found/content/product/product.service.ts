import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment.prod';
import { MiddlewareService } from 'src/app/middleware.service';

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  constructor(private httpClient: HttpClient,private middlewareService: MiddlewareService) {
    // environment.apiUrl ='http://localhost:8080';
  }


  getAllProduct() {
    return this.middlewareService.select('viewAllProducts', '', '', '');
  }
  getProductDetail(id) {
    return this.middlewareService.select('viewAllProducts','id=\'' + id+ '\' ', '', '');
  }
  checkExistingProduct(name) {
    return this.middlewareService.select('viewAllProducts','product_description=\'' + name+ '\' ', '', '');
  }
  insertProduct(product_regi: any) {
    return this.middlewareService.insert('product',
    "brand_id, size_id, clotth_id, product_description, gender, notes, userid,alert_qty,status",
    '(\'' + product_regi.brand.id + '\', \'' + product_regi.size.id  + '\', \'' + product_regi.cloth.id + '\', \'' + product_regi.product.product_description + '\', \'' +  product_regi.product.gender + '\', \'' + product_regi.product.notes + '\', \'' +  product_regi.product.userid + '\',\'' +  product_regi.product.alert_qty + '\',\'' +  product_regi.product.status + '\' )',
  );
  } 
  getProductlastInsertId() {
    return this.middlewareService.select('getMaxProductId',  '', '', '');
  }
  updateProduct(product_regi: any) {

    return this.middlewareService.update('product',
  'brand_id=\'' + product_regi.brand.id + '\', size_id=\'' +  product_regi.size.id + '\', clotth_id=\'' +product_regi.cloth.id + '\', product_description=\'' + product_regi.product.product_description + '\', gender=\'' + product_regi.product.gender + '\', notes=\'' +product_regi.product.notes+ '\', userid=\'' + product_regi.product.userid + '\', alert_qty=\'' +product_regi.product.alert_qty+ '\', status=\'' +product_regi.product.status+ '\'',
  'id=\'' + product_regi.product.id + '\' ',
  );
  }

  deleteProduct(product: any) {
    return this.middlewareService.update('product',
    'status=\'0\'',
    'id=\'' + product.id + '\' ',
  );
  }


  ///////////////////////////// Brand
  getAllBrands() {
    return this.middlewareService.select('viewAllBrands', '', '', '');
  }
  getBrandName(id) {
    return this.middlewareService.select('viewAllBrands', 'id=\'' + id+ '\' ', '', '');
  }
  checkExistingBrand(name) {
    return this.middlewareService.select('viewAllBrands', 'brand_name=\'' + name+ '\' ', '', '');
  } 
  
  getlastInsertId() {
    return this.middlewareService.select('getMaxBrandId',  '', '', '');
  }
  insertBrand(brand: any) {
    return this.middlewareService.insert('brand',
    'name',
    '(\'' + brand.brand_name + '\' )',
  );
  }

   ///////////////////////////// Size
  insertSize(size: any) {
    return this.middlewareService.insert('size',
    'size_name',
    '(\'' + size.size_name + '\' )',
  );
  }
  getSizeName(id) {
    return this.middlewareService.select('viewAllSizes', 'id=\'' + id+ '\' ', '', '');
  }
  checkExistingSize(name) {
    return this.middlewareService.select('viewAllSizes', 'size_name=\'' + name+ '\' ', '', '');
  } 
  getSizelastInsertId() {
    return this.middlewareService.select('getMaxSizeId',  '', '', '');
  }
  getAllSizes() {
    return this.middlewareService.select('viewAllSizes', '', '', '');
  }

   ///////////////////////////// Cloth
   insertCloth(cloth: any) {
    return this.middlewareService.insert('clotth',
    'name',
    '(\'' + cloth.cloth_name + '\' )',
  );
  }
  getClothName(id) {
    return this.middlewareService.select('viewAllCloths', 'id=\'' + id+ '\' ', '', '');
  }
  getClothlastInsertId() {
    return this.middlewareService.select('getMaxClothId',  '', '', '');
  }
  checkExistingCloth(name) {
    return this.middlewareService.select('viewAllCloths', 'name=\'' + name+ '\' ', '', '');
  } 
  getAllCloths() {
    return this.middlewareService.select('viewAllCloths', '', '', '');
  }
}
