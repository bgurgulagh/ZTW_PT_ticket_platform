from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Logika do weryfikacji danych logowania
        if username == "admin" and password == "admin":  # Przykładowa walidacja
            return redirect(url_for('moje_bilety'))  # Po zalogowaniu przekierowanie do strony głównej
        else:
            return render_template('login.html', error='Nieprawidłowe dane logowania')
    
    return render_template('login.html', error=None)

@app.route('/moje_bilety')
def moje_bilety():
    return render_template('pages/template.html', title='Moje bilety', header='Moje bilety')

@app.route('/kup_bilet')
def kup_bilet():
    return render_template('pages/template.html', title='Kup bilety', header='Kup bilety')

@app.route('/moj_profil')
def moj_profil_zb():
    return render_template('pages/profile_user.html', title='Mój profil', header='Mój profil')

@app.route('/profil_kontrolera')
def profil_kontrolera_zb():
    return render_template('pages/controler_noEdit.html', title='Profil kontrolera', header='Mój profil')

@app.route('/kontrola')
def kontrola_zb():
    return render_template('pages/controler_ticketCheck.html', title='Kontrola', header='Kontrola biletów')

@app.route('/rejestracja_zb')
def rejestracja_zb():
    return render_template('signup_zb.html')

@app.route('/admin_users_zb')
def admin_users_zb():
    return render_template('pages/admin_userBase.html', title='Użytkownicy', header='Użytkownicy')

if __name__ == '__main__':
    app.run(debug=True)
