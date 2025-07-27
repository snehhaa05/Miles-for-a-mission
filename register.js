document.addEventListener("DOMContentLoaded", function () {
  const steps = Array.from(document.querySelectorAll(".step"));
  const nextBtn = document.getElementById("nextBtn");
  const prevBtn = document.getElementById("prevBtn");
  const submitBtn = document.getElementById("submitBtn");
  const form = document.getElementById("registrationForm");
  const photoInput = document.getElementById("photo");
  const photoPreview = document.getElementById("photoPreview");
  const messageBox = document.getElementById("messageBox");

  let currentStep = 0;

  function showStep(index) {
      steps.forEach((step, i) => {
          step.classList.toggle("hidden", i !== index);
      });

      // Step indicators
      for (let i = 1; i <= 3; i++) {
          const indicator = document.getElementById(`step-indicator-${i}`);
          const label = document.getElementById(`step-label-${i}`);

          if (i - 1 === index) {
              indicator.classList.remove("bg-gray-200", "text-gray-500");
              indicator.classList.add("bg-indigo-600", "text-white");
              label.classList.add("text-indigo-600");
          } else {
              indicator.classList.add("bg-gray-200", "text-gray-500");
              indicator.classList.remove("bg-indigo-600", "text-white");
              label.classList.remove("text-indigo-600");
          }
      }

      prevBtn.classList.toggle("hidden", index === 0);
      nextBtn.classList.toggle("hidden", index === steps.length - 1);
      submitBtn.classList.toggle("hidden", index !== steps.length - 1);
  }

  nextBtn.addEventListener("click", () => {
      if (currentStep === 0) {
          const password = document.getElementById("password").value;
          const confirmPassword = document.getElementById("confirmpassword").value;
          if (password !== confirmPassword) {
              showMessage("Passwords do not match!", "bg-red-100 text-red-700");
              return;
          }
      }

      if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
      }
  });

  prevBtn.addEventListener("click", () => {
      if (currentStep > 0) {
          currentStep--;
          showStep(currentStep);
      }
  });

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


  function showMessage(message, classes) {
      messageBox.textContent = message;
      messageBox.className = `mt-6 p-4 rounded-md text-sm text-center ${classes}`;
      messageBox.classList.remove("hidden");
  }

  photoInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file && file.type === "image/jpeg" && file.size <= 2 * 1024 * 1024) {
          const reader = new FileReader();
          reader.onload = function (e) {
              photoPreview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="mt-2 rounded-lg max-w-xs">`;
          };
          reader.readAsDataURL(file);
      } else {
          photoPreview.innerHTML = `<p class="text-red-600">Invalid file. Please upload a JPEG under 2MB.</p>`;
          this.value = "";
      }
  });

  // Initialize
  showStep(currentStep);
});
