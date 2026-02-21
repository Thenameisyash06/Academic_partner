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

    // const mentors = [
    //     { name: "Dr. Sharma", image: "images/1.png" },
    //     { name: "Prof. Rajput", image: "images/1.png" },
    //     { name: "Dr. Mehta", image: "images/1.pnd" },
    //     { name: "Prof. Singh", image: "images/1.png" }
    // ];

    const res = await fetch('/getMentors')
    const mentors = await res.json();
    console.log(mentors);
        

    const mentorOptions = document.getElementById("mentorOptions");
    const selectedMentor = document.getElementById("selectedMentor");
    const hiddenInput = document.getElementById("mentorValue");
    const assigned_mentor = document.getElementById("mentor");

    mentorOptions.innerHTML = "";

    mentors.forEach(mentor => {

        const option = document.createElement("div");
        option.classList.add("mentor-option");

        option.innerHTML = `
            <img src="${mentor.profile_pic}" alt="${mentor.l_name}">
            <span>${mentor.f_name+" "+mentor.l_name}</span>
        `;

        option.addEventListener("click", function() {

            selectedMentor.innerHTML = `
                <img src="${mentor.profile_pic}">
                ${mentor.f_name+" "+mentor.l_name}
            `;

            hiddenInput.value = mentor.f_name+" "+mentor.l_name;
            assigned_mentor.value = mentor.user_id;
            mentorOptions.classList.add("hidden");
        });

        mentorOptions.appendChild(option);
    });
}

const mentorDropdownBox = document.getElementById("mentorDropdownBox");
const mentorOptions = document.getElementById("mentorOptions");

mentorDropdownBox.addEventListener("click", function(e) {
    e.stopPropagation();
    mentorOptions.classList.toggle("hidden");
});

document.addEventListener("click", function() {
    mentorOptions.classList.add("hidden");
});