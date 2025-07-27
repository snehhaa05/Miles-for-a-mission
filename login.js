document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const messageBox = document.getElementById("messageBox");

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        const formData = new FormData(form);
    
        fetch("register.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.text())
        .then(res => {
            if (res.trim() === "success") {
                showMessage("Registration successful!", "bg-green-100 text-green-700");
                form.reset();
                currentStep = 0;
                showStep(currentStep);
            } else {
                showMessage("Registration failed.", "bg-red-100 text-red-700");
            }
        });
    });
    

    function showMessage(msg, classes) {
        messageBox.textContent = msg;
        messageBox.className = `mt-6 p-4 rounded-md text-sm text-center ${classes}`;
        messageBox.classList.remove("hidden");
    }
});
