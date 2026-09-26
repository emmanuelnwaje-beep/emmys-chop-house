document.addEventListener("DOMContentLoaded", () => {

/* =========================
   MOBILE MENU
========================= */

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navbar");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", function () {

        const isOpen = navLinks.classList.toggle("active");

        menuToggle.classList.toggle("open", isOpen);

        menuToggle.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    });

    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("active");
            menuToggle.classList.remove("open");

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}

  /* =========================
     MENU CATEGORY FILTER
  ========================= */

  const filterButtons = document.querySelectorAll(".category-btn");
  const foodCards = document.querySelectorAll(".food-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {

        filterButtons.forEach((btn) =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const category = button.textContent.trim();

        foodCards.forEach((card) => {
            const cardCategory =
                card.querySelector(".food-category")?.textContent.trim();

            if (
                category === "All" ||
                cardCategory === category
            ) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});


  /* =========================
     CART SETTINGS
  ========================= */

  const DELIVERY_FEE = 2000;
  const WHATSAPP_NUMBER = "2349060256867";

  let cart = [];
  /* =========================
   CART FOOD IMAGES
========================= */

const FOOD_IMAGES = {
    "Jollof Rice & Chicken": "images/jollof.jpg",
    "Fried Rice & Chicken": "images/fried-rice.jpg",
    "Ofada Rice & Sauce": "images/ofada.jpg",
    "Pounded Yam & Egusi": "images/pounded-yam.jpg",
    "Pounded Yam & Soup": "images/pounded-yam.jpg",
    "Emmy's Signature Burger": "images/burger.jpg",
    "Loaded Shawarma": "images/shawarma.jpg"
};

  try {
    cart = JSON.parse(
      localStorage.getItem("emmysCart")
    ) || [];
  } catch (error) {
    cart = [];
  }

  if (!Array.isArray(cart)) {
    cart = [];
  }


  /* =========================
     CREATE CART BUTTON
  ========================= */

  const cartButton = document.createElement("button");

  cartButton.id = "cartButton";

  cartButton.innerHTML = `
    🛒 Cart
    <span id="cartCount">0</span>
  `;

  document.body.appendChild(cartButton);


  /* =========================
     CREATE CART PANEL
  ========================= */

  const cartPanel = document.createElement("div");

  cartPanel.id = "cartPanel";

  cartPanel.innerHTML = `
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button id="closeCart">×</button>
    </div>

    <div id="cartItems"></div>

    <div class="customer-details">

      <h3>Customer Details</h3>

      <input
        type="text"
        id="customerName"
        placeholder="Your name"
      >

      <input
        type="tel"
        id="customerPhone"
        placeholder="Phone number"
      >

      <div class="checkout-options">

        <label>
          <input
            type="radio"
            name="fulfilment"
            value="pickup"
            checked
          >
          Pickup
        </label>

        <label>
          <input
            type="radio"
            name="fulfilment"
            value="delivery"
          >
          Delivery
        </label>

      </div>

      <div
        class="address-box"
        id="addressBox"
        style="display:none;"
      >
        <textarea
          id="deliveryAddress"
          placeholder="Enter your delivery address"
          rows="3"
        ></textarea>
      </div>

      <textarea
        id="orderNote"
        placeholder="Order note (optional)"
        rows="3"
      ></textarea>

    </div>

    <div class="cart-summary">

      <div>
        <span>Subtotal</span>
        <strong id="cartSubtotal">₦0</strong>
      </div>

      <div>
        <span>Delivery</span>
        <strong id="deliveryCost">₦0</strong>
      </div>

      <div>
        <span>Total</span>
        <strong id="cartTotal">₦0</strong>
      </div>

    </div>

    <button
      id="whatsappOrder"
      class="whatsapp-order"
    >
      Order on WhatsApp
    </button>
  `;

  document.body.appendChild(cartPanel);


  /* =========================
     CART ELEMENTS
  ========================= */

  const cartCount =
    document.getElementById("cartCount");

  const cartItems =
    document.getElementById("cartItems");

  const cartSubtotal =
    document.getElementById("cartSubtotal");

  const deliveryCost =
    document.getElementById("deliveryCost");

  const cartTotal =
    document.getElementById("cartTotal");

  const closeCart =
    document.getElementById("closeCart");

  const whatsappOrder =
    document.getElementById("whatsappOrder");

  const addressBox =
    document.getElementById("addressBox");

  const deliveryAddress =
    document.getElementById("deliveryAddress");

  const customerName =
    document.getElementById("customerName");

  const customerPhone =
    document.getElementById("customerPhone");

  const orderNote =
    document.getElementById("orderNote");


  /* =========================
     OPEN CART
  ========================= */

  cartButton.addEventListener("click", () => {
    cartPanel.classList.add("show");
  });


  /* =========================
     CLOSE CART
  ========================= */

  closeCart.addEventListener("click", () => {
    cartPanel.classList.remove("show");
  });


  /* =========================
     PICKUP / DELIVERY
  ========================= */

  document
    .querySelectorAll('input[name="fulfilment"]')
    .forEach(radio => {

      radio.addEventListener("change", () => {

        if (radio.value === "delivery" && radio.checked) {
          addressBox.style.display = "block";
        }

        if (radio.value === "pickup" && radio.checked) {
          addressBox.style.display = "none";
          deliveryAddress.value = "";
        }

        updateCart();

      });

    });


  /* =========================
     ADD TO CART
  ========================= */

  document
    .querySelectorAll(".add-to-cart")
    .forEach(button => {

      button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);

        if (!name || !price) {
          return;
        }

        const existingItem =
          cart.find(item => item.name === name);

        if (existingItem) {

          existingItem.quantity += 1;

        } else {

          cart.push({
            name: name,
            price: price,
            quantity: 1
          });

        }

        saveCart();
        updateCart();

        cartPanel.classList.add("show");

      });

    });


  /* =========================
     SAVE CART
  ========================= */

  function saveCart() {

    localStorage.setItem(
      "emmysCart",
      JSON.stringify(cart)
    );
  }
  /* =========================
     UPDATE CART
  ========================= */

  function updateCart() {

    cartItems.innerHTML = "";

    let subtotal = 0;
    let totalQuantity = 0;


    if (cart.length === 0) {

      cartItems.innerHTML = `
        <p class="empty-cart">
          Your cart is empty.
        </p>
      `;

    } else {

      cart.forEach((item, index) => {

        subtotal +=
          item.price * item.quantity;

        totalQuantity += item.quantity;


        const itemElement =
          document.createElement("div");

        itemElement.className = "cart-item";
itemElement.innerHTML = `
    <div class="cart-item-image">
        <img
            src="${FOOD_IMAGES[item.name] || 'images/hero.jpg'}"
            alt="${escapeHTML(item.name)}"
        >
    </div>

    <div class="cart-item-info">

        <h4>
            ${escapeHTML(item.name)}
        </h4>

        <p>
            ₦${item.price.toLocaleString()}
        </p>

    </div>

    <div class="quantity-controls">

        <button
            class="decrease-item"
            data-index="${index}"
        >
            −
        </button>

        <span>
            ${item.quantity}
        </span>

        <button
            class="increase-item"
            data-index="${index}"
        >
            +
        </button>

    </div>

    <button
        class="remove-item"
        data-index="${index}"
    >
        Remove
    </button>
`;

    cartItems.appendChild(itemElement);

      });

    }


    const selectedFulfilment =
      document.querySelector(
        'input[name="fulfilment"]:checked'
      );


    const isDelivery =
      selectedFulfilment &&
      selectedFulfilment.value === "delivery";


    const delivery =
      isDelivery && cart.length > 0
        ? DELIVERY_FEE
        : 0;


    const total =
      subtotal + delivery;


    cartSubtotal.textContent =
      `₦${subtotal.toLocaleString()}`;

    deliveryCost.textContent =
      `₦${delivery.toLocaleString()}`;

    cartTotal.textContent =
      `₦${total.toLocaleString()}`;

    cartCount.textContent =
      totalQuantity;


    /* =========================
       PLUS BUTTON
    ========================= */

    document
      .querySelectorAll(".increase-item")
      .forEach(button => {

        button.addEventListener("click", () => {

          const index =
            Number(button.dataset.index);

          cart[index].quantity += 1;

          saveCart();
          updateCart();

        });

      });


    /* =========================
       MINUS BUTTON
    ========================= */

    document
      .querySelectorAll(".decrease-item")
      .forEach(button => {

        button.addEventListener("click", () => {

          const index =
            Number(button.dataset.index);

          cart[index].quantity -= 1;


          if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
          }


          saveCart();
          updateCart();

        });

      });


    /* =========================
       REMOVE BUTTON
    ========================= */

    document
      .querySelectorAll(".remove-item")
      .forEach(button => {

        button.addEventListener("click", () => {

          const index =
            Number(button.dataset.index);

          cart.splice(index, 1);

          saveCart();
          updateCart();

        });

      });

  }


  /* =========================
     WHATSAPP ORDER
  ========================= */

  whatsappOrder.addEventListener("click",async () => {

    if (cart.length === 0) {

      alert("Your cart is empty.");
      return;

    }


    const name =
      customerName.value.trim();

    const phone =
      customerPhone.value.trim();


    const selectedFulfilment =
      document.querySelector(
        'input[name="fulfilment"]:checked'
      );


    const fulfilment =
      selectedFulfilment
        ? selectedFulfilment.value
        : "pickup";


    if (!name) {

      alert("Please enter your name.");
      customerName.focus();
      return;

    }


    if (!phone) {

      alert("Please enter your phone number.");
      customerPhone.focus();
      return;

    }


    if (
      fulfilment === "delivery" &&
      !deliveryAddress.value.trim()
    ) {

      alert("Please enter your delivery address.");
      deliveryAddress.focus();
      return;

    }


    let subtotal = 0;


    cart.forEach(item => {

      subtotal +=
        item.price * item.quantity;

    });


    const delivery =
      fulfilment === "delivery"
        ? DELIVERY_FEE
        : 0;


    const total =
      subtotal + delivery;


    /* =========================
   ORDER ID
========================= */

const { data: generatedOrderId, error: orderIdError } =
  await supabaseClient.rpc("get_next_order_id");

if (orderIdError || !generatedOrderId) {
  console.error("Order ID error:", orderIdError);
  alert("Unable to create order number. Please try again.");
  return;
}

const orderId = generatedOrderId;


    /* =========================
       SAVE ORDER
    ========================= */

    const order = {

      id: orderId,

      customer: {
        name: name,
        phone: phone
      },

      items: cart.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),

      subtotal: subtotal,

      deliveryFee: delivery,

      total: total,

      fulfilment: fulfilment,

      address:
        fulfilment === "delivery"
          ? deliveryAddress.value.trim()
          : "Pickup",

      note: orderNote.value.trim(),

      status: "New",

      date: new Date().toLocaleString()

    };

    
    /* =========================
   SAVE ORDER TO SUPABASE
========================= */

const { error: supabaseError } =
  await supabaseClient
    .from("orders")
    .insert({
      order_id: orderId,
      customer_name: name,
      customer_phone: phone,
      order_type: fulfilment,
      delivery_address:
        fulfilment === "delivery"
          ? deliveryAddress.value.trim()
          : "Pickup",
      note: orderNote.value.trim(),
      items: order.items,
      subtotal: subtotal,
      delivery_fee: delivery,
      total: total,
      status: "New"
    });

if (supabaseError) {
  console.error(
    "Supabase order error:",
    supabaseError
  );
} else {
  console.log(
    "Order successfully saved to Supabase:",
    orderId
  );
}

    /* =========================
       WHATSAPP MESSAGE
    ========================= */

    let message =
      `Hello Emmy's Chop-House! 🍽️\n\n` +
      `New Order: ${orderId}\n\n` +
      `Customer: ${name}\n` +
      `Phone: ${phone}\n` +
      `Order Type: ${
        fulfilment === "delivery"
          ? "Delivery"
          : "Pickup"
      }\n\n`;


    message +=
      `ORDER ITEMS:\n`;


    cart.forEach(item => {

      message +=
        `${item.quantity} × ${item.name} - ₦${
          (
            item.price *
            item.quantity
          ).toLocaleString()
        }\n`;

    });


    message +=
      `\nSubtotal: ₦${subtotal.toLocaleString()}` +
      `\nDelivery: ₦${delivery.toLocaleString()}` +
      `\nTOTAL: ₦${total.toLocaleString()}`;


    if (fulfilment === "delivery") {

      message +=
        `\n\nDelivery Address:\n` +
        `${deliveryAddress.value.trim()}`;

    }


    if (orderNote.value.trim()) {

      message +=
        `\n\nNote:\n` +
        `${orderNote.value.trim()}`;

    }


    message +=
      `\n\nThank you!`;


    const whatsappURL =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message);


    /* =========================
       CLEAR CART
    ========================= */

    cart = [];

    saveCart();
    updateCart();


    customerName.value = "";
    customerPhone.value = "";
    deliveryAddress.value = "";
    orderNote.value = "";


    /* =========================
       OPEN WHATSAPP
    ========================= */

    window.open(
      whatsappURL,
      "_blank"
    );

  });


  /* =========================
     ESCAPE HTML
  ========================= */

  function escapeHTML(value) {

    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

  }


  /* =========================
     FOOTER YEAR
  ========================= */

  const year =
    document.getElementById("year");

  if (year) {
    year.textContent =
      new Date().getFullYear();
  }


  /* =========================
     IMAGE ERROR HANDLING
  ========================= */

  document
    .querySelectorAll("img")
    .forEach(img => {

      img.addEventListener("error", () => {

        console.warn(
          "Image could not be loaded:",
          img.src
        );

        // Do NOT hide the image.
        // This keeps the hero visible
        // while we fix its file path.

      });

    });


  /* =========================
     INITIAL CART
  ========================= */

  updateCart();

});
