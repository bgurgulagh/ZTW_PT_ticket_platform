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
def moj_profil():
    return render_template('pages/template.html', title='Mój profil', header='Mój profil')

if __name__ == '__main__':
    app.run(debug=True)
