document.addEventListener("DOMContentLoaded", async () => {
    const ticketContainer = document.getElementById("ticket_container");

    // Funkcja pobierająca dane kupionych biletów
    async function loadTicketsCheck() {
        try {
            const response = await fetch("/get_user_tickets");
            const tickets = await response.json();

            // Pobranie szablonu biletu z pliku ticket_check.html
            const ticketTemplate = await fetch("/get_ticket_check_template")
                .then(res => res.text());
            tickets.forEach(ticket => {
                console.log(ticket);
                let ticketHTML = ticketTemplate
                    .replace("ticket_id_placeholder", `ticket_${ticket.id}`)
                    .replace("ticket_time_placeholder", `../static/images/time_${ticket.time}_${ticket.zone}.svg`)
                    .replace("ticket_tariff_placeholder", `../static/images/tariff_${ticket.tariff}.svg`)
                    .replace("ticket_zone_placeholder", `../static/images/zone_${ticket.zone}.svg`)
                    .replace("ticket_description_placeholder", ticket.description)
                    .replace("ticket_buy_time_placeholder", ticket.buy_time)
                    .replace("ticket_remaining_time_placeholder", ticket.remaining_time);

                ticketContainer.innerHTML += ticketHTML;
            });

            attachEventListeners();
        } catch (error) {
            console.error("Błąd podczas ładowania danych biletów:", error);
        }
    }

    await loadTicketsCheck();
});