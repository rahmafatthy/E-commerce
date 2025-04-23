import { addToCart, removeFromCart, updateQuantity } from "./add_to_cart.js";
import { productData } from "./product.js";
let ProductGrid = document.getElementById("Product-grid");
const user = JSON.parse(localStorage.getItem("user"));

export async function getProducts(maxValue, apiUrl) {
  try {
    let response = await fetch(`${apiUrl}/api/v1/products`);
    let data = await response.json();
    let limitedProducts = maxValue ? data.data.slice(0, maxValue) : data.data;
    limitedProducts.forEach((product) => {
      let productDiv = document.createElement("div");
      productDiv.className = "col";
      let card = document.createElement("div");
      card.className = "card h-100 text-start shadow border-0";
      let productImg = document.createElement("img");
      productImg.className = "card-img-top object-fit-cover";
      productImg.src = product.imageCover;
      let cardBody = document.createElement("div");
      cardBody.className = "card-body";
      let title = document.createElement("h4");
      title.className = "card-title text fs-6 fw-400";
      title.innerText = product.title;
      let cardContent = document.createElement("div");
      cardContent.className =
        "d-flex justify-content-between align-items-center";
      let price = document.createElement("p");
      price.className = "card-text text-muted small";
      price.textContent = `${product.price} EGP`;
      let cartBtn = document.createElement("button");
      cartBtn.className =
        "btn p-0  fs-6 border-0 d-flex align-items-center gap-1 small";
      cartBtn.innerHTML = `<i class="bi bi-cart3"></i>`;
      cartBtn.style.color = "#9c7956";
      let cartContainer = document.createElement("div");
      cartContainer.className = "cartToggle";
      cartBtn.addEventListener("click", (e) => {
     
        showCartControls(cartContainer, cartBtn, product.id);
        addToCart(product.id, product.title, product.imageCover, product.price);
      });
      ProductGrid.appendChild(productDiv);
      productDiv.appendChild(card);
      card.appendChild(productImg);
      cardContent.appendChild(price);
      cartContainer.appendChild(cartBtn);
      cardContent.appendChild(cartContainer);
      cardBody.appendChild(title);
      cardBody.appendChild(cardContent);
      card.appendChild(cardBody);
      card.addEventListener("click", (event) => {
        localStorage.setItem("selectedProductId", product.id); 
        window.location.href = "product.html";
      });
    });
  } catch (error) {
    console.log(error);
  }
}

export function showCartControls(cartContainer, cartBtn, productId) {
  if (user && user.token) {
    cartContainer.innerHTML = "";
    const minusBtn = document.createElement("button");
    minusBtn.className = "btn btn-sm btn-outline-secondary cartBtn";
    minusBtn.textContent = "−";
    let quantity = document.createElement("span");
    quantity.className = "px-1";
    quantity.textContent = "1";
    quantity.style.color = "#9c7956";
    let count = 1;
    const plusBtn = document.createElement("button");
    plusBtn.className = "btn btn-sm btn-outline-secondary cartBtn";
    plusBtn.textContent = "+";
    minusBtn.addEventListener("click", () => {
      if (count > 1) {
        count--;
        quantity.textContent = count;
      } else {
        removeFromCart(productId);
        cartContainer.innerText = "";
        cartContainer.append(cartBtn);
      }
    });
    plusBtn.addEventListener("click", () => {
      count++;
      quantity.textContent = count;
      updateQuantity(productId, count);
    });
    cartContainer.appendChild(minusBtn);
    cartContainer.appendChild(quantity);
    cartContainer.appendChild(plusBtn);
  } else {
    window.location.href = "login.html";
  }
}
