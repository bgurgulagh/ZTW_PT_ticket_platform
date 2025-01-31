$(document).ready(function () {
    $("#checkTicketBtn").click(function() {
        $("#controlStatusModal").modal("show");
        
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
                if (response.success) {
                    alert("Status biletu: " + response.message);
                } else {
                    alert(response.message);
                }
            },
            error: function () {
                alert("Wystąpił problem podczas sprawdzania biletu.");
            },
        });
    });

    // $("form").on("submit", function (event) {
    //     

        
    // });
});