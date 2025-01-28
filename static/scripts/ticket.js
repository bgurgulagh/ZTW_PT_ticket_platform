document.addEventListener("DOMContentLoaded", async () => {
    const ticketContainer = document.getElementById("ticket_container");

    // Funkcja pobierająca dane biletów z API Flask
    async function loadTickets() {
        try {
            const response = await fetch("/get_tickets");
            const tickets = await response.json();

            // Pobranie szablonu biletu z pliku ticket.html
            const ticketTemplate = await fetch("/get_ticket_template")
                .then(res => res.text());
            tickets.forEach(ticket => {
                console.log(ticket);
                let ticketHTML = ticketTemplate
                    .replace("ticket_id_placeholder", `ticket_${ticket.id}`)
                    .replace("ticket_time_placeholder", `../static/images/time_${ticket.time}_${ticket.zone}.svg`)
                    .replace("ticket_tariff_placeholder", `../static/images/tariff_${ticket.tariff}.svg`)
                    .replace("ticket_zone_placeholder", `../static/images/zone_${ticket.zone}.svg`)
                    .replace("ticket_price_placeholder", `${ticket.price}zł`)
                    .replace("ticket_description_placeholder", ticket.description);

                ticketContainer.innerHTML += ticketHTML;
            });

            attachEventListeners();
        } catch (error) {
            console.error("Błąd podczas ładowania danych biletów:", error);
        }
    }

    // Obsługa przycisków do zmiany ilości biletów i obliczenia kosztu
    function attachEventListeners() {
        const tickets = document.querySelectorAll(".ticket");
        tickets.forEach(ticket => {
            const minusBtn = ticket.querySelector(".button_minus");
            const plusBtn = ticket.querySelector(".button_plus");

            minusBtn.addEventListener("click", () => {
                updateTicketQuantity(ticket, -1);
                calculateTotal();
            });

            plusBtn.addEventListener("click", () => {
                updateTicketQuantity(ticket, 1);
                calculateTotal();
            });
        });
    } 
  
    // Zmiana ilości biletów
    function updateTicketQuantity(ticket, change) {
        const minusBtn = ticket.querySelector(".button_minus");
        const plusBtn = ticket.querySelector(".button_plus");
        const quantityElement = ticket.querySelector(".ticket_quantity");

        let currentQuantity = parseInt(quantityElement.textContent, 10);
        const newQuantity = Math.min(10, Math.max(0, currentQuantity + change));
        quantityElement.textContent = newQuantity;

        // Aktualizacja kolorów przycisków
        minusBtn.style.backgroundColor = newQuantity === 0 ? "#9D9D9C" : "";
        plusBtn.style.backgroundColor = newQuantity === 10 ? "#9D9D9C" : "";
    }

    // Obliczanie łącznej kwoty do zapłaty dla wszystkich biletów
    function calculateTotal() {
        let total = 0;
        document.querySelectorAll(".ticket").forEach(ticket => {
            const quantity = parseInt(ticket.querySelector(".ticket_quantity").textContent, 10);
            const price = parseFloat(ticket.querySelector("#ticket_price").textContent.replace(",", ".").replace("zł", ""));
            total += quantity * price;
        });
        document.querySelector("#transaction_cost_cost").textContent = total.toFixed(2).replace(".", ",") + "zł";
    }

    // Zakup biletów
    async function confirmTransaction() {
        const ticketsToBuy = [];

        document.querySelectorAll(".ticket").forEach(ticketElement => {
            const quantity = parseInt(ticketElement.querySelector("#ticket_quantity").textContent, 10);

            if (quantity > 0) {
                // Wyciągnięcie danych biletów
                const time = ticketElement.querySelector("#ticket_time").src.split("_")[1];
                const tariff = ticketElement.querySelector("#ticket_tariff").src.split("_")[1].replace(".svg", "");
                const zone = ticketElement.querySelector("#ticket_zone").src.split("_")[1].replace(".svg", "");
                const description = ticketElement.querySelector("#ticket_description").textContent;

                for (let i = 0; i < quantity; i++) {
                    ticketsToBuy.push({ time, tariff, zone, description });
                }
            }
        });

        if (ticketsToBuy.length === 0) {
            alert("Nie wybrano żadnych biletów do zakupu.");
            return;
        }

        try {
            const response = await fetch("/buy_ticket", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(ticketsToBuy)
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);

                // Resetowanie biletów po zakupie
                document.querySelectorAll(".ticket").forEach(ticketElement => {
                    ticketElement.querySelector("#ticket_quantity").textContent = "0";
                    ticketElement.querySelector("#button_minus").style.backgroundColor = "#9D9D9C";
                    ticketElement.querySelector("#button_plus").style.backgroundColor = "";
                });

                // Wyzerowanie kwoty do zapłaty
                document.querySelector("#transaction_cost_cost").textContent = "0,00zł";
            } else {
                alert(`Błąd: ${result.message}`);
            }
        } catch (error) {
            console.error("Błąd podczas zapisywania biletów:", error);
            alert("Wystąpił błąd podczas zapisywania biletów.");
        }
    }

    // Podpięcie funkcji do przycisku
    document.getElementById("btn_transaction_confirm").addEventListener("click", confirmTransaction);

    await loadTickets();

    // Inicjalizacja stylów przy pierwszym załadowaniu
    document.querySelectorAll(".ticket").forEach(ticket => {
        updateTicketQuantity(ticket, 0);
    });
});