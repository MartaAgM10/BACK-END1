const socket = io();

socket.on("productosActualizados", (productos) => {
  const lista = document.getElementById("listaProductos");
  lista.innerHTML = "";

  productos.forEach((p) => {
    const li = document.createElement("li");
    li.innerText = `${p.nombre} - $${p.precio}`;
    lista.appendChild(li);
  });
});
