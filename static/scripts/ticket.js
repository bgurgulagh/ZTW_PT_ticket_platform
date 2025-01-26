// Wczytanie danych biletów
document.addEventListener("DOMContentLoaded", () => {
    const ticketsFile = "../static/scripts/tickets.json";

    // Wczytanie danych JSON
    const loadTicketData = async (id) => {
      try {
        const response = await fetch(ticketsFile);
        const data = await response.json();
        return data[id] || null;
      } catch (error) {
        console.error("Błąd podczas ładowania danych biletów:", error);
        return null;
      }
    };
  
    const updateTicketData = async (ticketElement) => {
      const ticketId = ticketElement.id.trim();
      const ticketData = await loadTicketData(ticketId);
  
      if (!ticketData) {
        console.error(`Brak danych dla biletu: ${ticketId}`);
        return;
      }
  
      ticketElement.querySelector("#ticket_time").src = "../static/images/time_" + ticketData.time + "_" + ticketData.zone + ".svg";
      ticketElement.querySelector("#ticket_tariff").src = "../static/images/tariff_" + ticketData.tariff + ".svg";
      ticketElement.querySelector("#ticket_zone").src = "../static/images/zone_" + ticketData.zone + ".svg";
      ticketElement.querySelector("#ticket_description").textContent = ticketData.description;
      ticketElement.querySelector("#ticket_price").textContent = ticketData.price + "zł";
    };
  
    const tickets = document.querySelectorAll(".ticket");
    tickets.forEach((ticket) => updateTicketData(ticket));


  const ticketQuantityElement = document.getElementById("ticket_quantity");
  const buttonMinus = document.getElementById("button_minus");
  const buttonPlus = document.getElementById("button_plus");
  console.log(ticketQuantityElement)
  console.log(buttonMinus)
  console.log(document.getElementById("moje-bilety"))
  console.log(document.getElementById("tickets"))

  // Zmiana ilości biletów
  function updateTicketQuantity(change) {
      let currentQuantity = parseInt(ticketQuantityElement.textContent, 10);
      const newQuantity = Math.min(10, Math.max(0, currentQuantity + change));
      ticketQuantityElement.textContent = newQuantity;

      // Aktualizacja kolorów przycisków
      buttonMinus.style.backgroundColor = newQuantity === 0 ? "#9D9D9C" : "";
      buttonPlus.style.backgroundColor = newQuantity === 10 ? "#9D9D9C" : "";
  }

  // Obliczanie kwoty do zapłaty
  function calculateTotal() {
      let quantity = parseInt(ticketQuantityElement.textContent, 10);
      let price = parseFloat(document.getElementById("ticket_price").textContent.replace(",", ".").replace("zł", ""), 10);
      const total = quantity * price;
      console.log(`Kwota do zapłaty: ${total.toFixed(2)} zł`);
  };

  // Reakcja na przyciski
  buttonMinus.addEventListener("click", () => {
      updateTicketQuantity(-1);
      calculateTotal()
  });

  buttonPlus.addEventListener("click", () => {
      updateTicketQuantity(1);
      calculateTotal()
  });

  // Inicjalizacja stylów przy pierwszym załadowaniu
  updateTicketQuantity(0);

});