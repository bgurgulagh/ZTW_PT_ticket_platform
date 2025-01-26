from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp-relay.gmail.com' # Póki co niekatywne, ponieważ musze założyć najpierw skrzynkę, ogarnę przy następnej aktualizacji
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'portal.pasazera.kmk@gmail.com'
app.config['MAIL_PASSWORD'] = 'hasło' # Trzeba podać hasło do skrzynki
mail = Mail(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///default.db'
app.config['SECRET_KEY'] = 'supersecretkey'
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
    return render_template('pages/tickets_check.html', title='Moje bilety –', header='Moje bilety')

@app.route('/kup_bilet')
def kup_bilet():
    return render_template('pages/tickets.html', title='Kup bilety –', header='Kup bilety')

@app.route('/moj_profil')
def moj_profil():
    return render_template('pages/profile_user.html', title='Mój profil –', header='Mój profil')

@app.route('/profil_kontrolera')
def profil_kontrolera():
    return render_template('pages/controler_noEdit.html', title='Profil kontrolera –', header='Mój profil')

@app.route('/kontrola')
def kontrola():
    return render_template('pages/controler_ticketCheck.html', title='Kontrola –', header='Kontrola biletów')

@app.route('/rejestracja')
def rejestracja():
    return render_template('signup.html')

@app.route('/admin_users')
def admin_users():
    users = User.query.all()
    return render_template('pages/admin_userBase.html', title='Użytkownicy –', header='Użytkownicy', users=users)

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

@app.route('/add_user_ajax', methods=['POST'])
def add_user_ajax():
    data = request.get_json()
    try:
        new_user = User(
            name=data['name'],
            surname=data['surname'],
            username=data['username'],
            email=data['email'],
            role=data['role'],
            password=generate_password_hash(data['password'])
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)})

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        firstname = request.form.get('firstname')
        lastname = request.form.get('lastname')
        username = request.form.get('username')
        email = request.form.get('email')
        role = request.form.get('role')
        password = request.form.get('password')

        # Sprawdzenie, czy użytkownik już istnieje
        existing_user = User.query.filter_by(username=username).first()
        if existing_user:
            flash('Nazwa użytkownika jest już zajęta. Wybierz inną.', 'danger')
            return redirect(url_for('signup'))

        new_user = User(
            name=firstname,
            surname=lastname,
            username=username,
            email=email,
            password=generate_password_hash(password),
            role=role
        )

        db.session.add(new_user)
        db.session.commit()
        flash('Rejestracja zakończona sukcesem! Możesz się teraz zalogować.', 'success')
        return redirect(url_for('login'))

    return render_template('signup.html')

@app.route('/filter_users', methods=['GET'])
def filter_users():
    name = request.args.get('name', '')
    surname = request.args.get('surname', '')
    username = request.args.get('username', '')
    role = request.args.get('role', '')

    query = User.query
    if name:
        query = query.filter(User.name.ilike(f"%{name}%"))
    if surname:
        query = query.filter(User.surname.ilike(f"%{surname}%"))
    if username:
        query = query.filter(User.username.ilike(f"%{username}%"))
    if role:
        query = query.filter(User.role.ilike(f"%{role}%"))

    users = query.all()
    users_data = [
        {
            "id": user.id,
            "name": user.name,
            "surname": user.surname,
            "username": user.username,
            "email": user.email,
            "role": user.role
        }
        for user in users
    ]
    return jsonify(users_data)

@app.route('/reset_password/<int:user_id>', methods=['POST'])
def reset_password(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'success': False, 'message': 'Użytkownik nie istnieje'}), 404

    data = request.get_json()
    new_password = data.get('password')

    if not new_password:
        return jsonify({'success': False, 'message': 'Brak hasła'}), 400

    user.password = generate_password_hash(new_password)
    db.session.commit()

    #msg = Message("Twoje nowe hasło", sender="Portal Pasażera KMK", recipients=[user.email])
    #msg.body = f"Twoje nowe hasło do Portalu Pasażera to: {new_password}"
    #mail.send(msg)

    return jsonify({'success': True, 'message': 'Hasło zresetowane i wysłane na e-mail.'})

# endpointy tymczasowe do developmentu bazy danych
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
# koniec tymczasowych endpointów

if __name__ == '__main__':
    with app.app_context():
        db.create_all(bind_key=['users', 'tickets', 'tickets_data'])
        app.run(debug=True)