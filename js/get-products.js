import { addToCart, removeFromCart, updateQuantity } from "./add_to_cart.js";
let ProductGrid = document.getElementById("Product-grid");
const user = JSON.parse(localStorage.getItem("user"));

export async function getProducts(
  maxValue,
  categoryId,
  sortOrder,
  searchTerm = "",
  brand,
  maxPriceValue

) {
  const loader = document.getElementById('loader');


  loader.style.display = 'block';

  try {
    let response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/products`
    );
    if(response.ok){
      ProductGrid.style.display='';

    }
    let data = await response.json();
    let filteredProducts = categoryId
      ? data.data.filter((product) => product.category._id === categoryId)
      : data.data;
      if (searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter((product) =>
          product.title.toLowerCase().includes(lowerSearch) ||
          product.description.toLowerCase().includes(lowerSearch)
        );
      }
    let limitedProducts = maxValue
      ? filteredProducts.slice(0, maxValue)
      : filteredProducts;
     
    if (sortOrder === "asc") {
      limitedProducts.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      limitedProducts.sort((a, b) => b.price - a.price);
    }
    if(brand){
      limitedProducts= limitedProducts.filter((product)=>product.brand.name===brand);

    }
    if(maxPriceValue){
      limitedProducts = limitedProducts.filter((product) => {
        return product.price && product.price <= maxPriceValue;
      });
    }
    limitedProducts.forEach((product) => {
      let productDiv = document.createElement("div");
      productDiv.className = "col-sm-6 col-md-4 col-lg-3 mb-4";

      let card = document.createElement("div");
      card.className = "card h-100 text-start shadow border-0";
      let productImg = document.createElement("img");
      productImg.className = "card-img-top object-fit-contain";
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
      let favBtn=document.createElement("button");
      favBtn.className =
      "btn p-0 m-0  fs-6 border-0 d-flex align-items-center  small";
      favBtn.innerHTML=`<i class="bi bi-heart" style="color:#9c7956;"></i>`;
      ProductGrid.appendChild(productDiv);
      productDiv.appendChild(card);
      card.appendChild(productImg);
      cardContent.appendChild(price);
      cartContainer.appendChild(cartBtn);
      cardContent.appendChild(favBtn);
      cardContent.appendChild(cartContainer);
      cardBody.appendChild(title);
      cardBody.appendChild(cardContent);
      card.appendChild(cardBody);
      const favorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];
      const isFavorite = favorites.includes(product.id);
      favBtn.innerHTML = `<i class="bi bi-heart${isFavorite ? '-fill' : ''}" style="color:#9c7956;"></i>`;
      favBtn.addEventListener("click", () => {
        if (!user || !user.token) {
          window.location.href = "login.html";
        } else {

          const favorites = JSON.parse(localStorage.getItem("favoriteProducts")) || [];
          if (!favorites.includes(product.id)) {
            favorites.push(product.id);
            localStorage.setItem("favoriteProducts", JSON.stringify(favorites));
            favBtn.innerHTML = `<i class="bi bi-heart-fill" style="color:#9c7956;"></i>`;
          } else {
            const updatedFavorites = favorites.filter(id => id !== product.id);
            localStorage.setItem("favoriteProducts", JSON.stringify(updatedFavorites));
            favBtn.innerHTML = `<i class="bi bi-heart" style="color:#9c7956;"></i>`;
          }
        }
      });

      productImg.addEventListener("click", () => {
        localStorage.setItem("selectedProductId", product.id);
        window.location.href = "product.html";
      });
    });
  } catch (error) {
    console.log(error);
  }finally {
    loader.style.display = 'none'; 
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
    cartBtn.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}

