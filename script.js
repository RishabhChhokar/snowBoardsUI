window.addEventListener("DOMContentLoaded", init);

let productsArr = [];
let sortPlaceholderRemoved = false;//Boolean flag to track whether user has selected an option in sort drop down menu.


// Event listeners for sort dropdown and load products button
function init() {
  document
    .getElementById("sortDropMenu")
    .addEventListener("change", sortHandler);
  document
    .getElementById("loadProductsBtn")
    .addEventListener("click", loadProducts);
}

async function loadProducts() {
  const loadButton = document.getElementById("loadProductsBtn");

  loadButton.innerHTML = "Loading..."; // Change button text to "Loading"

  await getProducts();

  loadButton.style.display = "none"; // Hide the load button after products are loaded
}
//Async function to fetch products from the api endpoint.
async function getProducts() {
  try {
    const res = await fetch(
      "https://run.mocky.io/v3/92348b3d-54f7-4dc5-8688-ec7d855b6cce?mocky-delay=500ms"
    );
    if (!res.ok) throw new Error("Failed to fetch products");

    const data = await res.json();
    productsArr = data.map((item) => item.product);

    if (sortPlaceholderRemoved) {//if user already selected sort order then call sortHandler before rendering list.
      sortHandler();
    } else {
      listRender(productsArr);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    document.getElementById("productGrid").innerHTML =
      "<p>Failed to load products. Try again later.</p>";
  }
}

function listRender(productList) {
  const productGrid = document.getElementById("productGrid");
  productGrid.innerHTML = ""; // Clear existing products

  productList.forEach((product, index) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.style.transitionDelay = `${index * 100}ms`;

    const productImage = product.images[0].src;

    productCard.innerHTML = `
      <img src="${productImage}" alt="${product.title}">
      <p class="product-title">${product.title}</p>
      <p class="product-price">Rs. ${product.variants[0].price}</p>
      <button class="add-to-cart-button">ADD TO CART</button>
    `;

    productGrid.appendChild(productCard);

    setTimeout(() => {
      productCard.style.opacity = "1"; // Fade in product card
      productCard.style.transform = "translateY(0)"; // Slide in product card
    }, 100);
  });
}

function sortHandler() {
  const sortDropMenu = document.getElementById("sortDropMenu");
  const sortOrder = sortDropMenu.value;

  if (!sortPlaceholderRemoved) {
    sortDropMenu.remove(0);//Here we remove the 'sort by' option from the sort drop down menu as it is unnecessary.
    sortPlaceholderRemoved = true;
  }
  // Sort products based on the selected order
  if (sortOrder === "low" || sortOrder === "high") {
    const sortedProducts = [...productsArr].sort((a, b) => {
      const priceA = parseFloat(a.variants[0].price);
      const priceB = parseFloat(b.variants[0].price);
      return sortOrder === "low" ? priceA - priceB : priceB - priceA;
    });

    listRender(sortedProducts); // Re-render sorted products
  }
}
