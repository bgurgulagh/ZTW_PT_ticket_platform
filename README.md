# Aplikacja webowa do zarządzania biletami KMK

## Wstęp
### Opis projektu
Aplikacja webowa powstała z myślą o zarządzaniu biletami komunikacji miejskiej. System pozwala na rejestrację oraz logowanie użytkowników, zakup i przeglądanie posiadanych przez pasażerów biletów, kontrolę biletów oraz zarządzanie bazami biletów oraz wszystkich użytkowników z poziomu administratora. 

### Opis funkcjonalności
W celu zapewnienia kompleksowości systemu zarządzania biletami, potencjalni użytkownicy aplikacji zostali podzieleni na trzy grupy: pasażerów, kontrolerów oraz administratorów. Dostępne funkcjonalności różnią się ze względu na posiadaną przez użytkownika rolę.

**Funkcjonalności z poziomu pasażera**
- rejestracja nowego użytkownika
- logowanie zarejestrowanego użytkownika
- przegląd zakupionych biletów, w tym sprawdzenie ich ważności
- pokazanie biletu kontrolerowi w czasie kontroli
- przegląd dostępnych do zakupu biletów
- zakup biletów
- przegląd danych w profilu użytkownika
- edycja danych w profilu użytkownika
- usunięcie konta

**Funkcjonalności z poziomu kontrolera**
- logowanie zarejestrowanego użytkownika
- kontrola ważności biletu pasażera
- przegląd danych w profilu użytkownika

**Funkcjonalności z poziomu administratora**
- logowanie zarejestrowanego użytkownika
- przegląd bazy biletów
- edycja rekordów w bazie biletów
- przegląd bazy użytkowników
- edycja rekordów w bazie użytkowników
- przegląd danych w profilu użytkownika
- edycja danych w profilu użytkownika

## Uruchomienie aplikacji
```bash
python -m venv .env  
.\\.env\Scripts\activate  
pip install -r requirements.txt  
python app.py
```  
  
## Architektura informacji
<img width="2120" alt="Information Architecture v4" src="https://github.com/user-attachments/assets/b160c3d2-afd7-4054-af92-1114f6584587" />  
  
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
  
## Kolorystyka
<img width="1778" alt="Colour Palette" src="https://github.com/user-attachments/assets/627ebd31-ce2a-423e-a22a-083c7237cbfb" />

| Kolor  | #HEX | Przeznaczenie |
| ------------- | ------------- | ------------- |
| Granatowy | #00305F  | przyciski, tło paska nawigacji, tło stopki |
| Ciemny szary | #9D9D9C | nieaktywne przyciski |  
| Jasny szary | #E6E6E6 | tło biletów, tło pól tekstowych, inne tła i elementy dodatkowe | 
| Zielony | #65A930 | potwierdzenie płatności, przycisk do kupowania biletów, gdy aktywny |
| Czerwony | #E00726 | błędy, ostrzeżenia |





