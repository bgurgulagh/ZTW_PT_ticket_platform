// Usuwanie użytkownika
function del_user() {
    $(".delete-user").click(function() {
        let userId = $(this).data("user-id");

        if (confirm("Czy na pewno chcesz usunąć tego użytkownika?")) {
            $.ajax({
                url: "/delete_user_ajax/" + userId,
                type: "DELETE",
                success: function(response) {
                    if (response.success) {
                        alert("Użytkownik został usunięty.");
                        location.reload();
                    } else {
                        alert("Wystąpił błąd podczas usuwania.");
                    }
                },
                error: function() {
                    alert("Nie udało się usunąć użytkownika.");
                }
            });
        }
    });
}

// Edytowanie użytkownika
function edit_user() {
    $(".edit-user").click(function() {
        let userId = $(this).data("user-id");
        $("#editUserId").val(userId);
        $("#editName").val($(this).data("name"));
        $("#editSurname").val($(this).data("surname"));
        $("#editUsername").val($(this).data("username"));
        $("#editEmail").val($(this).data("email"));
        $("#editRole").val($(this).data("role"));
        $("#editUserModal").modal("show");
    });

    $("#saveUserChanges").click(function() {
        let userId = $("#editUserId").val();
        let updatedData = {
            name: $("#editName").val(),
            surname: $("#editSurname").val(),
            username: $("#editUsername").val(),
            email: $("#editEmail").val(),
            role: $("#editRole").val()
        };

        $.ajax({
            url: "/update_user_ajax/" + userId,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(updatedData),
            success: function(response) {
                if (response.success) {
                    alert("Dane użytkownika zaktualizowane pomyślnie.");
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

// Generowanie hasła jako ciągu znaków
function generatePassword(length) {
    let charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
}

// Resetowanie hasła
document.getElementById('resetPasswordBtn').addEventListener('click', function() {
    if (confirm('Czy na pewno chcesz zresetować hasło tego użytkownika?')) {
        let userId = document.getElementById('editUserId').value;
        let newPassword = generatePassword(10);

        fetch(`/reset_password/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: newPassword }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Nowe hasło zostało wysłane na adres e-mail użytkownika.');
            } else {
                alert('Wystąpił błąd: ' + data.message);
            }
        })
        .catch(error => {
            alert('Wystąpił błąd podczas resetowania hasła.');
            console.error('Error:', error);
        });
    }
});

// Dodawanie użytkownika
function add_user() {
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
}

$(document).ready(function() {
    del_user()
    edit_user()
    add_user()
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
                    del_user()
                    edit_user()
                    add_user()
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