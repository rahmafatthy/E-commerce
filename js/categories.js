import { getProducts } from "./get-products.js";

let container = document.getElementById("categories-container");
let categoriesList = [];
let sortHighToLow = document.getElementById("sortPriceHighToLow");
let sortLowToHigh = document.getElementById("sortPriceLowToHigh");
let ProductGrid = document.getElementById("Product-grid");
const apiUrl = "https://ecommerce.routemisr.com";

let currentCategoryId = null;
let currentSort = null;

async function getCategories() {
  try {
    const response = await fetch(`${apiUrl}/api/v1/categories`);
    const data = await response.json();

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
  }
}

function scrollingButtons() {
  const container = document.getElementById("categories-container");

  document.getElementById("leftBtn").onclick = () => {
    container.scrollBy({ left: -200, behavior: "smooth" });
  };

  document.getElementById("rightBtn").onclick = () => {
    container.scrollBy({ left: 200, behavior: "smooth" });
  };
}

async function loadProducts(categoryId = currentCategoryId, sort = currentSort,searchTerm="") {
  ProductGrid.innerHTML = "";

  let sortOption = null;
  if (sort === "sortLowToHigh") sortOption = "asc";
  else if (sort === "sortHighToLow") sortOption = "desc";

  currentCategoryId = categoryId;
  currentSort = sort;

  await getProducts(null, categoryId, sortOption,searchTerm);
}

async function getSpecificCategory(categoryId) {
  await loadProducts(categoryId, currentSort);
}

sortLowToHigh.addEventListener("click", () => {
  loadProducts(currentCategoryId, "sortLowToHigh");
});

sortHighToLow.addEventListener("click", () => {
  loadProducts(currentCategoryId, "sortHighToLow");
});

document.addEventListener("DOMContentLoaded", () => {
  getCategories();
  loadProducts();
});
document.getElementById("searchButton").addEventListener("click",()=>{
    let searchValue=document.getElementById("searchInput").value.trim();
    loadProducts(currentCategoryId,currentSort,searchValue);
});
document.getElementById("searchInput").addEventListener("keypress",(e)=>{
if(e.key==="Enter"){
    document.getElementById("searchButton").click();
}
});
