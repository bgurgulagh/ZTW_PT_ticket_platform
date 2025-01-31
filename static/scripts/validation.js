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
                    modalBody.css("background-color", "#d4edda"); // zielone tło dla ważnego biletu
                    modalBody.append("<p>Status biletu: " + response.message + "</p>");
                } else if (response.message === "Bilet nie istnieje.") {
                    modalBody.css("background-color", "#fff3cd"); // żółte tło gdy biletu nie można znaleźć w bazie
                    modalBody.append("<p>" + response.message + "</p>");
                } else {
                    modalBody.css("background-color", "#f8d7da"); // czerwone tło dla nieważnego biletu
                    modalBody.append("<p>" + response.message + "</p>");
                }
                
                $("#controlStatusModal").modal("show");
            },
            error: function () {
                let modalBody = $("#controlStatusModal .modal-body");
                modalBody.empty().css("background-color", "#f8d7da").append("<p>Wystąpił problem podczas sprawdzania biletu.</p>"); // czerwone tło dla błędu
                $("#controlStatusModal").modal("show");
            }
        });
    });

    $("#saveNewUser").click(function() {
        $("#controlStatusModal").modal("hide");
    });
});
