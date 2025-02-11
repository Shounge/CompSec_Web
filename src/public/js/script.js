function showTab(tabName) {
    document.querySelectorAll('.form-section').forEach(form => form.style.display = 'none');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(`${tabName}Form`).style.display = 'block';
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

async function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Store username for later use
            localStorage.setItem('username', username);
            window.location.href = '/dashboard';
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error during login!');
        console.error('Login error:', error);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            alert('Registration successful! Please login.');
            showTab('login');
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Error during registration!');
        console.error('Registration error:', error);
    }
}

function logout() {
    window.location.href = '/';
}
