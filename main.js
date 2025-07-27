$(document).ready(function() {

    // ================ 1. REGISTRATION (3-STEP) ===================
    if ($("#registrationForm").length) {
        let currentStep = 1;
        const $steps = [$('#step1'), $('#step2'), $('#step3')];
        const $stepIndicators = [$('#step-indicator-1'), $('#step-indicator-2'), $('#step-indicator-3')];

        function updateStep(step) {
            $steps.forEach(($step, idx) => {
                if (step === idx+1) $step.removeClass('hidden');
                else $step.addClass('hidden');
            });
            $stepIndicators.forEach(($ind, idx) => {
                if (step === idx+1) $ind.removeClass('bg-gray-200 text-gray-500').addClass('bg-indigo-600 text-white');
                else $ind.addClass('bg-gray-200 text-gray-500').removeClass('bg-indigo-600 text-white')
            });
            $('#prevBtn').toggle(step > 1);
            $('#nextBtn').toggle(step < 3);
            $('#submitBtn').toggle(step === 3);
        }
        updateStep(currentStep);

        $('#nextBtn').click(function() {
            const messageBox = $('#messageBox').addClass('hidden');
            if (currentStep === 1) {
                if (
                    !$('#fullName').val().trim() ||
                    !$('#email').val().trim() ||
                    !$('#phone').val().trim() ||
                    !$('#password').val().trim()
                ) {
                    messageBox.text('Please fill all required fields in Step 1.').removeClass('hidden bg-green-100').addClass('bg-red-100 text-red-700');
                    return;
                }
                if (!/\S+@\S+\.\S+/.test($('#email').val())) {
                    messageBox.text('Enter a valid email address.').removeClass('hidden bg-green-100').addClass('bg-red-100 text-red-700');
                    return;
                }
                if ($('#password').val().length < 6) {
                    messageBox.text('Password must be at least 6 characters long.').removeClass('hidden bg-green-100').addClass('bg-red-100 text-red-700');
                    return;
                }
            }
            if (currentStep === 2) {
                if (!$('#bloodGroup').val()) {
                    $('#messageBox').text('Blood group is required.').removeClass('hidden bg-green-100').addClass('bg-red-100 text-red-700');
                    return;
                }
            }
            currentStep++;
            updateStep(currentStep);
        });

        $('#prevBtn').click(function() {
            $('#messageBox').addClass('hidden');
            currentStep--;
            updateStep(currentStep);
        });

        // Photo Preview & Validation (JPEG only, <=2MB)
        $('#photo').on('change', function(e) {
            const file = this.files[0];
            const $preview = $('#photoPreview').empty();
            if (file) {
                if (file.type !== "image/jpeg") {
                    $preview.html('<span class="text-red-700">Only JPEG files are allowed.</span>');
                    this.value = "";
                    return;
                }
                if (file.size > 2*1024*1024) {
                    $preview.html('<span class="text-red-700">Photo is too large. Max 2MB.</span>');
                    this.value = "";
                    return;
                }
                const reader = new FileReader();
                reader.onload = function(e) {
                    $preview.html('<img src="' + e.target.result + '" alt="Photo" class="mx-auto rounded-lg max-h-28 shadow">');
                };
                reader.readAsDataURL(file);
            }
        });

        // Registration Submit (AJAX, FormData)
        $('#registrationForm').submit(function(event) {
            event.preventDefault();
            const messageBox = $('#messageBox').addClass('hidden');
            const fileInput = $('#photo')[0];
            let file = fileInput.files[0];
            if (!file || file.type !== "image/jpeg" || file.size > 2 * 1024 * 1024) {
                messageBox.text('Please upload a valid JPEG photo file (max 2MB).').removeClass('hidden bg-green-100').addClass('bg-red-100 text-red-700');
                return;
            }

            let formData = new FormData(this);

            $.ajax({
                url: 'api/register.php',
                method: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function(resp) {
                    let data;
                    try { data = typeof resp === 'string' ? JSON.parse(resp) : resp; } catch(e){ data = {}; }
                    if (data.success) {
                        messageBox.text(data.message || "Registration successful!").removeClass('hidden bg-red-100 text-red-700').addClass('bg-green-100 text-green-700');
                        $('#registrationForm')[0].reset();
                        $('#photoPreview').empty();
                        currentStep = 1; updateStep(currentStep);
                    } else {
                        messageBox.text(data.message || "Registration failed.").removeClass('hidden bg-green-100 text-green-700').addClass('bg-red-100 text-red-700');
                    }
                },
                error: function() {
                    messageBox.text("Registration error. Please try again!").removeClass('hidden bg-green-100 text-green-700').addClass('bg-red-100 text-red-700');
                }
            });
        });
    }

    // ================= 2. USER LOGIN ==========================
    $('#loginForm').on('submit', function(event) {
        event.preventDefault();
        const $msg = $('#messageBox').addClass('hidden');
        const user = $('#emailOrUsername').val().trim();
        const pass = $('#password').val().trim();
        if (!user || !pass) {
            $msg.text('Please enter your email/username and password.').removeClass('hidden').addClass('bg-red-100 text-red-700');
            return;
        }
        $.ajax({
            url: 'api/login.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({username: user, password: pass}),
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    $msg.text(data.message + ' Redirecting...')
                        .removeClass('hidden bg-red-100 text-red-700')
                        .addClass('bg-green-100 text-green-700');
                    // window.location.href = 'dashboard.html';
                } else {
                    $msg.text(data.message)
                        .removeClass('hidden bg-green-100 text-green-700')
                        .addClass('bg-red-100 text-red-700');
                }
            },
            error: function() {
                $msg.text('An error occurred during login. Please try again later.')
                    .removeClass('hidden bg-green-100 text-green-700')
                    .addClass('bg-red-100 text-red-700');
            }
        });
    });

    // =============== 3. ADMIN LOGIN ===============================
    $('#adminLoginForm').on('submit', function(event) {
        event.preventDefault();
        const $msg = $('#messageBox').addClass('hidden');
        const user = $('#adminUsername').val().trim();
        const pass = $('#adminPassword').val().trim();
        if (!user || !pass) {
            $msg.text('Please enter admin username and password.').removeClass('hidden').addClass('bg-red-100 text-red-700');
            return;
        }
        $.ajax({
            url: 'api/admin_login.php',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({username: user, password: pass}),
            dataType: 'json',
            success: function(data) {
                if (data.success) {
                    $msg.text(data.message + ' Redirecting...')
                        .removeClass('hidden bg-red-100 text-red-700')
                        .addClass('bg-green-100 text-green-700');
                    // window.location.href = 'admin_dashboard.html';
                } else {
                    $msg.text(data.message)
                        .removeClass('hidden bg-green-100 text-green-700')
                        .addClass('bg-red-100 text-red-700');
                }
            },
            error: function() {
                $msg.text('An error occurred during admin login. Please try again later.')
                    .removeClass('hidden bg-green-100 text-green-700')
                    .addClass('bg-red-100 text-red-700');
            }
        });
    });

    // ============= 4. GALLERY LOADER ============================
    if ($("#gallery-container").length) {
        $("#gallery-loading").show();
        $("#gallery-container").empty();
        $.ajax({
            url: 'api/get_gallery_feedback.php',
            method: 'GET',
            dataType: 'json',
            success: function(data) {
                $("#gallery-loading").remove();
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    data.data.forEach(function(item) {
                        var playerName = item.player_name || 'Unknown Runner';
                        var feedbackText = item.feedback_text || 'No feedback provided.';
                        var marathonEvent = item.marathon_event || 'General Marathon';
                        var imageUrl = 'https://placehold.co/400x300/A78BFA/FFFFFF?text=' + 
                            encodeURIComponent((playerName.split(' ')[0] || 'Runner'));
                        var galleryItemHtml = `
                            <div class="gallery-item group focus:outline-none" tabindex="0">
                                <img src="${imageUrl}" alt="${playerName}" class="w-full h-64 object-cover rounded-xl transition duration-150 group-hover:opacity-70">
                                <div class="gallery-item-overlay">
                                    <p class="player-name">${playerName}</p>
                                    <p class="text-sm mb-2">"${feedbackText}"</p>
                                    <span class="text-xs">${marathonEvent}</span>
                                </div>
                            </div>
                        `;
                        $("#gallery-container").append(galleryItemHtml);
                    });
                } else {
                    $("#gallery-container").html(
                        <p class="text-center text-gray-600 col-span-full">${data.message || 'No gallery feedback yet.'}</p>
                    );
                }
            },
            error: function() {
                $("#gallery-loading").remove();
                $("#gallery-container").html('<p class="text-center text-red-600 col-span-full">Failed to load gallery content.</p>');
            }
        });
    }

    // ============= 5. SECTION ENTER ANIMATION (optional) ========
    $(window).on("scroll load", function() {
        $('.section-animate').each(function() {
            var $this = $(this);
            if ($this.offset().top < $(window).scrollTop() + $(window).height() - 80) {
                $this.addClass('visible');
            }
        });
    });

});
