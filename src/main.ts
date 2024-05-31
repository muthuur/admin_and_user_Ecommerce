interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

const productForm = document.querySelector("form") as HTMLFormElement;
const productsList = document.getElementById("productList") as HTMLDivElement;
const updateForm = document.querySelector(".update-form") as HTMLDivElement;
const updateNameInput = document.getElementById(
  "updateName"
) as HTMLInputElement;
const updateDescriptionInput = document.getElementById(
  "updateDescription"
) as HTMLTextAreaElement;
const updatePriceInput = document.getElementById(
  "updatePrice"
) as HTMLInputElement;
const updateCategoryInput = document.getElementById(
  "updateCategory"
) as HTMLInputElement;
const updateImageInput = document.getElementById(
  "updateImage"
) as HTMLInputElement;
const addProductBtn = document.getElementById(
  "addProductBtn"
) as HTMLButtonElement;
const updateProductBtn = document.getElementById(
  "updateProductBtn"
) as HTMLButtonElement;
const cancelUpdateBtn = document.getElementById(
  "cancelUpdateBtn"
) as HTMLButtonElement;

let currentProductId: string | null = null;

fetchProducts();

productForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = (document.getElementById("name") as HTMLInputElement).value;
  const description = (
    document.getElementById("description") as HTMLTextAreaElement
  ).value;
  const price = parseFloat(
    (document.getElementById("price") as HTMLInputElement).value
  );
  const category = (document.getElementById("category") as HTMLInputElement)
    .value;
  const image = (document.getElementById("image") as HTMLInputElement).value;

  const newProduct: Product = {
    id: "" + Date.now(),
    name,
    description,
    price,
    category,
    image,
  };

  fetch("http://localhost:3000/products", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newProduct),
  })
    .then((response) => response.json())
    .then((data) => {
      productForm.reset();

      fetchProducts();
      console.log(newProduct);
    })
    .catch((error) => console.error("Error creating product:", error));
});

function fetchProduct() {
  fetch("http://localhost:3000/products")
    .then((response) => response.json())
    .then((data) => {
      productList.innerHTML = "";

      data.forEach((product: Product) => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        productCard.appendChild(image);

        const name = document.createElement("h3");
        name.textContent = product.name;
        productCard.appendChild(name);

        const description = document.createElement("p");
        description.textContent = product.description;
        productCard.appendChild(description);

        const price = document.createElement("p");

        price.textContent = `KSh{
          product.price ? product.price.toFixed(2) : "0.00"
        }`;
        price.classList.add("price");
        productCard.appendChild(price);

        const category = document.createElement("p");
        category.textContent = `Category: ${product.category}`;
        productCard.appendChild(category);

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => showUpdateForm(product));
        productCard.appendChild(updateButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteProduct(product.id));
        productCard.appendChild(deleteButton);

        productList.appendChild(productCard);
      });
    })
    .catch((error) => console.error("Error fetching products:", error));
}

function showUpdateForm(product: Product) {
  updateNameInput.value = product.name;
  updateDescriptionInput.value = product.description;
  updatePriceInput.value = product.price.toString();
  updateCategoryInput.value = product.category;
  updateImageInput.value = product.image;
  currentProductId = product.id;
  updateForm.style.display = "block";
}

function updateProduct() {
  const updatedProduct: Product = {
    id: currentProductId!,
    name: updateNameInput.value,
    description: updateDescriptionInput.value,
    price: parseFloat(updatePriceInput.value),
    category: updateCategoryInput.value,
    image: updateImageInput.value,
  };

  fetch(`http://localhost:3000/products/${currentProductId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedProduct),
  })
    .then(() => {
      updateNameInput.value = "";
      updateDescriptionInput.value = "";
      updatePriceInput.value = "";
      updateCategoryInput.value = "";
      updateImageInput.value = "";
      currentProductId = null;
      updateForm.style.display = "none";

      fetchProducts();
    })
    .catch((error) => console.error("Error updating product:", error));
}

function deleteProduct(id: string) {
  fetch(`http://localhost:3000/products/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      fetchProducts();
    })
    .catch((error) => console.error("Error deleting product:", error));
}

updateProductBtn?.addEventListener("click", updateProduct);
cancelUpdateBtn?.addEventListener("click", () => {
  updateNameInput.value = "";
  updateDescriptionInput.value = "";
  updatePriceInput.value = "";
  updateCategoryInput.value = "";
  updateImageInput.value = "";
  currentProductId = null;
  updateForm.style.display = "none";
});
