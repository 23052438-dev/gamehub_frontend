// ================== BACKEND BASE URL ==================
const BASE_URL = "https://gamehub-backend-3.onrender.com";


// ================== LOAD GAME DETAILS ==================
function loadGameDetails() {

    var query = window.location.search;
    var params = new URLSearchParams(query);

    var game = params.get("game");
    var price = params.get("price");

    if (game && price) {
        document.getElementById("gameName").innerHTML = game;
        document.getElementById("gamePrice").innerHTML = "₹" + price;
    }
}


// ================== PAYMENT VALIDATION ==================
function validatePayment() {

    var options = document.getElementsByName("payment");
    var paymentSelected = false;

    for (var i = 0; i < options.length; i++) {
        if (options[i].checked) {
            paymentSelected = true;
            break;
        }
    }

    if (!paymentSelected) {
        document.getElementById("errorBox").style.display = "block";
    } else {
        document.getElementById("checkoutBox").style.display = "none";
        document.getElementById("successBox").style.display = "block";
    }
}


// ================== AI SUPPORT ==================
async function submitRequest() {

    var issueText = document.getElementById("issueBox").value;
    var btn = document.getElementById("submitBtn");

    if (issueText == "") {
        alert("Please enter your issue.");
        return;
    }

    btn.innerHTML = "Sending...";

    try {
        const response = await fetch(BASE_URL + "/api/support", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: issueText })
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("successBox").innerHTML = data.reply;
            btn.innerHTML = "✔ Sent";
            btn.style.backgroundColor = "#22c55e";
        } else {
            alert("Support failed.");
        }

    } catch (error) {
        alert("Server error.");
    }
}


// ================== AI RECOMMEND ==================
async function getRecommendation() {

    var input = document.getElementById("aiInput").value;
    var output = document.getElementById("aiOutput");

    if (!input) return;

    output.innerHTML = "Thinking...";

    try {
        const response = await fetch(BASE_URL + "/api/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ userMessage: input })
        });

        const data = await response.json();

        if (response.ok) {
            output.innerHTML = data.reply;
        } else {
            output.innerHTML = "AI unavailable.";
        }

    } catch (error) {
        output.innerHTML = "Server error.";
    }
}


// ================== THEME TOGGLE ==================
function toggleTheme() {

    document.body.classList.toggle("dark-mode");
    var toggleBtn = document.querySelector(".theme-toggle");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        if (toggleBtn) toggleBtn.innerHTML = "🌙";
    } else {
        localStorage.setItem("theme", "light");
        if (toggleBtn) toggleBtn.innerHTML = "☀️";
    }
}


// ================== CLOCK ==================
function updateClock() {
    var now = new Date();
    var time = now.toLocaleTimeString();
    var clock = document.getElementById("clock");
    if (clock) clock.innerHTML = time;
}

setInterval(updateClock, 1000);


// ================== REGISTER USER ==================
async function registerUser() {

    var name = document.getElementById("regName").value.trim();
    var email = document.getElementById("regEmail").value.trim().toLowerCase();
    var phone = document.getElementById("regPhone").value.trim();
    var password = document.getElementById("regPassword").value;

    if (!name || !email || !phone || !password) {
        alert("Please fill all fields.");
        return;
    }

    try {
        const response = await fetch(BASE_URL + "/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Registration successful!");
            window.location.href = "login.html";
        } else {
            alert(data.error || "Registration failed.");
        }

    } catch (error) {
        alert("Server error.");
    }
}


// ================== LOGIN USER ==================
async function loginUser() {

    var email = document.getElementById("loginEmail").value.trim().toLowerCase();
    var password = document.getElementById("loginPassword").value;

    var btn = document.getElementById("loginBtn");
    var message = document.getElementById("loginMessage");

    try {
        const response = await fetch(BASE_URL + "/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {

            btn.innerHTML = "Logged In";
            btn.style.backgroundColor = "#22c55e";
            btn.style.color = "black";

            localStorage.setItem("token", data.token);

            setTimeout(function () {
                window.location.href = "games.html";
            }, 1500);

        } else {
            message.innerHTML = data.error || "Login failed.";
            message.style.color = "red";
        }

    } catch (error) {
        message.innerHTML = "Server error.";
        message.style.color = "red";
    }
}


// ================== LOAD PROFILE ==================
async function loadProfile() {

    var token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(BASE_URL + "/api/profile", {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById("profileName").innerHTML = data.name;
            document.getElementById("profileEmail").innerHTML = data.email;
            document.getElementById("profilePhone").innerHTML = data.phone;
        } else {
            window.location.href = "login.html";
        }

    } catch (error) {
        window.location.href = "login.html";
    }
}


// ================== LOGOUT ==================
function logoutUser() {
    localStorage.removeItem("token");
    window.location.href = "home.html";
}


// ================== ON LOAD ==================
window.onload = function () {

    if (typeof loadGameDetails === "function") {
        loadGameDetails();
    }

    var savedTheme = localStorage.getItem("theme");
    var toggleBtn = document.querySelector(".theme-toggle");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
        if (toggleBtn) toggleBtn.innerHTML = "🌙";
    } else {
        if (toggleBtn) toggleBtn.innerHTML = "☀️";
    }

    updateClock();
};
