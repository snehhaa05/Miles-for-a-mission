// main.js
$(document).ready(function() {
  // 1. Countdown Timer for Home Page
  function updateCountdown() {
    var eventDate = new Date("2025-10-01T06:00:00Z").getTime();
    var now = new Date().getTime();
    var distance = eventDate - now;
    if (distance < 0) {
      $('#countdown').text("Event Started!");
      return;
    }
    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    var minutes = Math.floor((distance / (1000 * 60)) % 60);
    var seconds = Math.floor((distance / 1000) % 60);
    $('#countdown').text(days + "d " + hours + "h " + minutes + "m " + seconds + "s");
  }
  if ($('#countdown').length) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // 2. Registration Step 1 & 2: Basic validation (HTML5 handles most)
  $('form[action="register2.html"], form[action="register3.html"]').on('submit', function() {
    // Optionally, you could save data in sessionStorage here for multi-step persistence
  });

  // 3. Registration Step 3: Health Info (show/hide illness details, final submit)
  $("input[name='illness']").on("change", function() {
    if ($(this).val() === "yes") {
      $("#illnessDetail").slideDown(200);
    } else {
      $("#illnessDetail").slideUp(200);
    }
  });
  $('#finalForm').on('submit', function(e) {
    e.preventDefault();
    alert("Registration successful! (Final Step with Health Info)");
    this.reset();
    $("#illnessDetail").hide();
  });

  // 4. Single-page Registration (if used)
  $('#registrationForm').on('submit', function(e) {
    e.preventDefault();
    let valid = true;
    $(this).find('input, select').each(function() {
      if (!$(this).val()) valid = false;
    });
    if (!valid) {
      alert("Please fill all fields.");
      return;
    }
    $('#reg-success').fadeIn(300).delay(2000).fadeOut(700);
    $(this).trigger("reset");
  });

  // 5. Login Form
  $('#loginForm').on('submit', function(e) {
    e.preventDefault();
    var email = $(this).find('input[name="email"]').val();
    var password = $(this).find('input[name="password"]').val();
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }
    $('#login-msg').text("Login successful! (Simulated)").fadeIn(300).delay(2000).fadeOut(700);
    $(this).trigger("reset");
  });

  // 6. Contact Form
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    alert("Thank you for contacting us! We will get back to you soon.");
    $(this).trigger("reset");
  });

  // 7. Leaderboard Data (Results Page)
  if ($('#leaderboard').length) {
    var results = [
      {name: "Amit Sharma", time: "02:45:30", category: "Men"},
      {name: "Priya Singh", time: "03:10:12", category: "Women"},
      {name: "Rahul Verma", time: "02:55:48", category: "Men"}
    ];
    results.forEach(function(r) {
      $('#leaderboard tbody').append(
        "<tr><td>" + $('<div>').text(r.name).html() + "</td><td>" +
        $('<div>').text(r.time).html() + "</td><td>" +
        $('<div>').text(r.category).html() + "</td></tr>"
      );
    });
  }

  // 8. Smooth Scroll for Anchor Links (if needed)
  $('a[href^="#"]').on('click', function(e) {
    var target = $($(this).attr('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').animate({ scrollTop: target.offset().top - 80 }, 500);
    }
  });

  // 9. Animated Navbar on Scroll
  var nav = $('nav');
  var navOffset = nav.offset().top;
  $(window).on('scroll', function() {
    if ($(window).scrollTop() > navOffset + 10) {
      nav.css({
        'box-shadow': '0 4px 16px #ED174F33',
        'background': 'linear-gradient(90deg, #005DAA 80%, #ED174F 100%)'
      });
    } else {
      nav.css({
        'box-shadow': '0 2px 12px #0002',
        'background': 'linear-gradient(90deg, #005DAA 60%, #ED174F 100%)'
      });
    }
  });

  // 10. Gallery Image Animation (optional)
  $('.gallery img').on('mouseenter', function() {
    $(this).css('filter', 'brightness(1.15) saturate(1.2)');
  }).on('mouseleave', function() {
    $(this).css('filter', 'none');
  });
});