# Aplikacja webowa do zarządzania biletami KMK

## Wstęp
### Opis projektu
Aplikacja webowa powstała z myślą o zarządzaniu biletami komunikacji miejskiej. System pozwala na rejestrację oraz logowanie użytkowników, zakup i przeglądanie posiadanych przez pasażerów biletów, kontrolę biletów oraz zarządzanie bazami biletów oraz wszystkich użytkowników z poziomu administratora. 

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

```bash
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

Dekoratory login_required(f) i role_required(role) sprawdzają, czy użytkownik jest zalogowany oraz czy ma odpowiednią rolę (uprawnienia), aby ją wyświetlić.

```bash
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

## Obsługa biletów






