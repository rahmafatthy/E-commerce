let exitButton = document.getElementById("exitBtn");

async function productInfo(productId) {
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${productId}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error fetching product with ID ${productId}:`, error);
    return null;
  }
}

window.onload = () => {
  if (exitButton) {
    exitButton.addEventListener("click", () => {
      window.location.replace("index.html");
    });
  }
};
document.addEventListener('DOMContentLoaded', async () => {
  const favoriteGrid = document.getElementById('favoriteGrid');
  const favoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];

  if (favoriteProducts.length === 0) {
    favoriteGrid.innerHTML = '<p class="text-center">You have no favorite products.</p>';
    return;
  }

  for (const productId of favoriteProducts) {
    const product = await productInfo(productId);
    if (!product) continue;

    const productDiv = document.createElement('div');
    productDiv.className = 'container col-12 mb-3';

    productDiv.innerHTML = `
      <div class="card h-100 w-100 text-start shadow border-0 d-flex flex-column justify-content-between" data-product-id="${product.id}">
        <div class="card-body d-flex align-items-center gap-2 card-content" style="cursor: pointer;">
          <img src="${product.imageCover}" alt="${product.title}" class="img-thumbnail" style="width: 60px; height: 60px; object-fit: cover;">
          <div class="flex-grow-1">
            <h6 class="mb-1">${product.title}</h6>
            <p class="mb-0 text-muted small">${product.price} EGP</p>
          </div>
          <button class="btn p-1 fav-btn" title="Remove from favorites">
            <i class="bi bi-heart-fill" style="color:#9c7956;"></i>
          </button>
        </div>
      </div>
    `;

    favoriteGrid.appendChild(productDiv);
    const button = productDiv.querySelector('.fav-btn');
    button.addEventListener('click', (event) => {
      event.stopPropagation(); 
      removeFromFavorites(product.id);
    });
    const cardContent = productDiv.querySelector('.card-content');
    cardContent.addEventListener("click", () => {
      localStorage.setItem("selectedProductId", product.id);
      window.location.href = "product.html";
    });
  }
});

function removeFromFavorites(productId) {
  let favorites = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
  favorites = favorites.filter(id => id !== productId);
  localStorage.setItem('favoriteProducts', JSON.stringify(favorites));

  const productDiv = document.querySelector(`[data-product-id="${productId}"]`);
  if (productDiv) productDiv.remove();

  if (favorites.length === 0) {
    document.getElementById('favoriteGrid').innerHTML = '<p class="text-center">You have no favorite products.</p>';
  }
}
