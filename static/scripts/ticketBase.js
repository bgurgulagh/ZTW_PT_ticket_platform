// Usuwanie biletu
$(document).ready(function() {
    $(".delete-ticket").click(function() {
        let ticketId = $(this).data("ticket-id");

        if (confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
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
});

// Edytowanie użytkownika
$(document).ready(function() {
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
});

// Dodawanie użytkownika
$(document).ready(function() {
    $("#addUserBtn").click(function() {
        $("#addUserModal").modal("show");
    });

    $("#saveNewUser").click(function() {
        let newUser = {
            name: $("#addName").val(),
            surname: $("#addSurname").val(),
            username: $("#addUsername").val(),
            email: $("#addEmail").val(),
            role: $("#addRole").val(),
            password: generatePassword(10)
        };

        $.ajax({
            url: "/add_user_ajax",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newUser),
            success: function(response) {
                if (response.success) {
                    alert("Użytkownik dodany pomyślnie.");
                    location.reload();
                } else {
                    alert("Błąd podczas dodawania użytkownika.");
                }
            },
            error: function() {
                alert("Wystąpił problem podczas dodawania użytkownika.");
            }
        });
    });
});

// Filtrowanie użytkowników
$(document).ready(function() {
    $("#filterBtn").click(function() {
        let name = $("#filterName").val();
        let surname = $("#filterSurname").val();
        let username = $("#filterUsername").val();
        let role = $("#filterRole").val();

        $.ajax({
            url: "/filter_users",
            type: "GET",
            data: {
                name: name,
                surname: surname,
                username: username,
                role: role
            },
            success: function(response) {
                let tbody = $("#userTable tbody");
                tbody.empty();

                if (response.length === 0) {
                    tbody.append("<tr><td colspan='8' class='text-center'>Brak wyników</td></tr>");
                } else {
                    response.forEach(function(user) {
                        let row = `
                            <tr>
                                <td>${user.id}</td>
                                <td>${user.name}</td>
                                <td>${user.surname}</td>
                                <td>${user.username}</td>
                                <td>${user.email}</td>
                                <td>${user.role}</td>
                                <td>
                                    <button class="btn btn-sm btn-outline-primary edit-user" 
                                            data-user-id="${user.id}" 
                                            data-name="${user.name}"
                                            data-surname="${user.surname}"
                                            data-username="${user.username}"
                                            data-email="${user.email}"
                                            data-role="${user.role}">
                                        <i class="bi bi-pencil"></i>
                                    </button>
                                </td>
                                <td>
                                    <button class="btn btn-sm btn-danger delete-user" data-user-id="${user.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                        tbody.append(row);
                    });
                }
            },
            error: function() {
                alert("Wystąpił błąd podczas filtrowania.");
            }
        });
    });

    $("#resetBtn").click(function() {
        $("#filterName").val('');
        $("#filterSurname").val('');
        $("#filterUsername").val('');
        $("#filterRole").val('');
        location.reload();
    });
});