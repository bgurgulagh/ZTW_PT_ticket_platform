// Usuwanie użytkownika
$(document).ready(function() {
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
});

// Edytowanie użytkownika
$(document).ready(function() {
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
});

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