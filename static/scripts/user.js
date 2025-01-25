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