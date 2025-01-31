$(document).ready(function () {
    $("#checkTicketBtn").click(function(event) {
        event.preventDefault();
        let ticketToken = $("#ticket-id-number").val().trim();
        console.log("Wprowadzony token:", ticketToken);

        if (ticketToken === "") {
            alert("Proszę wpisać numer ID biletu.");
            return;
        }

        $.ajax({
            url: "/check_ticket",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({ token: ticketToken }),
            success: function (response) {
                console.log("Odpowiedź serwera:", response);
                
                let modalBody = $("#controlStatusModal .modal-body");
                modalBody.empty();
                
                if (response.success) {
                    modalBody.css("background-color", "#65A930"); // Zielone tło dla ważnego biletu
                    modalBody.append("<p>Status biletu: " + response.message + "</p>");
                } else if (response.message === "Bilet nie istnieje.") {
                    modalBody.css("background-color", "#EB9000"); // Żółte tło gdy biletu nie można znaleźć w bazie
                    modalBody.append("<p>" + response.message + "</p>");
                } else {
                    modalBody.css("background-color", "#E00726"); // Czerwone tło dla nieważnego biletu
                    modalBody.append("<p>" + response.message + "</p>");
                }
                
                $("#controlStatusModal").modal("show");
            },
            error: function () {
                let modalBody = $("#controlStatusModal .modal-body");
                modalBody.empty().css("background-color", "#E00726").append("<p>Wystąpił problem podczas sprawdzania biletu.</p>"); // Czerwone tło dla błędu
                $("#controlStatusModal").modal("show");
            }
        });
    });

    $("#saveNewUser").click(function() {
        $("#controlStatusModal").modal("hide");
    });
});
