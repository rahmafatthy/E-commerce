import { getProducts } from "./get-products.js";
const seeMore = document.getElementById("seeMore");
const cart=document.getElementById("cart-list");
const loginBtnInHomeScreen = document.getElementById("login-btn-in-home");
const user = JSON.parse(localStorage.getItem("user"));
const userNameElement = document.getElementById("user-name");
if (loginBtnInHomeScreen) {
  if (user && user.token) {
    loginBtnInHomeScreen.innerText = "Logout";
    userNameElement.innerText =user.name.toUpperCase(); 
    userNameElement.style.display = 'inline-block';
    userNameElement.style.color = '#9c7956';
    loginBtnInHomeScreen.innerText = "Logout";
    loginBtnInHomeScreen.addEventListener("click", () => {
      localStorage.removeItem('favoriteProducts'); 
      localStorage.removeItem('user'); 
      window.location.reload(); 
    });
  } else {
    userNameElement.style.display = 'none';
    loginBtnInHomeScreen.innerText = "Login";
    loginBtnInHomeScreen.addEventListener("click", () => {
      window.location.href = "login.html"; 
    });
  }
}
document.addEventListener("DOMContentLoaded", () => {
  let currentSlide = 0;
  let slides = document.querySelectorAll(".slide");

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.remove("active");
      if (i === index) slide.classList.add("active");
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);
  setInterval(nextSlide, 3000); 
});
if (seeMore) {
  seeMore.addEventListener("click", () => {
    window.location.href = "all_product.html";
  });
}
cart.addEventListener("click",()=>{
  if(user&&user.token){

    window.location.href="cart.html";
 
  }
  else{
    
   window.location.href="login.html";
  }
});
getProducts(8);
