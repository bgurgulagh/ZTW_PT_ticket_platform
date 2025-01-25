from flask import Flask, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///default.db'
app.config['SQLALCHEMY_BINDS'] = {
    'users': 'sqlite:///users.db',
    'tickets': 'sqlite:///tickets.db',
    'tickets_data': 'sqlite:///tickets_data.db'
}
db = SQLAlchemy(app)

class User(db.Model):
    __bind_key__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(100), nullable=False)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f'<User {self.username}>'

class Ticket(db.Model):
    __bind_key__ = 'tickets'
    id = db.Column(db.Integer, primary_key=True)
    token = db.Column(db.String(15), unique=True, nullable=False)
    validation = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(10), nullable=False)
    tariff = db.Column(db.String(10), nullable=False)
    zone = db.Column(db.String(10), nullable=False)
    price = db.Column(db.String(10), nullable=False)
    description = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Token {self.token}>'

class TicketData(db.Model):
    __bind_key__ = 'tickets_data'
    id = db.Column(db.Integer, primary_key=True)
    time = db.Column(db.String(10), nullable=False)
    tariff = db.Column(db.String(10), nullable=False)
    zone = db.Column(db.String(10), nullable=False)
    price = db.Column(db.String(10), nullable=False)
    description = db.Column(db.String(150), nullable=False)

    def __repr__(self):
        return f'<Time {self.time}>'

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

@app.route('/admin_users')
def admin_users():
    users = User.query.all()
    return render_template('pages/admin_userBase.html', title='Użytkownicy', header='Użytkownicy', users=users)

@app.route('/delete_user_ajax/<int:user_id>', methods=['DELETE'])
def delete_user_ajax(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Użytkownik nie istnieje"}), 404

@app.route('/update_user_ajax/<int:user_id>', methods=['POST'])
def update_user_ajax(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "error": "Użytkownik nie istnieje"}), 404

    data = request.get_json()
    user.name = data.get('name')
    user.surname = data.get('surname')
    user.username = data.get('username')
    user.email = data.get('email')
    user.role = data.get('role')

    db.session.commit()
    return jsonify({"success": True})

# endopinty tymczasowe do developmentu bazy danych
@app.route('/add_user')
def add_user():
    new_user = User(name='John', surname='Doe', username='bzzzf', password='gula18', role='kontroler', email='email@emafil.com')
    db.session.add(new_user)
    db.session.commit()
    return f'Użytkownik został dodany.'

@app.route('/users')
def get_users():
    users = User.query.all()
    user_list = [f"{user.id}: {user.name} {user.surname}, l.{user.username}, h.{user.password}, {user.role} ({user.email})" for user in users]
    return "<br>".join(user_list)

if __name__ == '__main__':
    with app.app_context():
        db.create_all(bind_key=['users', 'tickets', 'tickets_data'])
        app.run(debug=True)