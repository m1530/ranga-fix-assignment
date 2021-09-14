const loadProducts = () => {
  // const url = `https://fakestoreapi.com/products`;
  const url = `json/all-products.json`;
  //fetch jason data
  fetch(url)
    .then((response) => response.json())
    .then((data) => showProducts(data));
};
loadProducts();

// show all product in UI 
const showProducts = (products) => {
  const allProducts = products.map(pd => pd);
  for (const product of allProducts) {
    const image = product.image;
    //create div
    const div = document.createElement("div");
    //add class in div
    div.classList.add("product");
    // display rating star in UI
    let output = [];
    const rating = Math.round(product.rating.rate * 2) / 2;
    if (rating) {
      for (let i = rating; i >= 1; i--) {
        //filled star
        output.push(`<i class="fas fa-star text-warning" aria-hidden="true"></i>&nbsp;`)
        // If there is a half a star, append it
        if (i == 1.5) {
          output.push(`<i class="fa fa-star-half-alt text-warning" aria-hidden="true"></i>&nbsp;`)
        }
      }
      // display empty star
      for (i = (5 - rating); i >= 1; i--) {
        output.push('<i class="far fa-star text-warning" aria-hidden="true"></i>&nbsp;')
      }
    }
    //display all products in card
    div.innerHTML = `
        <div class="single-product">
            <div>
                <img class="product-image" src=${image}></img>
            </div>
            <h3>${product.title}</h3>
            <p>Category: ${product.category}</p>
            <h2>Price: $ ${product.price}</h2>
            <p><span class="stars" id='stars'>${output.join('')}</span><span class="fw-bolder">(${product.rating.rate})</span></p>
            <p><span>Total Rating: </span> ${product.rating.count}</p>
            <button onclick="addToCart(${product.id},${product.price})" id="addToCart-btn" class="buy-now">Add to cart</button>
            <button id="details-btn" onclick="getProductDetails(${product.id})" class="details-btn"  data-bs-toggle="modal" data-bs-target="#exampleModal">Details</button>
        </div>  
    `;

    document.getElementById("all-products").appendChild(div);
  }

};
//add to cart function
let count = 0;
const addToCart = (id, price) => {
  count = count + 1;
  updatePrice("price", price);
  updateTaxAndCharge();
  updateTotal();
  document.getElementById("total-Products").innerText = count;
};

//function for take common inner text
const getInputValue = (id) => {
  const element = document.getElementById(id).innerText;
  const converted = parseFloat(element);
  return converted;
};

// main price update function
const updatePrice = (id, value) => {
  const convertedOldPrice = getInputValue(id);
  const convertPrice = parseFloat(value);
  const total = convertedOldPrice + convertPrice;
  //set inner text in 2 desimal
  document.getElementById(id).innerText = total.toFixed(2);
};

// set innerText function and fixed it two desimal
const setInnerText = (id, value) => {
  document.getElementById(id).innerText = value.toFixed(2);
};

// update delivery charge and total Tax
const updateTaxAndCharge = () => {
  const priceConverted = getInputValue("price");
  if (priceConverted > 200) {
    setInnerText("delivery-charge", 30);
    setInnerText("total-tax", priceConverted * 0.2);
  }
  if (priceConverted > 400) {
    setInnerText("delivery-charge", 50);
    setInnerText("total-tax", priceConverted * 0.3);
  }
  if (priceConverted > 500) {
    setInnerText("delivery-charge", 60);
    setInnerText("total-tax", priceConverted * 0.4);
  }
};

//grandTotal update function
const updateTotal = () => {
  const grandTotal =
    getInputValue("price") + getInputValue("delivery-charge") +
    getInputValue("total-tax");
  document.getElementById("total").innerText = grandTotal.toFixed(2);
};
//fetch single product from url
const getProductDetails = id => {
  const url = `https://fakestoreapi.com/products/${id}`;
  fetch(url)
    .then(res => res.json())
    .then(data => setProductDetails(data))
}
//display product in modal card
const setProductDetails = data => {
  //console.log(data)
  const div = document.getElementById('single-product-data');
  div.innerHTML = `
    <div class="row">
      <div class="col-md-4 text-center">
          <img src="${data.image}" class="card-img-top w-75" alt="...">
      </div>
      <div class="col-md-8">
          <h1 class="text">${data.title}</h1>
          <h5>Category: ${data.category}</h5>
          <p><b>Description:</b> ${data.description.slice(0, 200)}</p>
          <h3>Price: <span class="text-primary">$${data.price}</span></h3>
          <p><span class="fas fa-star text-warning"></span> ${data.rating.rate}&nbsp;&nbsp;&nbsp;&nbsp;<span class="fas fa-user text-info"></span> ${data.rating.count}</p>
          <button onclick="addToCart(${data.id},${data.price})" id="addToCart-btn" class="buy-now">Add to cart</button>
      </div>
    </div>
  `;
}