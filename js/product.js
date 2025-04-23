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

export async function productData(productId) {
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`);
    const data = await response.json();
    images.length = 0;
    sliderDots.innerHTML = "";
    data.data.images.forEach((img, index) => {
      images.push(img);

      const dot = document.createElement("div");
      dot.className = index === 0 ? "dot active shadow" : "dot shadow";
      dot.setAttribute("data-index", index);
      sliderDots.appendChild(dot);

      dot.addEventListener("click", () => {
        sliderImg.src = images[index];
        document.querySelectorAll(".dot").forEach((d) => d.classList.remove("active"));
        dot.classList.add("active");
      });
    });
    if (images.length > 0) {
        sliderImg.src = images[0];
      }
    title.textContent = data.data.title;
    description.innerHTML = `<strong>Description: </strong> ${data.data.description}`;
    price.textContent = `Price: ${data.data.price} EGP`;
    brand.textContent = `Brand: ${data.data.brand["name"]}`;
 
    reviews.textContent =`Reviews: ${data.data.reviews}`;
    quantity.textContent = `Available Quantity: ${data.data.quantity}`;
    const fullStars = Math.floor(data.data.ratingsAverage);
const halfStar = data.data.ratingsAverage % 1 >= 0.5;

let starsHTML = '';
for (let i = 0; i < fullStars; i++) starsHTML += '<i class="bi bi-star-fill"></i>';
if (halfStar) starsHTML += '<i class="bi bi-star-half"></i>';
rate.innerHTML = `<strong>Rating:</strong> <span class="rating">${starsHTML}</span> (${data.data.ratingsAverage} / 5)`;

  } catch (error) {
    console.error("Error fetching product data:", error);
    alert("Failed to load product details. Please try again later.");
  }
}
