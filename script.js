const PRICE = 5;
const DELIVERY_FEE = 2;
const phone = "60123281670";
const items = {};
let orderType = "Pickup";

function addItem(name) {
  items[name] = (items[name] || 0) + 1;
  renderOrder();
  document.querySelector("#order").scrollIntoView({behavior:"smooth", block:"center"});
}

function changeQty(name, amount) {
  items[name] = (items[name] || 0) + amount;
  if (items[name] <= 0) delete items[name];
  renderOrder();
}

function setOrderType(type) {
  orderType = type;
  document.getElementById("pickupOption").classList.toggle("active", type === "Pickup");
  document.getElementById("deliveryOption").classList.toggle("active", type === "Delivery");
  document.getElementById("addressBox").classList.toggle("show", type === "Delivery");
  renderOrder();
}

function renderOrder() {
  const list = document.getElementById("orderList");
  const names = Object.keys(items);

  if (!names.length) {
    list.innerHTML = '<p class="empty">Your order is empty. Add some fries! 🍟</p>';
    document.getElementById("subtotal").textContent = "RM0";
    document.getElementById("deliveryFee").textContent = "RM0";
    document.getElementById("total").textContent = "RM0";
    return;
  }

  let totalQty = 0;
  list.innerHTML = names.map(name => {
    const qty = items[name];
    totalQty += qty;
    return `
      <div class="order-row">
        <span class="order-name">${name}</span>
        <span>RM${qty * PRICE}</span>
        <div class="qty">
          <button onclick="changeQty('${name}', -1)">−</button>
          <b>${qty}</b>
          <button onclick="changeQty('${name}', 1)">+</button>
        </div>
        <button class="remove" onclick="changeQty('${name}', -${qty})">Remove</button>
      </div>`;
  }).join("");

  const subtotal = totalQty * PRICE;
  const fee = orderType === "Delivery" ? DELIVERY_FEE : 0;
  document.getElementById("subtotal").textContent = "RM" + subtotal;
  document.getElementById("deliveryFee").textContent = "RM" + fee;
  document.getElementById("total").textContent = "RM" + (subtotal + fee);
}

function sendWhatsApp() {
  const names = Object.keys(items);
  if (!names.length) {
    alert("Please add at least one item to your order.");
    return;
  }

  if (orderType === "Delivery") {
    const address = document.getElementById("address").value.trim();
    if (!address) {
      alert("Please enter your delivery address.");
      document.getElementById("address").focus();
      return;
    }
  }

  let totalQty = 0;
  const lines = names.map(name => {
    const qty = items[name];
    totalQty += qty;
    return `- ${name} x${qty}`;
  });

  const subtotal = totalQty * PRICE;
  const fee = orderType === "Delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + fee;
  const address = orderType === "Delivery"
    ? document.getElementById("address").value.trim()
    : "N/A – Customer will pick up";

  const message =
    `Hi Iman Danish! 🍟 I would like to order Shake Shake Fries:%0A%0A` +
    lines.join("%0A") +
    `%0A%0AOrder Type: ${orderType}` +
    `%0ASubtotal: RM${subtotal}` +
    `%0ADelivery Fee: RM${fee}` +
    `%0ATotal: RM${total}` +
    `%0A%0AAddress: ${encodeURIComponent(address)}` +
    `%0A%0AThank you!`;

  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
}

renderOrder();
