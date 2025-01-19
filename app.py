from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Logika do weryfikacji danych logowania
        if username == "admin" and password == "admin":  # Przykładowa walidacja
            return redirect(url_for('home'))  # Po zalogowaniu przekierowanie do strony głównej
        else:
            return render_template('login.html', error='Nieprawidłowe dane logowania')
    
    return render_template('login.html', error=None)

@app.route('/moje_bilety')
def home():
    return render_template('pages/template.html', title='Moje bilety', header='Moje bilety')

if __name__ == '__main__':
    app.run(debug=True)
