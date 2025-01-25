# Aplikacja webowa do zarządzania biletami KMK
## Kolorystyka:  
Granatowy #00305F  
Ciemny szary #9D9D9C [m.in. nieaktywne przyciski]  
Jasny szary #E6E6E6 [m.in. tło biletów, tło pól tekstowych, inne tła i elementy dodatkowe]  
Zielony #65A930 [m.in. potwierdzenie płatności, przycisk do kupowania biletów gdy aktywny]  
Czerwony #E00726 [m.in. błędy, ostrzeżenia]  

## Uruchomienie aplikacji
python -m venv venv  
.\venv\Scripts\activate  
pip install -r requirements.txt  
(Jak nie dziala to pip install Flask Flask-SQLAlchemy)  
  
python app.py  
LUB  
set FLASK_APP=app.py  
set FLASK_ENV=development  
flask run  
