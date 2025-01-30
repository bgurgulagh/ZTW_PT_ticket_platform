# Aplikacja webowa do zarządzania biletami KMK

## Wstęp
### Opis projektu
Aplikacja webowa powstała z myślą o zarządzaniu biletami komunikacji miejskiej. System pozwala na rejestrację oraz logowanie użytkowników, zakup i przeglądanie posiadanych przez pasażerów biletów, kontrolę biletów oraz zarządzanie bazami biletów oraz wszystkich użytkowników z poziomu administratora. Aplikacja jest responsywna, dostosowana do róznych wielkości ekranów, tak by mogła być używana zarówno z użyciem komputera jak i telefonu.

### Opis funkcjonalności
W celu zapewnienia kompleksowości systemu zarządzania biletami, potencjalni użytkownicy aplikacji zostali podzieleni na trzy grupy: pasażerów, kontrolerów oraz administratorów. Dostępne funkcjonalności różnią się ze względu na posiadaną przez użytkownika rolę.

**Funkcjonalności pasażera**
- rejestracja nowego użytkownika
- logowanie zarejestrowanego użytkownika
- przegląd zakupionych biletów, w tym sprawdzenie ich ważności
- pokazanie biletu kontrolerowi w czasie kontroli
- przegląd dostępnych do zakupu biletów
- zakup biletów
- przegląd danych w profilu użytkownika
- edycja danych w profilu użytkownika
- usunięcie konta

**Funkcjonalności kontrolera**
- logowanie zarejestrowanego użytkownika
- kontrola ważności biletu pasażera
- przegląd danych w profilu użytkownika

**Funkcjonalności administratora**
- logowanie zarejestrowanego użytkownika
- przegląd bazy biletów
- edycja rekordów w bazie biletów
  - edycja danych
  - dodanie biletu
  - usunięcie biletu
- przegląd bazy użytkowników
- edycja rekordów w bazie użytkowników
  - edycja danych użytkownika
  - wysłanie wiadomości w celu zresetowania hasła użytkownika
  - dodanie użytkownika
  - usunięcie użytkownika 
- przegląd danych w profilu użytkownika
- edycja danych w profilu użytkownika

## Wykorzystane technologie
Frontend: JavaScript, HTML, CSS, Bootstrap, jQuery
Backend: Flask
Baza danych: SQLAlchemy

## Uruchomienie aplikacji
1. Utworzenie wirtualnego środowiska
```bash
python -m venv .env  
```  
2. Aktywowanie wirtualnego środowiska
```bash 
.\.env\Scripts\activate  
```
3. Instalacja wymaganych pakietów
```bash 
pip install -r requirements.txt  
```  
4. Uruchomienie aplikacji
```bash 
python app.py
```  

## Struktura folderów
Pliki projektu zostały podzielone na podfoldery:
- instance - zawierający bazy danych:
    - tickets_data.db - zbiór informacji o dostępnych biletach
    - tickets.db - zbiór informacji o kupionych biletach
    - users.db - zbiór wszystkich użytkowników systemu
- static
    - css - zawierający arkusze stylów
        - style.css - główny arkusz stylu dla aplikacji
        - ticket_style.css - arkusz stylu dla komponentu biletu
    - images - zawierający obrazy
    - scripts - zawierający skrypty
- templates - zawierający pliki html z elementami stron jak np. nagłówek, stopka, czy modale
    - pages - zawierający podstrony aplikacji

Pozostałe pliki w głównym folderze projektu:
- app.py - główny plik backendowy z konfiguracją aplikacji, definicją baz danych, logiką aplikacji i routingiem
- README.md - dokumentacja techniczna
- requirements.txt - plik z wymaganymi do  zainstalowania pakietami
  
## Architektura informacji
<img width="2120" alt="Information Architecture v4" src="https://github.com/user-attachments/assets/b160c3d2-afd7-4054-af92-1114f6584587" />  

## Kolorystyka
<img width="1778" alt="Colour Palette" src="https://github.com/user-attachments/assets/627ebd31-ce2a-423e-a22a-083c7237cbfb" />

| Kolor  | #HEX | Przeznaczenie |
| ------------- | ------------- | ------------- |
| Granatowy | #00305F  | przyciski, tło paska nawigacji, tło stopki |
| Ciemny szary | #9D9D9C | nieaktywne przyciski |  
| Jasny szary | #E6E6E6 | tło biletów, tło pól tekstowych, inne tła i elementy dodatkowe | 
| Zielony | #65A930 | potwierdzenie płatności, przycisk do kupowania biletów, gdy aktywny |
| Czerwony | #E00726 | błędy, ostrzeżenia |
 
## Zawartość baz danych  
### users.db (w app.py pod klasą User) - zbiór wszystkich użytkowników systemu  
| Atrybut  | Opis |
| ------------- | ------------- |
| name | imię użytkownika  |
| surname | nazwisko użytkownika  |
| username | login użytkownika  |
| password | hasło użytkownika  |
| email | adres email użytkownika  |
| role | rola użytkownika w systemie (Administrator - "admin", Kontroler - "kontroler", Pasażer - "pasażer")  |
  
### tickets.db (w app.py pod klasą Ticket) - zbiór informacji o kupionych biletach  
| Atrybut  | Opis |
| ------------- | ------------- |
| username | login użytkownika, który dokonał zakupu | 
| token | identyfikator zakupionego biletu w systemie (generowany automatycznie przy zakupie biletu), podawany podczas kontroli biletów  |
| validation | data i godzina zakupu biletu w formacie DateTime  |
| time | okres ważności zakupionego biletu  |
| tariff | taryfa zakupionego biletu (normalny - "normal", ulgowy - "discount") | 
| zone | strefa, w której obowiązuje zakupiony bilet (wszystkie - "all", pierwsza - "first")  |
| description | opis zakupionego biletu  |
  
### tickets_data.db (w app.py pod klasą TicketData) - zbiór informacji o dostępnych biletach  
| Atrybut  | Opis |
| ------------- | ------------- |
| time | okres ważności biletu  |
| tariff | taryfa biletu (normalny - "normal", ulgowy - "discount")  |
| zone | strefa, w której obowiązuje bilet (wszystkie - "all", pierwsza - "first")  |
| price | cena biletu  |
| description | opis biletu  |

## Logika logowania
Aplikacja zabezpiecza dostęp do odpowiednich funkcjonalności poprzez rejestrację użytkownika, nadanie mu odpowiedniej roli (pasażera, kontrolera lub admina) i póżniejsze logowanie. 

Funkcja redirect_based_on_role(role) sprawdza rolę użytkownika po zalogowaniu i przekierowuje go do odpowiedniego widoku:
- admin → widok zarządzania użytkownikami
- pasażer → widok biletów
- kontroler → widok kontroli biletów

<details>
  <summary> redirect_based_on_role(role)</summary>
  
  ```python
def redirect_based_on_role(role):
    if role == "admin":
        return redirect(url_for('admin_uzytkownicy'))
    elif role == "pasażer":
        return redirect(url_for('bilety'))
    elif role == "kontroler":
        return redirect(url_for('kontroler_kontrola'))
    else:
        return redirect(url_for('login'))
```
  
</details>

Dekoratory login_required(f) i role_required(role) sprawdzają, czy użytkownik jest zalogowany oraz czy ma odpowiednią rolę (uprawnienia), aby wyświetlić daną stronę.

<details>
  <summary> login_required(f) i role_required(role)</summary>
  
```python
from functools import wraps

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
```
  
</details>

## Obsługa biletów

### Kupowanie biletu
Podczas zakupu biletu tworzony jest nowy bilet, dla którego generowany jest unikalny token. Do biletu przypisywane są również informacje o czasie zakupu biletu oraz username użytkownika, który go kupił. Bilet jest zapisywany do bazy danych. Wyświetlany jest komunikat z informacją o pomyślnie kupionym bilecie. 

<details>
  <summary> buy_ticket()</summary>
  
```python
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
```
  
</details>

### Wyświetlanie kupionych biletów pasażera
Zakupione przez pasażera bilety są podzielone na dwie kategorie: aktywne i nieaktywne. Dla każdego biletu sprawdzana jest data zakupui i czas ważności biletu. Na tej podstawie obliczany jest pozostały czas dla biletów aktywnych lub bilet zostaje sklasyfikowany jako nieważny. Interfejs pokazuje informacje o statusie biletu oraz pozostałym do końca ważności czasie.

<details>
  <summary> get_user_tickets()</summary>
  
```python
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
        }

        if is_valid:
            active_tickets.append(ticket_data)
        else:
            inactive_tickets.append(ticket_data)

    active_tickets.sort(key=lambda x: x["remaining_seconds"])
    inactive_tickets.sort(key=lambda x: x["buy_time"], reverse=True)

    return jsonify({"active": active_tickets, "inactive": inactive_tickets})
```
  
</details>

### Kontrola biletów przez kontrolera
W celu sprawdzenia ważności biletu przez kontrolera, potrzebne jest podanie unikalnego tokenu, który generowany jest przy zakupie biletu. Na podstawie czasu zakupienia biletu oraz czasu ważności biletu, obliczane jest, czy bilet jest ważny. Jeśli tak, obliczane jest, ile pozostało czasu do końca jego ważności. Interfejs wyświetla odpowiedni komunikat dla kontrolera.

<details>
  <summary> check_ticket()</summary>
  
```python
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

        # Oblicz dni, godziny i minuty
        remaining_days = remaining_time.days
        remaining_seconds = remaining_time.seconds
        remaining_hours = remaining_seconds // 3600
        remaining_minutes = (remaining_seconds % 3600) // 60

        # Tworzenie komunikatu
        if remaining_days > 0:
            message = f"Bilet jest ważny, pozostało {remaining_days} dni, {remaining_hours} godzin i {remaining_minutes} minut."
        elif remaining_hours > 0:
            message = f"Bilet jest ważny, pozostało {remaining_hours} godzin i {remaining_minutes} minut."
        else:
            message = f"Bilet jest ważny, pozostało {remaining_minutes} minut."

        return jsonify({"success": True, "message": message})
    else:
        return jsonify({"success": False, "message": "Bilet jest nieważny."})
```
  
</details>

## Instrukcja dla użytkowników

### Ogólne

Aby móc korzystać z aplikacji konieczne jest zalogowanie się zarejestrowanego użytkownika za pomocą poprawnego loginu i hasła. Po zalogowaniu się, nawigacja po aplikacji odbywa się przy wykorzystaniu menu nawigacji na górze strony.

![Zrzut ekranu 2025-01-30 223011](https://github.com/user-attachments/assets/f8c8ccf9-ab1f-4f9f-9720-8354d4fc3b81)

### Instrukcja dla pasażerów

**Rejestracja**

Pasażer może utworzyć konto, podając swoje dane: imię, nazwisko, nazwę użytkownika, adres e-mail oraz tworząc dla siebie hasło.

![Zrzut ekranu 2025-01-30 223003](https://github.com/user-attachments/assets/aea12375-8812-455c-807a-21c0d0e27827)


**Moje bilety**

Po zalogowaniu, pasażer zobaczy stronę ze swoimi biletami. Są one podzielone na bilety aktywne oraz nieaktywne. Dla biletów aktywnych wyświetla się informacja o pozostałym czasie ich ważności. Kliknięcie w bilet umożliwia jego pokazanie do kontroli.

![Zrzut ekranu 2025-01-30 223227](https://github.com/user-attachments/assets/7386edd0-cf8c-4eb1-bf65-22f0fe6e25aa)


**Kup bilet**

Na podstronie kup bilet, pasażer może przeglądać wszystkie dostępne do kupienia bilety. Może wybrać liczbę biletów każdego rodzaju, które chce kupić. U góry strony wyświetla się suma do zapłaty. Po kliknięciu w przycisk "Kup i skasuj bilet", wybrane bilety pojawią się na stronie "Moje bilety".

![Zrzut ekranu 2025-01-30 223246](https://github.com/user-attachments/assets/63660914-80ae-46ee-82a7-7892f868cc12)


**Mój profil**

W profilu znajdują się informacje personalne użytkownika. Klikając w przycisk edycji, pasażer ma możliwość zmiany swoich danych, zresetowania hasła oraz trwałego usunięcia konta. W profilu znajduje się również przycisk umożliwiający wylogowanie się.

![Zrzut ekranu 2025-01-30 223258](https://github.com/user-attachments/assets/7665760a-c18f-4173-8291-4271960b02d6)


### Instrukcja dla kontrolerów

**Kontrola biletów**

Aby skontrolować bilet pasażera w czasie kontroli, należy wpisać numer ID biletu. Na tej podstawie zostanie wyświetlony odpowiedni komunikat o statusie ważności biletu.

**Mój profil**

W profilu znajdują się informacje personalne użytkownika. Kontroler nie ma możliwości edycji sowich danych, zajmuje się tym administrator. W profilu znajduje się przycisk umożliwiający wylogowanie się.


### Instrukcja dla administratorów

**Użytkownicy**

Podstrona Użytkownicy zawiera bazę z wszystkimi użytkownikami platformy. Filtry umożliwiają filtrowanie użytkowników po imieniu, nazwisku, loginie oraz roli. Przycik "Dodaj użytkownika" pozwala na utworzenie nowego konta poprzez podanie niezbędnych do tego celu danych. Przy każdym użytkowniku znajduje się również opcja edycji jego danych oraz usunięcia konta. W edycji danych możliwe jest zresetowanie hasła użytkownika. Kliknięcie tego przycisku powoduje wysłanie maila do użytkownika ze zmianą hasła.

![Zrzut ekranu 2025-01-30 223044](https://github.com/user-attachments/assets/7027065d-13c4-4a82-9d71-eb6da6122640)


![Zrzut ekranu 2025-01-30 223101](https://github.com/user-attachments/assets/3cb50c39-991d-4ce7-b913-a289afcbdb74)


**Bilety**

Podstrona Bilety zawiera bazę z wszystkimi biletami możliwymi do kupienia. Filtry umożliwiają filtrowanie biletów po taryfach oraz strefach. Przycik "Dodaj bilet" pozwala na utworzenie nowego biletu poprzez podanie niezbędnych do tego celu danych. Przy każdym bilecie znajduje się również opcja edycji jego danych oraz usunięcia biletu z bazy. 

![Zrzut ekranu 2025-01-30 223139](https://github.com/user-attachments/assets/182b57c9-52d9-460a-86c3-39616d12d5e7)


**Mój profil**

W profilu znajdują się informacje personalne użytkownika. Klikając w przycisk edycji, administrator ma możliwość zmiany swoich danych, zresetowania hasła oraz trwałego usunięcia konta. W profilu znajduje się również przycisk umożliwiający wylogowanie się.

![Zrzut ekranu 2025-01-30 230426](https://github.com/user-attachments/assets/adca3f7c-134f-45b0-a068-be7256cf4d7e)
