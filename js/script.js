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

    output.innerHTML = "🤖 AI is analyzing your preference...";

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
window.addEventListener("load", function () {

    if (typeof loadGameDetails === "function") {
        loadGameDetails();
    }

    if (typeof loadCheckout === "function") {
        loadCheckout();
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
});

// ================== PASSWORD ICON ==================
function togglePassword() {
    const passwordInput = document.getElementById("loginPassword");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
}

// ================== CHECKOUT ==================
function loadCheckout() {
    const params = new URLSearchParams(window.location.search);
    const price = params.get("price");
    const title = params.get("title");
    if (price) {
        document.getElementById("checkoutTotal").innerText = "₹" + price;
    }
}

// ================== AI CHATBOT ==================
const CHATBOT_SYSTEM_PROMPT = `You are GX — Game Hub's AI assistant. You're a knowledgeable, enthusiastic gaming expert with a sleek cyberpunk personality.

You help users with:
- Game recommendations based on their preferences
- Game details, specs, genres, gameplay mechanics
- Reviews and ratings of games
- Pricing and deals info (our store has GTA V ₹1,299, Witcher 3 ₹1,499, Minecraft ₹299)
- System requirements and PC specs needed
- Comparisons between games
- Gaming tips and guides

Keep replies concise (3-5 sentences max), helpful, and on-topic. Use a confident, slightly futuristic tone. Don't use excessive emojis. If asked something unrelated to gaming, gently redirect to gaming topics.`;

function initChatbot() {
    const toggle = document.getElementById('chatbotToggle');
    const window_ = document.getElementById('chatbotWindow');
    const closeBtn = document.getElementById('chatbotClose');
    const sendBtn = document.getElementById('chatbotSend');
    const input = document.getElementById('chatbotInput');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        window_.classList.toggle('open');
        // remove notification dot after first open
        toggle.style.setProperty('--dot-display', 'none');
        toggle.classList.add('seen');
    });

    closeBtn.addEventListener('click', () => {
        window_.classList.remove('open');
    });

    sendBtn.addEventListener('click', sendChatMessage);

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChatMessage();
        }
    });
}

let chatHistory = [];

function appendMessage(role, text) {
    const msgs = document.getElementById('chatbotMessages');
    if (!msgs) return;

    const div = document.createElement('div');
    div.className = `chat-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.textContent = role === 'bot' ? '🤖' : '👤';

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    bubble.textContent = text;

    div.appendChild(avatar);
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
}

function appendTyping() {
    const msgs = document.getElementById('chatbotMessages');
    const div = document.createElement('div');
    div.className = 'chat-msg bot chat-typing';
    div.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.textContent = '🤖';

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    bubble.innerHTML = `<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>`;

    div.appendChild(avatar);
    div.appendChild(bubble);
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
    const t = document.getElementById('typingIndicator');
    if (t) t.remove();
}

async function sendChatMessage() {
    const input = document.getElementById('chatbotInput');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    // Remove suggestion chips after first message
    const suggestions = document.querySelector('.chat-suggestions');
    if (suggestions) suggestions.remove();

    appendMessage('user', text);
    chatHistory.push({ role: 'user', content: text });

    appendTyping();

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                system: CHATBOT_SYSTEM_PROMPT,
                messages: chatHistory
            })
        });

        const data = await response.json();
        removeTyping();

        const reply = data.content && data.content[0] && data.content[0].text
            ? data.content[0].text
            : 'Signal lost. Try again.';

        chatHistory.push({ role: 'assistant', content: reply });
        appendMessage('bot', reply);

    } catch (err) {
        removeTyping();
        appendMessage('bot', 'Connection error. Check your network and try again.');
    }
}

function chatSuggestion(text) {
    const input = document.getElementById('chatbotInput');
    if (input) {
        input.value = text;
        sendChatMessage();
    }
}

// Initialize on load
window.addEventListener('load', function () {
    initChatbot();
});
