document.getElementById("loginForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            alert("Login successful!");
            window.location.href = '/dashboard';
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        alert("An error occurred during login");
    }
});