from flask import Flask, render_template, request, redirect, url_for, jsonify, flash, session, g
from flask_sqlalchemy import SQLAlchemy
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from functools import wraps
import random, string, re, json

app = Flask(__name__)
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_DEFAULT_SENDER'] = 'Portal Pasażera KMK <portal.pasazera@gmail.com>'
app.config['MAIL_USERNAME'] = 'portal.pasazera@gmail.com'
app.config['MAIL_PASSWORD'] = 'ygfs poxc skdv ebdj' # Hasło testowe przestanie działać po pewnym czasie
mail = Mail(app)
app.config['SESSION_PERMANENT'] = True
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(minutes=60)  # Sesja ważna przez 60 minut
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///default.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
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
    username = db.Column(db.String(80), nullable=False)
    token = db.Column(db.String(10), unique=True, nullable=False)
    validation = db.Column(db.DateTime, nullable=False)
    time = db.Column(db.String(10), nullable=False)
    tariff = db.Column(db.String(10), nullable=False)
    zone = db.Column(db.String(10), nullable=False)
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

# Generowanie tokentów do zakupu biletów
def generate_unique_token():
    while True:
        token = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
        if not Ticket.query.filter_by(token=token).first():
            return token

# Przekształcanie czasu do sprawdzania ważności bieltów
def parse_time(time_str):
    match = re.match(r"(\d+)(min|h|day)", time_str)
    if match:
        value, unit = match.groups()
        value = int(value)
        if unit == "min":
            return timedelta(minutes=value)
        elif unit == "h":
            return timedelta(hours=value)
        elif unit == "day":
            return timedelta(days=value)
    return None

# Logika logowania do odpowiedniej roli
def redirect_based_on_role(role):
    if role == "admin":
        return redirect(url_for('admin_uzytkownicy'))
    elif role == "pasażer":
        return redirect(url_for('bilety'))
    elif role == "kontroler":
        return redirect(url_for('kontroler_kontrola'))
    else:
        return redirect(url_for('login'))

@app.before_request
def load_logged_in_user():
    user_id = session.get('user_id')
    if user_id:
        g.user = User.query.get(user_id)
    else:
        g.user = None

@app.route('/', methods=['GET', 'POST'])
def login():
    session.clear()
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']

        # Weryfikacja danych logowania
        user = User.query.filter_by(username=username).first()
        if user and check_password_hash(user.password, password):
            # Zapisz dane użytkownika w sesji
            session['user_id'] = user.id
            session['username'] = user.username
            session['role'] = user.role
            session.permanent = True  # Sesja wygaśnie po pewnym czasie bezczynności
            print(f"Użytkownik {user.username} zalogowany z rolą: {user.role}")
            # Przekierowanie na podstawie roli
            return redirect_based_on_role(user.role)
        else:
            print(f"Nieudane logowanie dla użytkownika: {username}")
            return render_template('login.html', error='Nieprawidłowe dane logowania', gUser=g.user)
        # return redirect(url_for('moje_bilety'))
    else:
        # Gdy żądanie jest GET, po prostu renderuj stronę logowania
        return render_template('login.html', error=None, gUser=g.user)

@app.route('/logout')
def logout():
    session.clear()
    flash("Zostałeś wylogowany.", "info")
    return redirect(url_for('login'))

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash("Zaloguj się, aby uzyskać dostęp do tej strony.", "warning")
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def role_required(role):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            if session.get('role') != role:
                flash("Nie masz uprawnień do tej strony.", "danger")
                return redirect(url_for('login'))
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route('/rejestracja')
def rejestracja():
    return render_template('signup.html' , gUser=g.user)

@app.route('/profil')
def profil():
    return render_template('pages/profile_user.html', title='Mój profil –', header='Mój profil', gUser=g.user)

@app.route('/admin/uzytkownicy')
@login_required
@role_required('admin')
def admin_uzytkownicy():
    users = User.query.all()
    return render_template('pages/admin_userBase.html', title='Użytkownicy –', header='Użytkownicy', users=users, gUser=g.user)

@app.route('/admin/bilety')
@login_required
@role_required('admin')
def admin_bilety():
    tickets = TicketData.query.all()
    return render_template('pages/admin_ticketBase.html', title='Bilety –', header='Bilety', tickets=tickets, gUser=g.user)

@app.route('/bilety')
@login_required
@role_required('pasażer')
def bilety():
    return render_template('pages/tickets_check.html', title='Moje bilety –', header='Moje bilety', gUser=g.user)

@app.route('/bilety/sklep')
@login_required
@role_required('pasażer')
def bilety_sklep():
    return render_template('pages/tickets.html', title='Kup bilet –', header='Kup bilet', gUser=g.user)

@app.route('/bilety/kontrola')
@login_required
@role_required('pasażer')
def bilety_kontrola():
    token = request.args.get("token")
    if not token:
        flash("Brak tokena biletu.", "error")
        return redirect(url_for("tickets"))

    return render_template("pages/ticketCheck.html", title="Kontrola biletów", header="Kontrola biletów", gUser=g.user, token=token)

@app.route('/kontroler/profil')
@login_required
@role_required('kontroler')
def kontroler_profil():
    return render_template('pages/controler_noEdit.html', title='Profil kontrolera –', header='Mój profil' , gUser=g.user)

@app.route('/kontroler/kontrola')
@login_required
@role_required('kontroler')
def kontroler_kontrola():
    return render_template('pages/controler_ticketCheck.html', title='Kontrola –', header='Kontrola biletów' , gUser=g.user)

# Usunięcie biletu w panelu admina
@app.route('/delete_ticket_ajax/<int:ticketId>', methods=['DELETE'])
def delete_ticket_ajax(ticketId):
    ticket = TicketData.query.get(ticketId)

    if ticket:
        db.session.delete(ticket)
        db.session.commit()
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Bilet nie istnieje"}), 404

# Edycja danych biletu w panelu admina
@app.route('/update_ticket_ajax/<int:ticketId>', methods=['POST'])
def update_ticket_ajax(ticketId):
    ticket = TicketData.query.get(ticketId)
    if not ticket:
        return jsonify({"success": False, "error": "Bilet nie istnieje"}), 404

    data = request.get_json()
    ticket.time = data.get('time')
    ticket.tariff = data.get('tariff')
    ticket.zone = data.get('zone')
    ticket.price = data.get('price')
    ticket.description = data.get('description')

    db.session.commit()
    return jsonify({"success": True})

# Dodanie nowego biletu w panelu admina

@app.route('/add_ticket_ajax', methods=['POST'])
def add_ticket_ajax():
    data = request.get_json()
    try:
        new_ticket = TicketData(
            time = data['time'],
            tariff = data['tariff'],
            zone = data['zone'],
            price = data['price'],
            description = data['description']
        )
        db.session.add(new_ticket)
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)})

# Filtrowanie rekordów biletów w panelu admina
@app.route('/filter_tickets', methods=['GET'])
def filter_tickets():
    tariff = request.args.get('tariff', '')
    zone = request.args.get('zone', '')

    query = TicketData.query
    if tariff:
        query = query.filter(TicketData.tariff.ilike(f"%{tariff}%"))
    if zone:
        query = query.filter(TicketData.zone.ilike(f"%{zone}%"))

    tickets = query.all()
    tickets_data = [
        {
            "id": ticket.id,
            "time": ticket.time,
            "tariff": ticket.tariff,
            "zone": ticket.zone,
            "price": ticket.price,
            "description": ticket.description
        }
        for ticket in tickets
    ]
    return jsonify(tickets_data)

# Usunięcie użytkownika w panelu admina
@app.route('/delete_user_ajax/<int:user_id>', methods=['DELETE'])
def delete_user_ajax(user_id):
    user = User.query.get(user_id)

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "error": "Użytkownik nie istnieje"}), 404

# Edycja danych użytkownika w panelu admina
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

    try:
        msg = Message("Dane konta w Portalu Pasażera KMK", recipients=[data.get('email')])
        msg.body = f"Twoje dane w Profilu Pasażera KMK uległy zmianie.\n\nAktualne dane Twojego konta znajdziesz poniżej:\n\nLogin: {data.get('username')}\nImię: {data.get('name')}\nNazwisko: {data.get('surname')}\nRola: {data.get('role')}"
        mail.send(msg)
    except:
        print("Nie udało się wysłać powiadomienia e-mail")

    return jsonify({"success": True})

# Edycja danych użytkownika w profilu
@app.route('/update_profile_ajax/<int:user_id>', methods=['POST'])
def update_profile_ajax(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"success": False, "error": "Użytkownik nie istnieje"}), 404

    data = request.get_json()
    user.name = data.get('name')
    user.surname = data.get('surname')
    user.username = data.get('username')
    user.password = generate_password_hash(data.get('password'))
    user.email = data.get('email')
    user.role = data.get('role')

    db.session.commit()

    try:
        msg = Message("Dane konta w Portalu Pasażera KMK", recipients=[data.get('email')])
        msg.body = f"Twoje dane w Profilu Pasażera KMK uległy zmianie.\n\nAktualne dane Twojego konta znajdziesz poniżej:\n\nLogin: {data.get('username')}\nImię: {data.get('name')}\nNazwisko: {data.get('surname')}\nRola: {data.get('role')}"
        mail.send(msg)
    except:
        print("Nie udało się wysłać powiadomienia e-mail")

    return jsonify({"success": True})

# Dodanie nowego użytkownika w panelu admina
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

        try:
            msg = Message("Witamy w Portalu Pasażera KMK", recipients=[data['email']])
            msg.body = f"Witamy w Portalu Pasażera KMK!\n\nDane logowania do Twojego nowego konta znajdziesz poniżej:\n\nLogin: {data['username']}\nHasło: {data['password']}"
            mail.send(msg)
        except:
            print("Nie udało się wysłać powiadomienia e-mail")

        return jsonify({"success": True})
    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)})

# Rejestracja nowego użytkownika
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

        try:
            msg = Message("Witamy w Portalu Pasażera KMK", recipients=[email])
            msg.body = f"Witamy w Portalu Pasażera KMK!\n\nDane logowania do Twojego nowego konta znajdziesz poniżej:\n\nLogin: {username}\nHasło: {password}"
            mail.send(msg)
        except:
            print("Nie udało się wysłać powiadomienia e-mail")

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

# Filtrowanie rekordów w panelu admina
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

# Resetowanie hasła - request admina
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

    try:
        msg = Message("Reset hasła do Portalu Pasażera KMK", recipients=[user.email])
        msg.body = f"Twoje nowe hasło do Portalu Pasażera KMK to: {new_password}"
        mail.send(msg)
    except:
        print("Nie udało się wysłać powiadomienia e-mail")

    return jsonify({'success': True, 'message': 'Hasło zresetowane i wysłane na e-mail.'})

# Przekazywanie temaplate biletów
@app.route('/get_ticket_template')
def get_ticket_template():
    return render_template('ticket.html')

# Przekazywanie temaplate biletów do sprawdzania pozostałego czasu
@app.route('/get_ticket_check_template')
def get_ticket_check_template():
    return render_template('ticket_check.html')

# Wczytywanie biletów
@app.route('/get_tickets')
def get_tickets():
    tickets = TicketData.query.all()
    tickets_list = [
        {
            'id': ticket.id,
            'time': ticket.time,
            'tariff': ticket.tariff,
            'zone': ticket.zone,
            'price': ticket.price,
            'description': ticket.description
        } for ticket in tickets
    ]
    return jsonify(tickets_list)

# Kupowanie biletów
@app.route('/buy_ticket', methods=['POST'])
def buy_ticket():
    try:
        tickets = request.json
        if not tickets:
            return jsonify({"success": False, "message": "Brak danych do zapisania"}), 400

        validation_time = datetime.now()
        username = g.user.username

        new_tickets = []
        for ticket in tickets:
            token = generate_unique_token()
            new_ticket = Ticket(
                validation=validation_time,
                token=token,
                username=username,
                time=ticket['time'],
                tariff=ticket['tariff'],
                zone=ticket['zone'],
                description=ticket['description']
            )
            new_tickets.append(new_ticket)

        db.session.add_all(new_tickets)
        db.session.commit()

        return jsonify({"success": True, "message": f"Zapisano {len(new_tickets)} biletów"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# Sprawdzanie zakupionych biletów
@app.route('/get_user_tickets')
def get_user_tickets():
    username = g.user.username
    tickets = Ticket.query.filter_by(username=username).all()

    active_tickets = []
    inactive_tickets = []
    current_time = datetime.now()

    for ticket in tickets:
        validation_time = ticket.validation
        allowed_duration = parse_time(ticket.time)
        remaining_time = ""
        is_valid = False

        if allowed_duration:
            time_diff = allowed_duration - (current_time - validation_time)
            if time_diff.total_seconds() > 0:
                is_valid = True
                days, rem = divmod(time_diff.total_seconds(), 86400)
                hours, rem = divmod(rem, 3600)
                minutes = rem // 60

                if days >= 2:
                    remaining_time = f"{int(days)} dni, {int(hours)} h {int(minutes)} min"
                elif days >= 1:
                    remaining_time = f"{int(days)} dzień, {int(hours)} h {int(minutes)} min"
                elif hours >= 1:
                    remaining_time = f"{int(hours)} h {int(minutes)} min"
                else:
                    remaining_time = f"{int(minutes)} min"
            else:
                remaining_time = "Nieważny"

        buy_time = validation_time.strftime("%d.%m.%Y %H:%M")

        ticket_data = {
            "id": ticket.id,
            "time": ticket.time,
            "tariff": ticket.tariff,
            "zone": ticket.zone,
            "description": ticket.description,
            "buy_time": buy_time,
            "remaining_time": remaining_time,
            "remaining_seconds": time_diff.total_seconds() if is_valid else -1,
            "is_valid": is_valid,
            "token": ticket.token
        }

        if is_valid:
            active_tickets.append(ticket_data)
        else:
            inactive_tickets.append(ticket_data)

    active_tickets.sort(key=lambda x: x["remaining_seconds"])
    inactive_tickets.sort(key=lambda x: x["buy_time"], reverse=True)

    return jsonify({"active": active_tickets, "inactive": inactive_tickets})

# Kontrola biletów
@app.route('/check_ticket', methods=['POST'])
def check_ticket():
    data = request.get_json()
    token = data.get('token')

    if not token:
        return jsonify({"success": False, "message": "Proszę podać ID biletu."})

    ticket = Ticket.query.filter_by(token=token).first()
    if not ticket:
        return jsonify({"success": False, "message": "Bilet nie istnieje."})

    current_time = datetime.now()
    time_difference = current_time - ticket.validation
    allowed_duration = parse_time(ticket.time)

    print(f"Ticket time: {ticket.time}")
    print(f"Validation time: {ticket.validation}")
    print(f"Current time: {current_time}")
    print(f"Time difference: {time_difference}")
    print(f"Allowed duration: {allowed_duration}")

    if allowed_duration and time_difference.total_seconds() <= allowed_duration.total_seconds():
        remaining_time = allowed_duration - time_difference

        remaining_days = remaining_time.days
        remaining_seconds = remaining_time.seconds
        remaining_hours = remaining_seconds // 3600
        remaining_minutes = (remaining_seconds % 3600) // 60

        if remaining_days > 0:
            message = f"Bilet jest ważny, pozostało {remaining_days} dni, {remaining_hours} godzin i {remaining_minutes} minut."
        elif remaining_hours > 0:
            message = f"Bilet jest ważny, pozostało {remaining_hours} godzin i {remaining_minutes} minut."
        else:
            message = f"Bilet jest ważny, pozostało {remaining_minutes} minut."

        return jsonify({"success": True, "message": message})
    else:
        return jsonify({"success": False, "message": "Bilet jest nieważny."})
    
@app.route('/server/time')
def get_time():
    now = datetime.now().isoformat(timespec='seconds')
    return jsonify({"time": now})

# endpointy deweloperskie
@app.route('/dev/tickets')
def dev_tickets():
    tickets = Ticket.query.all()
    ticket_list = [f"{ticket.id}: {ticket.username}, {ticket.token}, v.{ticket.validation}, {ticket.time}, {ticket.tariff}, {ticket.zone}, {ticket.description}" for ticket in tickets]
    return "<br>".join(ticket_list)

@app.route('/dev/tickets/data')
def dev_tickets_data():
    tickets = TicketData.query.all()
    ticket_list = [f"{ticket.id}: {ticket.time}, {ticket.tariff}, {ticket.zone}, {ticket.price}, {ticket.description}" for ticket in tickets]
    return "<br>".join(ticket_list)

@app.route('/dev/users')
def dev_users():
    users = User.query.all()
    user_list = [f"{user.id}: {user.name} {user.surname}, l.{user.username}, h.{user.password}, {user.role} ({user.email})" for user in users]
    return "<br>".join(user_list)

@app.route('/dev/ticket_buy')
def dev_ticket_buy():
    validation_time = datetime.now()
    token = generate_unique_token()
    username = "developer"
    time = "6min"
    tariff = "normal"
    zone = "all"
    description = "Bilet deweloperski 6-minutowy"
    
    new_ticket = Ticket(validation=validation_time, token=token, username=username, time=time, tariff=tariff, zone=zone, description=description)
    db.session.add(new_ticket)
    db.session.commit()
    return f'Bilet został zapisany'

@app.route('/dev/tickets/config')
def dev_tickets_config():
    db.session.query(TicketData).delete()
    db.session.commit()

    with open('tickets_config.json', 'r', encoding='utf-8') as f:
        ticket_data = json.load(f)
    
    for data in ticket_data:
        new_ticket = TicketData(
            time=data['time'],
            tariff=data['tariff'],
            zone=data['zone'],
            price=data['price'],
            description=data['description']
        )
        db.session.add(new_ticket)
    
    db.session.commit()
    return f'Baza biletów została zapisana'

@app.route('/dev/users/config')
def dev_users_config():
    db.session.query(User).delete()
    db.session.commit()

    new_user = User(
        name="admin",
        surname="admin",
        username="admin",
        password=generate_password_hash("admin"),
        email="admin@admin.com",
        role="admin"
    )
    db.session.add(new_user)

    new_user = User(
        name="kontrola",
        surname="kontrola",
        username="kontrola",
        password=generate_password_hash("kontrola"),
        email="kontrola@kontrola.com",
        role="kontroler"
    )
    db.session.add(new_user)

    new_user = User(
        name="user",
        surname="user",
        username="user",
        password=generate_password_hash("user"),
        email="user@user.com",
        role="pasażer"
    )
    db.session.add(new_user)

    db.session.commit()
    return f'Baza użytkowników została zapisana'

@app.route('/dev/tickets/reset')
def dev_tickets_reset():
    db.session.query(Ticket).delete()
    db.session.commit()
    return f'Baza kupionych biletów została zresetowana'

# koniec endpointów deweloperskich

if __name__ == '__main__':
    with app.app_context():
        db.create_all(bind_key=['users', 'tickets', 'tickets_data'])
        app.run(debug=True)