function loadGameDetails() {
        
            var query = window.location.search;
            var params = new URLSearchParams(query);
        
            var game = params.get("game");
            var price = params.get("price");
        
            if(game && price) {
                document.getElementById("gameName").innerHTML = game;
                document.getElementById("gamePrice").innerHTML = "₹" + price;
            }
}
        
function validatePayment() {
        
            var options = document.getElementsByName("payment");
            var paymentSelected = false;
        
            for(var i = 0; i < options.length; i++){
                if(options[i].checked){
                    paymentSelected = true;
                    break;
                }
            }
        
            if(!paymentSelected){
                document.getElementById("errorBox").style.display = "block";
            } 
            else {
                document.getElementById("checkoutBox").style.display = "none";
                document.getElementById("successBox").style.display = "block";
            }
}

function submitRequest() {

    var issueText = document.getElementById("issueBox").value;
    var btn = document.getElementById("submitBtn");

    if(issueText == "") {
        alert("Please enter your issue before submitting.");
    }
    else {
        btn.innerHTML = "✔ Submitted";
        btn.style.backgroundColor = "#22c55e";
        btn.style.color = "black";
        btn.disabled = true;
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    var toggleBtn = document.querySelector(".theme-toggle");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("theme", "dark");
        toggleBtn.innerHTML = "🌙";
    } else {
        localStorage.setItem("theme", "light");
        toggleBtn.innerHTML = "☀️";
    }
}

function updateClock() {
    var now = new Date();
    var time = now.toLocaleTimeString();
    var clock = document.getElementById("clock");
    if (clock) {
        clock.innerHTML = time;
    }
}

setInterval(updateClock, 1000);

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

function loginUser() {

    var email = document.getElementById("loginEmail").value.trim().toLowerCase();
    var password = document.getElementById("loginPassword").value;

    var btn = document.getElementById("loginBtn");
    var message = document.getElementById("loginMessage");

    var storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
        message.innerHTML = "User not found. Please register.";
        message.style.color = "orange";
        return;
    }

    if (email === storedUser.email && password === storedUser.password) {

        btn.innerHTML = "Logged In";
        btn.style.backgroundColor = "#22c55e";
        btn.style.color = "black";

        setTimeout(function() {
            window.location.href = "games.html";
        }, 2000);

    } else {
        message.innerHTML = "Wrong credentials.";
        message.style.color = "red";
        showRegisterOption();
    }
}

function showRegisterOption() {

    if (!document.getElementById("registerLink")) {

        var regLink = document.createElement("p");
        regLink.id = "registerLink";
        regLink.innerHTML = "New here? <span style='color:#4e9cff; cursor:pointer;'>Register</span>";
        regLink.onclick = function() {
            window.location.href = "register.html";
        };

        document.querySelector(".auth-card").appendChild(regLink);
    }
}

function registerUser() {

    var name = document.getElementById("regName").value.trim();
    var email = document.getElementById("regEmail").value.trim().toLowerCase();
    var phone = document.getElementById("regPhone").value.trim();
    var password = document.getElementById("regPassword").value;

    var btn = document.getElementById("registerBtn");

    if (!name || !email || !phone || !password) {
        alert("Please fill all fields.");
        return;
    }

    var user = {
        name: name,
        email: email,
        phone: phone,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));

    btn.innerHTML = "Registered";
    btn.style.backgroundColor = "#22c55e";
    btn.style.color = "black";

    setTimeout(function() {
        window.location.href = "login.html";
    }, 2000);
}

function loadProfile() {

    var storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("profileName").innerHTML = storedUser.name;
    document.getElementById("profileEmail").innerHTML = storedUser.email;
    document.getElementById("profilePhone").innerHTML = storedUser.phone;

    // Show delete button only if user exists
    document.getElementById("deleteBtn").style.display = "block";
}

function deleteAccount() {

    var confirmDelete = confirm("Are you sure you want to delete your account?");

    if (confirmDelete) {

        localStorage.removeItem("user");

        alert("Account deleted successfully.");

        window.location.href = "home.html";
    }
}

function logoutUser() {
    window.location.href = "home.html";
}