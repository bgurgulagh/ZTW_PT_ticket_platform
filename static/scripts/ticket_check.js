document.addEventListener("DOMContentLoaded", async () => {
    const ticketContainer = document.getElementById("ticket_container");
    const inactiveTicketContainer = document.getElementById("inactive_ticket_container");

    // Funkcja określająca klasę kolorowania na podstawie pozostałego czasu i wartości `time`
    function getTimeColorClass(ticket) {
        const timeUnit = ticket.time; // np. "7dni", "24h", "48h", "10min"
        const remainingSeconds = ticket.remaining_seconds; // czas w sekundach
        console.log(timeUnit, remainingSeconds)

        // Jeśli bilet ma czas >= 1 dzień
        if (timeUnit.includes("dni") || timeUnit.includes("h") && parseInt(timeUnit) >= 24) {
            if (remainingSeconds <= 3600) return "ticket_low_time_remaining";
        } else {
            // Dla biletów poniżej 1 dnia
            if (remainingSeconds <= 300) return "ticket_low_time_remaining";
        }
        return "default";
    }

    // Funkcja aktualizująca czas pozostały w czasie rzeczywistym
    function updateRemainingTime() {
        const tickets = document.querySelectorAll(".ticket");

        tickets.forEach(ticket => {
            const remainingSeconds = parseInt(ticket.querySelector("#remaining_seconds").textContent);
            const timeType = ticket.querySelector("#time_type").textContent;
            //console.log(remainingSeconds)
            //console.log(timeType)
            //console.log(remainingTime)
            
            let remainingTime;

            if (remainingSeconds > 0) {
                let days = Math.floor((remainingSeconds + 60) / 86400);
                let rem = (remainingSeconds + 60) % 86400;
                let hours = Math.floor(rem / 3600);
                let minutes = Math.floor(rem % 3600 / 60);

                if (days >= 2) {
                    remainingTime = `${days} dni, ${hours} h ${minutes} min`;
                } else if (days >= 1) {
                    remainingTime = `${days} dzień, ${hours} h ${minutes} min`;
                } else if (hours >= 1) {
                    remainingTime = `${hours} h ${minutes} min`;
                } else {
                    remainingTime = `${minutes} min`;
                }
                console.log(getTimeColorClass({time: timeType, remaining_seconds: remainingSeconds}))
                console.log(ticket.querySelector("#ticket_remaining_section").className)
                ticket.querySelector("#ticket_remaining_section").className = getTimeColorClass({time: timeType, remaining_seconds: remainingSeconds});
                console.log(ticket.querySelector("#ticket_remaining_section").className)
                ticket.querySelector("#ticket_remaining_time").textContent = remainingTime;
                console.log(remainingTime)
                ticket.querySelector("#remaining_seconds").textContent = remainingSeconds - timeInterval;
            } else {
                // Jeśli czas się skończył, przenieś bilet do sekcji nieaktywnych
                remainingTime = "Nieważny";
                ticket.querySelector("#ticket_remaining_time").textContent = remainingTime;
                inactiveTicketContainer.appendChild(ticket);
            }
        });
    }

    // Funkcja pobierająca dane kupionych biletów
    async function loadTicketsCheck() {
        try {
            const response = await fetch("/get_user_tickets");
            const ticketsData = await response.json();
            const activeTickets = ticketsData.active;
            const inactiveTickets = ticketsData.inactive;

            const ticketTemplate = await fetch("/get_ticket_check_template")
                .then(res => res.text());

            // Renderowanie aktywnych biletów
            activeTickets.forEach(ticket => {
                let ticketHTML = ticketTemplate
                    .replace("ticket_id_placeholder", `ticket_${ticket.id}`)
                    .replace("ticket_time_placeholder", `../static/images/time_${ticket.time}_${ticket.zone}.svg`)
                    .replace("ticket_tariff_placeholder", `../static/images/tariff_${ticket.tariff}.svg`)
                    .replace("ticket_zone_placeholder", `../static/images/zone_${ticket.zone}.svg`)
                    .replace("ticket_description_placeholder", ticket.description)
                    .replace("ticket_buy_time_placeholder", ticket.buy_time)
                    .replace("ticket_remaining_time_placeholder", ticket.remaining_time)
                    .replace("ticket_remaining_seconds_placeholder", ticket.remaining_seconds)
                    .replace("ticket_time_type_placeholder", ticket.time)
                    .replace("ticket_token_placeholder", ticket.token);

                // Dodanie klasy koloru
                const colorClass = getTimeColorClass(ticket);
                ticketHTML = ticketHTML.replace("ticket_remaining_section", `ticket_remaining_section" class="${colorClass}`);

                ticketContainer.innerHTML += ticketHTML;
            });

            // Renderowanie nieaktywnych biletów
            inactiveTickets.forEach(ticket => {
                let ticketHTML = ticketTemplate
                    .replace("ticket_id_placeholder", `ticket_${ticket.id}`)
                    .replace("ticket_time_placeholder", `../static/images/time_${ticket.time}_${ticket.zone}.svg`)
                    .replace("ticket_tariff_placeholder", `../static/images/tariff_${ticket.tariff}.svg`)
                    .replace("ticket_zone_placeholder", `../static/images/zone_${ticket.zone}.svg`)
                    .replace("ticket_description_placeholder", ticket.description)
                    .replace("ticket_buy_time_placeholder", ticket.buy_time)
                    .replace("ticket_remaining_time_placeholder", "Nieaktywny");

                inactiveTicketContainer.innerHTML += ticketHTML;
            });

            //attachEventListeners();
        } catch (error) {
            console.error("Błąd podczas ładowania danych biletów:", error);
        }
    }

    ticketContainer.addEventListener("click", event => {
        const ticket = event.target.closest(".ticket");
        if (ticket) {
            const token = ticket.querySelector("#token_id").textContent;
            window.location.href = `/bilety/kontrola?token=${token}`;
        }
    });

    await loadTicketsCheck();

    // Uruchomienie interwału do aktualizacji czasu (1 sekunda)
    const timeInterval = 1;
    setInterval(updateRemainingTime, timeInterval * 1000);
});