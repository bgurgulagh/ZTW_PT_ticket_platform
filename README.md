# Aplikacja webowa do zarządzania biletami KMK
## Uruchomienie aplikacji
python -m venv .env  
.\venv\Scripts\activate  
pip install -r requirements.txt  
python app.py  
  
## Zawartość baz danych  
### users.db (w app.py pod klasą User) - zbiór wszystkich użytkowników systemu  
name - imię użytkownika  
surname - nazwisko użytkownika  
username - login użytkownika  
password - hasło użytkownika  
email - adres email użytkownika  
role - rola użytkownika w systemie (Administrator, Kontroler, Pasażer)  
  
### tickets.db (w app.py pod klasą Ticket) - zbiór informacji o kupionych biletach  
username - login użytkownika, który dokonał zakupu  
token - identyfikator zakupionego biletu w systemie (generowany automatycznie przy zakupie biletu), podawany podczas kontroli biletów  
validation - data i godzina zakupu biletu w formacie DateTime  
time - okres ważności zakupionego biletu  
tariff - taryfa zakupionego biletu (normal, discount)  
zone - strefa, w której obowiązuje zakupiony bilet (all, first)  
description - opis zakupionego biletu  
  
### tickets_data.db (w app.py pod klasą TicketData) - zbiór informacji o dostępnych biletach  
time - okres ważności biletu  
tariff - taryfa biletu (normal, discount)  
zone - strefa, w której obowiązuje bilet (all, first)  
price - cena biletu  
description - opis biletu  
  
## Kolorystyka
<img width="1778" alt="Colour Palette" src="https://github.com/user-attachments/assets/627ebd31-ce2a-423e-a22a-083c7237cbfb" />

Granatowy #00305F  
Ciemny szary #9D9D9C [m.in. nieaktywne przyciski]  
Jasny szary #E6E6E6 [m.in. tło biletów, tło pól tekstowych, inne tła i elementy dodatkowe]  
Zielony #65A930 [m.in. potwierdzenie płatności, przycisk do kupowania biletów gdy aktywny]  
Czerwony #E00726 [m.in. błędy, ostrzeżenia]  

## Architektura informacji
<img width="2120" alt="Information Architecture v4" src="https://github.com/user-attachments/assets/b160c3d2-afd7-4054-af92-1114f6584587" />





