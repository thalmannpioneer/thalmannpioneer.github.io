'use strict';

//переменные
let startingOverlayContainer = document.getElementsByClassName("starting-overlay")[0];
let qrContainer = document.getElementsByClassName("telegram-qr-overlay")[0];
let clipboardNotificationContainer = document.getElementsByClassName("clipboard-notification")[0];

//функции
function telegramQrShow() {
        qrContainer.classList.add("telegram-qr-overlay_shown");
}
function telegramQrHide() {
        qrContainer.classList.remove("telegram-qr-overlay_shown");
}

function discordIdCopy() {
        navigator.clipboard.writeText("thalmannpioneer");

        clipboardNotificationContainer.classList.add("notification_shown");
        setTimeout(() => { clipboardNotificationContainer.classList.remove("notification_shown"); }, 1000);
}

//действия при загрузке
startingOverlayContainer.classList.add("starting-overlay_hidden");
localStorage.clear();