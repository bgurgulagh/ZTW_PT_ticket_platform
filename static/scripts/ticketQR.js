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
});