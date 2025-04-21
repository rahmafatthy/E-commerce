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

//getting products from api
let ProductGrid = document.getElementById("Product-grid");
async function getProducts() {
  try {
    let response = await fetch(`${apiUrl}/api/v1/products`);
    let data = await response.json();
    let limitedProducts = data.data.slice(0, 15);
    limitedProducts.forEach((product) => {
      let productDiv = document.createElement("div");
      productDiv.className = "col";
      let card = document.createElement("div");
      card.className = "card h-100 text-start shadow-sm border-0";
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
      cartBtn.addEventListener("click", () => {
        cartContainer.innerHTML = "";
        const minusBtn = document.createElement("button");
        minusBtn.className = "btn btn-sm btn-outline-secondary cartBtn";
        minusBtn.textContent = "−";
        let quantity = document.createElement("span");
        quantity.className = "px-1";
        quantity.textContent = "1";
        quantity.style.color="#9c7956";
        let count = 1;
        const plusBtn = document.createElement("button");
        plusBtn.className = "btn btn-sm btn-outline-secondary cartBtn";
        plusBtn.textContent = "+";
        minusBtn.addEventListener("click", () => {
          if (count > 1) {
            count--;
            quantity.textContent = count;
          } else {
            cartContainer.innerText = "";
            cartContainer.append(cartBtn);
          }
        });
        plusBtn.addEventListener("click", () => {
          count++;
          quantity.textContent = count;
        });
        cartContainer.appendChild(minusBtn);
        cartContainer.appendChild(quantity);
        cartContainer.appendChild(plusBtn);
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
    });
  } catch (error) {
    console.log(error);
  }
}
getProducts();
