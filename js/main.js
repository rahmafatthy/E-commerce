import { getProducts } from "./get-products.js";
const loginBtnInHomeScreen = document.getElementById("login");
const seeMore=document.getElementById("cart-list");
const user = JSON.parse(localStorage.getItem("user"));
const apiUrl = "https://ecommerce.routemisr.com";
if(user&&user.token){
  loginBtnInHomeScreen.textContent = "Logout";
  loginBtnInHomeScreen.addEventListener("click", () => {
    localStorage.removeItem("user");
   setTimeout(() => {
    window.location.replace("index.html");
  }, 100); 
  });
}
else{
    loginBtnInHomeScreen.textContent = "Login";
  loginBtnInHomeScreen.addEventListener("click", () => {
    window.location.href = "login.html";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 0;
  let slides = document.querySelectorAll(".slide");
  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) {
        slide.classList.add("active");
      }
    });
  }
  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }
  showSlide(currentSlide);
  setInterval(nextSlide, 3000);
});
seeMore.addEventListener("click",()=>{
  window.location.href="all_product.html";
  getProducts();
  });


//getting products from api in get products file 
getProducts(15);
