import { addToCart } from "./add_to_cart.js";
import { showCartControls } from "./get-products.js";
const images = [];
const sliderImg = document.getElementById("sliderImage");
const sliderDots = document.getElementById("slider-dots");
const title = document.getElementById("title");
const description = document.getElementById("Description");
const price = document.getElementById("price");
const rate = document.getElementById("rating");
const brand = document.getElementById("brand");
const quantity = document.getElementById("Quantity");
const reviews = document.getElementById("reviews");
const addToCartBtn = document.getElementById("addToCart");

let exitButton=document.getElementById("exitBtn");

export async function productData(productId) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products/${productId}`
    );
    const data = await response.json();
    const product = data.data;

    images.length = 0;
    sliderDots.innerHTML = "";

    product.images.forEach((img, index) => {
      images.push(img);
      const dot = document.createElement("div");
      dot.className = index === 0 ? "dot active shadow" : "dot shadow";
      dot.setAttribute("data-index", index);
      sliderDots.appendChild(dot);

      dot.addEventListener("click", () => {
        sliderImg.src = images[index];
        document
          .querySelectorAll(".dot")
          .forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
      });
    });

    if (images.length > 0) {
      sliderImg.src = images[0];
    }
    title.textContent = product.title;
    description.innerHTML = `<strong>Description: </strong> ${product.description}`;
    price.textContent = `Price: ${product.price} EGP`;
    brand.textContent = `Brand: ${product.brand.name}`;
    reviews.textContent = `Reviews: ${product.reviews}`;
    quantity.textContent = `Available Quantity: ${product.quantity}`;
    const fullStars = Math.floor(product.ratingsAverage);
    const halfStar = product.ratingsAverage % 1 >= 0.5;
    let starsHTML = "";
    for (let i = 0; i < fullStars; i++)
      starsHTML += '<i class="bi bi-star-fill" style="color: gold;"></i>';
    if (halfStar)
      starsHTML += '<i class="bi bi-star-half" style="color: gold;"></i>';
    rate.innerHTML = `Rating: ${starsHTML} (${product.ratingsAverage})  `;

    addToCartBtn.onclick = () => {
      addToCart(productId);
      const cartWrapper = document.createElement("div");
      cartWrapper.className = addToCartBtn.className;
      cartWrapper.style.backgroundColor = "#fff";
      cartWrapper.style.border = "1px solid #9c7956";
      addToCartBtn.replaceWith(cartWrapper);
      showCartControls(cartWrapper, addToCartBtn, productId);
    };
  } catch (error) {
    console.error("Failed to load product data:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const productId = localStorage.getItem("selectedProductId");
  if (productId) {
    productData(productId);
  } else {
    console.error("No product ID found in localStorage.");
  }
});
exitButton.addEventListener("click",()=>{
window.location.replace("index.html");
});