$(document).ready(function () {
    $("form").on("submit", function (event) {
      event.preventDefault();
      let ticketToken = $("#ticket-id-number").val().trim();

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
          if (response.success) {
            alert("Status biletu: " + response.message);
          } else {
            alert(response.error);
          }
        },
        error: function () {
          alert("Wystąpił problem podczas sprawdzania biletu.");
        },
      });
    });
});