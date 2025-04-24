const user = JSON.parse(localStorage.getItem("user"));
let exitButton = document.getElementById("exitBtn");

export async function getCartItems() {
  const cartContainer = document.getElementById("cart-container");
  const orderSummary = document.getElementById("orderSummary");

  if (!user || !user.token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        headers: {
          token: user.token,
        },
      }
    );

    const result = await response.json();
    console.log(result);
    if (response.ok) {
      cartContainer.innerHTML = " ";
      orderSummary.innerHTML = " ";

      if (!result.data.products.length) {
        cartContainer.innerHTML = `<p>Your cart is empty.</p>`;
        return;
      }

      result.data.products.forEach((item) => {
        const product = item.product;
        const productDiv = document.createElement("div");
        productDiv.className = "card mb-1";
        productDiv.innerHTML = `
        <div class="row g-0 align-items-center">
          <div class="col-3">
            <img src="${
              product.imageCover
            }" class="img-fluid rounded-start product-img" alt="${
          product.title
        }">
          </div>
          <div class="col-6">
            <div class="card-body">
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text text-muted">${product.category.name}</p>
              <p class="card-text"><small class="text-muted">Price: ${
                item.price
              } EGP</small></p>
            </div>
          </div>
          <div class="col-3 d-flex flex-column align-items-end justify-content-center pe-3">
            <div class="d-flex align-items-center mb-2">
              <button class="btn btn-sm btn-outline-secondary minus " onclick="updateProductQuantity('${
                product._id
              }', ${item.count - 1})">−</button>
              <span class="mx-2">${item.count}</span>
              <button class="btn btn-sm btn-outline-secondary add" onclick="updateProductQuantity('${
                product._id
              }', ${item.count + 1})">+</button>
            </div>
            <button class="btn btn-sm"  onclick="removeProduct('${
              product._id
            }')">
            <i class="bi bi-archive-fill" style="color:#9c7956"></i>
          </button>

          </div>
        </div>
      `;

        cartContainer.appendChild(productDiv);
      });

      orderSummary.innerHTML = `
      <div class="mt-4 p-3 border rounded">
        <h5 class="mb-3" style="color:#9c7956;">Order Summary</h5>
        <div class="d-flex justify-content-between align-items-center">
          <p class="mb-0 fs-6 text-dark">Total: <strong class="fs-6">${result.data.totalCartPrice} EGP</strong></p>
          <button id="checkOut" class="btn btn-sm px-5 py-2" style="background-color: #9c7956; color: white;">Checkout</button>
        </div>
      </div>
    `;
    document.getElementById("checkOut").addEventListener("click", async () => {
      alert("Your Order In Shaping Process");
      try {
        const response = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: user.token,
          },
        });
        const result = await response.json();
        if (response.ok) {
          console.log("Product added:", result);
        } else {
          console.warn("Failed to add product:", result.message);
        }
      } catch (error) {
        console.error("Add to cart error:", error);
      }
      window.location.replace("index.html");
    });
    } else {
      cartContainer.innerHTML = `<p class="text-danger">Error: ${result.message}</p>`;
    }
  } catch (error) {
    //console.error("Add to cart error:", error);
    // alert("Failed to add item to cart. Please check the network or try again later.");
  }
}
// add item to cart
export async function addToCart(productId) {
  try {
    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v1/cart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: user.token,
        },
        body: JSON.stringify({ productId }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      console.log("Product added:", result);
    } else {
      console.warn("Failed to add product:", result.message);
    }
  } catch (error) {
    console.error("Add to cart error:", error);
  }
}

// remove item from cart
export async function removeFromCart(productId) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
      {
        method: "DELETE",
        headers: {
          token: user.token,
        },
      }
    );

    const result = await response.json();
    if (response.ok) {
      console.log("Product removed:", result);
    } else {
      console.warn("Failed to remove product:", result.message);
    }
  } catch (error) {
    console.error("Remove from cart error:", error);
  }
}

export async function updateQuantity(productId, count) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          token: user.token,
        },
        body: JSON.stringify({ count }),
      }
    );

    const result = await response.json();
    if (response.ok) {
      console.log("Quantity updated:", result);
    } else {
      console.warn("Failed to update quantity:", result.message);
    }
  } catch (error) {
    console.error("Update quantity error:", error);
  }
}
window.onload = () => {
  if (exitButton) {
    exitButton.addEventListener("click", () => {
      window.location.replace("index.html");
    });
  }
};

window.updateProductQuantity = async (productId, count) => {
  if (count < 1) {
    await removeFromCart(productId);
  } else {
    await updateQuantity(productId, count);
  }
  getCartItems();
};

window.removeProduct = async (productId) => {
  await removeFromCart(productId);
  getCartItems();
};
document.addEventListener("DOMContentLoaded", () => {
  getCartItems();
});
