export async function getAllBrands(){
let response = await fetch("https://ecommerce.routemisr.com/api/v1/brands");
let data =await response.json();
let brandList=[];
data.data.forEach((brand) => {
    brandList.push(brand.name);
});
return brandList;
}
// export async function getSpecificBrand(brandId){
//     let response = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${brandId}`);
//     let data =response.json();
//     let requiredBrand;
//     data.data.forEach((brand)=>{
//         if(brand===)
//     });
//     return brandList;
//     }
    