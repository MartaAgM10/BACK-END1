document.addEventListener("DOMContentLoaded", () => {
  const cart = [];
  const cartList = document.getElementById("cart");
  const totalSpan = document.getElementById("total");
  const clearBtn = document.getElementById("clearCart");

  function renderCart() {
    cartList.innerHTML = ""; // Limpiar carrito
    let total = 0;

    cart.forEach((item) => {
      const subtotal = item.price * item.qty;
      total += subtotal;

      // Crear card para cada producto en el carrito
      const card = document.createElement("div");
      card.className = "card mb-2";

      const cardBody = document.createElement("div");
      cardBody.className =
        "card-body d-flex justify-content-between align-items-center";

      // Información  del producto o servicio
      const info = document.createElement("div");
      info.innerHTML = `<strong>${item.title}</strong>`;

      // Controles de cantidad
      const qtyControl = document.createElement("div");
      qtyControl.className = "d-flex align-items-center";

      // Botón - para sacar item
      const minusBtn = document.createElement("button");
      minusBtn.className = "btn btn-sm btn-secondary me-1";
      minusBtn.textContent = "-";
      minusBtn.addEventListener("click", () => {
        if (item.qty > 1) item.qty--;
        else {
          const index = cart.findIndex((p) => p.id === item.id);
          if (index !== -1) cart.splice(index, 1);
        }
        renderCart();
      });

      // Botón + para agregar item
      const plusBtn = document.createElement("button");
      plusBtn.className = "btn btn-sm btn-secondary";
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", () => {
        item.qty++;
        renderCart();
      });

      qtyControl.appendChild(minusBtn);
      qtyControl.appendChild(plusBtn);

      // Mostrar subtotal
      const subtotalSpan = document.createElement("span");
      subtotalSpan.className = "ms-3";
      subtotalSpan.textContent = `$${subtotal}`;

      // Botón eliminar
      const removeBtn = document.createElement("button");
      removeBtn.className = "btn btn-sm btn-danger ms-3";
      removeBtn.textContent = "Eliminar";
      removeBtn.addEventListener("click", () => {
        const index = cart.findIndex((p) => p.id === item.id);
        if (index !== -1) cart.splice(index, 1);
        renderCart();
      });

      // Agregar al cardBody
      cardBody.appendChild(info);
      cardBody.appendChild(qtyControl);
      cardBody.appendChild(subtotalSpan);
      cardBody.appendChild(removeBtn);

      card.appendChild(cardBody);
      cartList.appendChild(card);
    });

    totalSpan.textContent = total;
  }

  // Botones Agregar en cada card
  document.querySelectorAll(".add-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id || crypto.randomUUID();
      const title = btn.dataset.title;
      const price = parseFloat(btn.dataset.price);

      const existing = cart.find((p) => p.id === id);
      if (existing) existing.qty++;
      else cart.push({ id, title, price, qty: 1 });

      renderCart();
    });
  });

  // Botón Limpiar carrito
  clearBtn.addEventListener("click", () => {
    cart.length = 0;
    renderCart();
  });
});
