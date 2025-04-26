import { getProducts } from "./get-products.js";
import { getAllBrands } from "./get_brands.js";
let allProductContainer=document.getElementById("totalPage");
let container = document.getElementById("categories-container");
let sortHighToLow = document.getElementById("sortPriceHighToLow");
let sortLowToHigh = document.getElementById("sortPriceLowToHigh");
let ProductGrid = document.getElementById("Product-grid");
const apiUrl = "https://ecommerce.routemisr.com";
let brandUl = document.getElementById("brand-list");
const priceSlider = document.getElementById("priceSlider");
const priceValue = document.getElementById("priceValue");
let currentCategoryId = null;
let currentSort = null;
let currentBrand = "";
let maxPriceValue = 0; 

// Main init function
document.addEventListener("DOMContentLoaded", async () => {
  await getCategories();
  await loadProducts();
  await loadBrands();
});

// Load brands
async function loadBrands() {
  let brandList = await getAllBrands();
  brandList.forEach((brand) => {
    let brandChoice = document.createElement("li");
    brandChoice.innerHTML = `<a class="dropdown-item" href="#" id="${brand}">${brand}</a>`;
    brandUl.appendChild(brandChoice);
    brandChoice.addEventListener("click", () => {
      currentBrand = brand; 
      document.getElementById("searchInput").value = "";
      loadProducts(currentCategoryId, currentSort, "", brand);
    });
  });
}

// Get categories and render them
async function getCategories() {
  const loader = document.getElementById('loader');


  loader.style.display = 'block';
  try {
    const response = await fetch(`${apiUrl}/api/v1/categories`);
    const data = await response.json();
    if(response.ok){
      allProductContainer.style.display='';
    }
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

      container.appendChild(categoryDiv);

      categoryDiv.addEventListener("click", () => {
        getSpecificCategory(category._id);
      });
    });

    scrollingButtons();
  } catch (error) {
    console.log(error);
  }finally {
    loader.style.display = 'none'; 
  }
}

// Scrolling buttons functionality
function scrollingButtons() {
  const container = document.getElementById("categories-container");

  document.getElementById("leftBtn").onclick = () => {
    container.scrollBy({ left: -200, behavior: "smooth" });
  };

  document.getElementById("rightBtn").onclick = () => {
    container.scrollBy({ left: 200, behavior: "smooth" });
  };
}

// Load products based on filters



async function loadProducts(categoryId = currentCategoryId, sort = currentSort, searchTerm = "", brand = "", maxPrice = 0) {
  ProductGrid.innerHTML = "";

  let sortOption = null;
  if (sort === "sortLowToHigh") sortOption = "asc";
  else if (sort === "sortHighToLow") sortOption = "desc";

  currentCategoryId = categoryId;
  currentSort = sort;

  if (!maxPrice) {
    priceSlider.value = priceSlider.min;
    priceValue.textContent = `${priceSlider.min} EGP`;
  }

  await getProducts(
    null,               
    categoryId,          
    sortOption,          
    searchTerm,         
    brand,              
    maxPrice            
  );
}

// Filter by category
async function getSpecificCategory(categoryId) {
  await loadProducts(categoryId, currentSort);
}

// Sorting by price (Low to High)
sortLowToHigh.addEventListener("click", () => {
  loadProducts(currentCategoryId, "sortLowToHigh");
});

// Sorting by price (High to Low)
sortHighToLow.addEventListener("click", () => {
  loadProducts(currentCategoryId, "sortHighToLow");
});

// Search button event
document.getElementById("searchButton").addEventListener("click", () => {
  let searchValue = document.getElementById("searchInput").value.trim();
  loadProducts(currentCategoryId, currentSort, searchValue,maxPriceValue);
});

// Search input keypress event
document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchButton").click();
  }
});

// Search input event
document.getElementById("searchInput").addEventListener("input", () => {
  let searchValue = document.getElementById("searchInput").value.trim();
  loadProducts(currentCategoryId, currentSort, searchValue);
});
priceSlider.addEventListener("input", () => {
  priceValue.textContent = `${priceSlider.value} EGP`;
  maxPriceValue = parseInt(priceSlider.value);

  let searchValue = document.getElementById("searchInput").value.trim();
  loadProducts(currentCategoryId, currentSort, searchValue, currentBrand, maxPriceValue);
});
