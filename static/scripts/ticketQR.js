// Skrypt ładujący QR kod biletu
document.addEventListener("DOMContentLoaded", async () => {
    const tokenDisplay = document.getElementById('token_display');
    const QRCodeContainer = document.getElementById('token_qr');
    
    const token = tokenDisplay.textContent.trim();

    if (token) {
        const QRCodeUrl = `http://api.qrserver.com/v1/create-qr-code/?data=${token}&size=300x300&format=svg`;

        try {
            const response = await fetch(QRCodeUrl);
            const svgContent = await response.text();
            QRCodeContainer.innerHTML = svgContent;
        } catch (error) {
            console.error('Błąd podczas ładowania QR kodu:', error);
        }
    } else {
        console.error('Brak tokenu do wygenerowania QR kodu');
    }
    
    // Sygnatura czasowa
    function updateTime() {
        fetch('/server/time')
            .then(response => response.json())
            .then(data => {
                document.getElementById("signature_current_time").textContent = data.time;
            })
            .catch(error => console.error("Błąd pobierania czasu:", error));
    }
    
    // Uruchomienie interwału do aktualizacji czasu (1 sekunda)
    const timeInterval = 1;
    setInterval(updateTime, timeInterval * 1000);
    updateTime();
});