import { getProducts } from "./get-products.js";
const loginBtnInHomeScreen = document.getElementById("login");

const user = JSON.parse(localStorage.getItem("user"));
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

//getting categories from API
let categoriesList = [];
const apiUrl = "https://ecommerce.routemisr.com";
async function getCategories() {
  try {
    const response = await fetch(`${apiUrl}/api/v1/categories`);
    if (!response.ok) {
      throw new Error("Network response not ok");
    }
    let data = await response.json();
    let container = document.getElementById("categories-container");
    data.data.forEach((category) => {
      let categoryDiv = document.createElement("div");
      categoryDiv.className = "category text-center";
      let categoryImageDiv = document.createElement("div");
      categoryImageDiv.className = "rounded-circle mb-3";
      let categoryImg = document.createElement("img");
      categoryImg.className = "category-img rounded-circle";
      categoryImg.src = category.image;
      categoryImageDiv.appendChild(categoryImg);
      let title = document.createElement("h3");
      title.className = "text-center fs-6 fw-600";
      title.textContent = category.name;
      categoryDiv.appendChild(categoryImageDiv);
      categoryDiv.appendChild(title);
      categoriesList.push(category.name);
      container.appendChild(categoryDiv);
    });
    scrollingButtons();
  } catch (error) {
    console.log(error);
  }
}
getCategories();

//handle scrolling categories with buttons
function scrollingButtons() {
  let scrollDiv = document.getElementById("categories-container");
  let leftBtn = document.getElementById("leftBtn");
  let rightBtn = document.getElementById("rightBtn");
  function updateButtons() {
    leftBtn.style.display = scrollDiv.scrollLeft > 0 ? "block" : "none";
    const maxScrollLeft = scrollDiv.scrollWidth - scrollDiv.clientWidth;
    rightBtn.style.display =
      scrollDiv.scrollLeft < maxScrollLeft - 5 ? "block" : "none";
  }
  scrollDiv.addEventListener("scroll", updateButtons);
  window.addEventListener("resize", updateButtons);
  updateButtons();
  leftBtn.addEventListener("click", () => {
    scrollDiv.scrollBy({ left: -200, behavior: "smooth" });
  });
  rightBtn.addEventListener("click", () => {
    scrollDiv.scrollBy({ left: 200, behavior: "smooth" });
  });
}

//getting products from api in get products file 
getProducts(15,apiUrl);
