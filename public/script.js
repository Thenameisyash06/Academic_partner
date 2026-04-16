let generatedOTP = "";

document.addEventListener("DOMContentLoaded", function () {

    const roleRadios = document.querySelectorAll('input[name="role"]');
    const studentFields = document.getElementById("studentFields");

    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const message = document.getElementById("passwordMessage");

    const profileInput = document.getElementById("profilePicInput");
    const profilePreview = document.getElementById("profilePreview");

    const specialCharPattern = /[!@#$%^&*(),.?":{}|<>]/;

    // ---------------- Flip Card Logic ----------------
    const flipCard = document.getElementById('flipCard');
    const flipCardInner = document.getElementById('flipCardInner');
    const showRegisterBtn = document.getElementById('showRegister');
    const showLoginBtn = document.getElementById('showLogin');
    const frontCard = document.querySelector('.flip-card-front');
    const backCard = document.querySelector('.flip-card-back');

    // Global scope update function bound
    window.updateCardHeight = function() {
        if (flipCard.classList.contains('flipped')) {
            flipCardInner.style.height = backCard.offsetHeight + 'px';
        } else {
            flipCardInner.style.height = frontCard.offsetHeight + 'px';
        }
    }

    // Initialize height
    setTimeout(updateCardHeight, 100);

    showRegisterBtn.addEventListener('click', () => {
        flipCard.classList.add('flipped');
        updateCardHeight();
    });

    showLoginBtn.addEventListener('click', () => {
        flipCard.classList.remove('flipped');
        updateCardHeight();
    });

    // ---------------- Role Toggle ----------------
    roleRadios.forEach(radio => {
        radio.addEventListener("change", function () {

            const selectedRole = document.querySelector('input[name="role"]:checked');

            if (!selectedRole) return;

            if (selectedRole.value === "student") {
                studentFields.classList.remove("hidden");
                loadMentors();
            } else {
                studentFields.classList.add("hidden");
            }
            // Vital: update card 3D container height when inner content expands!
            setTimeout(window.updateCardHeight, 50);
        });
    });

    // ---------------- Password Validation ----------------
    passwordInput.addEventListener("keyup", function () {

        const password = passwordInput.value;

        let condition1 = false;
        let condition2 = false;
        let condition3 = false;

        // First letter capital
        if (password.length > 0 && password[0] === password[0].toUpperCase()) {
            document.getElementById("rule1").style.color = "lime";
            condition1 = true;
        } else {
            document.getElementById("rule1").style.color = "red";
        }

        // Special symbol
        if (specialCharPattern.test(password)) {
            document.getElementById("rule2").style.color = "lime";
            condition2 = true;
        } else {
            document.getElementById("rule2").style.color = "red";
        }

        // Length
        if (password.length > 8) {
            document.getElementById("rule3").style.color = "lime";
            condition3 = true;
        } else {
            document.getElementById("rule3").style.color = "red";
        }

        if (condition1 && condition2 && condition3) {
            confirmPasswordInput.disabled = false;
            message.innerHTML = "<span class='success'>✔ Strong Password</span>";
        } else {
            confirmPasswordInput.disabled = true;
            message.innerHTML = "<span class='error'>✖ Password not strong enough</span>";
        }

    });

    confirmPasswordInput.addEventListener("keyup", function () {

        if (confirmPasswordInput.value === passwordInput.value) {
            message.innerHTML = "<span class='success'>✔ Passwords Match</span>";
        } else {
            message.innerHTML = "<span class='error'>✖ Passwords Do Not Match</span>";
        }

    });

    // ---------------- Profile Picture Preview ----------------
    profilePreview.addEventListener("click", function() {
        profileInput.click();
    });

    profileInput.addEventListener("change", function() {

        const file = profileInput.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = function(e) {
                profilePreview.innerHTML =
                    `<img src="${e.target.result}" alt="Profile">`;
            };

            reader.readAsDataURL(file);
        }
    });

    // ---------------- Form Submit ----------------
    document.getElementById("registerForm").addEventListener("submit", function(e) {

        if (confirmPasswordInput.disabled || confirmPasswordInput.value !== passwordInput.value) {
            e.preventDefault();
            alert("Fix password issues before submitting");
        } else {
            alert("Registration Successful 🚀");
        }
    });

});

// ---------------- Mentor Loader ----------------
async function loadMentors() {

    const mentorOptions = document.getElementById("mentorOptions");
    const hiddenInput = document.getElementById("mentorValue");
    const assigned_mentor = document.getElementById("mentor");

    mentorOptions.innerHTML = "";
    
    let mentors = [];
    
    try {
        const res = await fetch('/getMentors');
        if (res.ok) {
            mentors = await res.json();
            console.log("Loaded Mentors:", mentors);
        } else {
            console.error("Failed to fetch mentors. Server returned status:", res.status);
        }
    } catch (err) {
        console.error("Network or parsing error while fetching mentors:", err);
    }
    
    if (!mentors || mentors.length === 0) {
        // Fallback to default mock mentors for testing purposes if DB is empty
        mentors = [
            { user_id: "test1", profile_pic: "https://i.pravatar.cc/150?img=12", f_name: "Dr.", l_name: "Sharma" },
            { user_id: "test2", profile_pic: "https://i.pravatar.cc/150?img=15", f_name: "Prof.", l_name: "Rajput" },
            { user_id: "test3", profile_pic: "https://i.pravatar.cc/150?img=33", f_name: "Dr.", l_name: "Mehta" },
            { user_id: "test4", profile_pic: "https://i.pravatar.cc/150?img=47", f_name: "Prof.", l_name: "Singh" },
            { user_id: "test5", profile_pic: "https://i.pravatar.cc/150?img=59", f_name: "Dr.", l_name: "Aisha" },
            { user_id: "test6", profile_pic: "https://i.pravatar.cc/150?img=68", f_name: "Prof.", l_name: "Williams" }
        ];
    }

    mentors.forEach(mentor => {

        const option = document.createElement("div");
        option.classList.add("mentor-option");

        option.innerHTML = `
            <img src="${mentor.profile_pic}" alt="${mentor.l_name}">
            <span>${mentor.f_name+" "+mentor.l_name}</span>
        `;

        option.addEventListener("click", function() {
            // Remove 'selected' class from all options
            document.querySelectorAll(".mentor-option").forEach(el => el.classList.remove("selected"));
            
            // Highlight this option
            option.classList.add("selected");

            // Fill hidden inputs
            hiddenInput.value = mentor.f_name+" "+mentor.l_name;
            assigned_mentor.value = mentor.user_id;
        });

        mentorOptions.appendChild(option);
    });
    
    // Safety check: Update card height after async fetch completes and populates DOM
    setTimeout(window.updateCardHeight, 50);
}
