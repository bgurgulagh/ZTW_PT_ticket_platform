// Usuwanie biletu
function del_ticket() {
    $(".delete-ticket").click(function() {
        let ticketId = $(this).data("ticket-id");

        if (confirm("Czy na pewno chcesz usunąć ten bilet?")) {
            $.ajax({
                url: "/delete_ticket_ajax/" + ticketId,
                type: "DELETE",
                success: function(response) {
                    if (response.success) {
                        alert("Bilet został usunięty.");
                        location.reload();
                    } else {
                        alert("Wystąpił błąd podczas usuwania.");
                    }
                },
                error: function() {
                    alert("Nie udało się usunąć biletu.");
                }
            });
        }
    });
}

// Edytowanie biletu
function edit_ticket() {
    $(".edit-ticket").click(function() {
        let ticketId = $(this).data("ticket-id");
    
        $("#editTicketId").val(ticketId);
        $("#editTime").val($(this).data("time"));
        $("#editTariff").val($(this).data("tariff"));
        $("#editZone").val($(this).data("zone"));
        $("#editPrice").val($(this).data("price"));
        $("#editDescription").val($(this).data("description"));

        $("#editTicketModal").modal("show");
    });

    $("#saveTicketChanges").click(function() {
        let ticketId = $("#editTicketId").val();
        let updatedData = {
            time: $("#editTime").val(),
            tariff: $("#editTariff").val(),
            zone: $("#editZone").val(),
            price: $("#editPrice").val(),
            description: $("#editDescription").val()
        };

        $.ajax({
            url: "/update_ticket_ajax/" + ticketId,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(updatedData),
            success: function(response) {
                if (response.success) {
                    alert("Dane biletu zaktualizowane pomyślnie.");
                    location.reload();
                } else {
                    alert("Błąd podczas aktualizacji danych.");
                }
            },
            error: function() {
                alert("Wystąpił problem podczas aktualizacji.");
            }
        });
    });
}

// Dodawanie biletu
function add_ticket() {
    $("#addTicketBtn").click(function() {
        $("#addTicketModal").modal("show");
    });

    $("#saveNewTicket").click(function() {
        let newTicket = {
            time: $("#addTime").val(),
            tariff: $("#addTariff").val(),
            zone: $("#addZone").val(),
            price: $("#addPrice").val(),
            description: $("#addDescription").val()
        };

        $.ajax({
            url: "/add_ticket_ajax",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newTicket),
            success: function(response) {
                if (response.success) {
                    alert("Bilet dodany pomyślnie.");
                    location.reload();
                } else {
                    alert("Błąd podczas dodawania biletu.");
                }
            },
            error: function() {
                alert("Wystąpił problem podczas dodawania biletu.");
            }
        });
    });
}

$(document).ready(function() {
    del_ticket()
    edit_ticket()
    add_ticket()
});

// Filtrowanie biletów
$(document).ready(function() {
    $("#filterBtn").click(function() {
        let tariff = $("#filterTariff").val();
        let zone = $("#filterZone").val();

        $.ajax({
            url: "/filter_tickets",
            type: "GET",
            data: {
                tariff: tariff,
                zone: zone
            },
            success: function(response) {
                let tbody = $("#ticketTableContainer tbody");
                tbody.empty();

                if (response.length === 0) {
                    tbody.append("<tr><td colspan='8' class='text-center'>Brak wyników</td></tr>");
                } else {
                    response.forEach(function(ticket) {
                        let row = `
                            <tr>
                                <td>${ticket.id}</td>
                                <td>${ticket.time}</td>
                                <td>${ticket.tariff}</td>
                                <td>${ticket.zone}</td>
                                <td>${ticket.price}</td>
                                <td>${ticket.description}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary edit-ticket" 
                                            data-ticket-id="${ticket.id}" 
                                            data-time="${ticket.time}"
                                            data-tariff="${ticket.tariff}"
                                            data-zone="${ticket.zone}"
                                            data-price="${ticket.price}"
                                            data-description="${ticket.description}">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-danger delete-ticket" data-ticket-id="${ticket.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                    del_ticket();
                    edit_ticket();
                }
            },
            error: function() {
                alert("Wystąpił błąd podczas filtrowania.");
            }
        });
    });

    $("#resetBtn").click(function() {
        $("#filterTariff").val('');
        $("#filterZone").val('');
        location.reload();
    });
});