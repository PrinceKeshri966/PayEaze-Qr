let qrType = "";
let selectedPaymentMethod = "";

function showStaticInput() {
    qrType = "static";
    document.getElementById("input-section").classList.remove("hidden");
    document.getElementById("amount-container").classList.add("hidden");
}

function showDynamicInput() {
    qrType = "dynamic";
    document.getElementById("input-section").classList.remove("hidden");
    document.getElementById("amount-container").classList.remove("hidden");
}

function updatePaymentMethod() {
    selectedPaymentMethod = document.getElementById("payment-method").value;
}

function generateQR() {
    let upiInput = document.getElementById("upi-input").value.trim();
    const amount = document.getElementById("amount").value.trim();

    if (!upiInput) {
        alert("Please enter a UPI ID or phone number.");
        return;
    }

    // Add appropriate extension based on payment method
    if (selectedPaymentMethod === "paytm") {
        upiInput += "@ptyes";
    } else if (selectedPaymentMethod === "phonepe") {
        upiInput += "@ybl";
    } else if (/^\d{10}$/.test(upiInput)) {
        upiInput = upiInput + "@gpay"; // Default to Google Pay for phone numbers
    } else if (!upiInput.includes("@")) {
        alert("Invalid UPI ID. Please enter a valid UPI ID like 'abc@upi' or a 10-digit phone number.");
        return;
    }

    // Check for the amount and prevent QR generation if more than 100000
    if (qrType === "dynamic" && amount && !isNaN(amount) && parseFloat(amount) > 100000) {
        alert("Amount exceeds the limit of 100,000. QR code will not be generated.");
        return; // Stop here if the amount is too high
    }

    let paymentQRUrl = `upi://pay?pa=${upiInput}&pn=Recipient%20Name&mc=1234`;
    
    if (qrType === "dynamic") {
        if (!amount || isNaN(amount)) {
            alert("Please enter a valid amount.");
            return;
        }
        paymentQRUrl += `&am=${amount}`;
    }

    // Generate the QR code
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: paymentQRUrl,
        width: 200,
        height: 200
    });

    document.getElementById("qr-container").style.display = "flex";
    document.getElementById("download-btn").classList.remove("hidden");
}

function downloadQR() {
    const qrCanvas = document.querySelector("#qrcode canvas");
    if (!qrCanvas) {
        alert("No QR code to download!");
        return;
    }

    const link = document.createElement("a");
    link.href = qrCanvas.toDataURL("image/png");
    link.download = "PayEase_QR.png";
    link.click();
}

function startSpeechRecognition(inputId) {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-IN";
    recognition.start();

    recognition.onresult = function(event) {
        let transcript = event.results[0][0].transcript;
        transcript = transcript.replace(/\s/g, "").toLowerCase();

        document.getElementById(inputId).value = transcript;
    };

    recognition.onerror = function() {
        alert("Sorry, couldn't recognize your voice. Please try again.");
    };
}
