async function loadUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();
    
    const userList = document.getElementById('userList');
    userList.innerHTML = users.map((user, index) => `
        <div>
            <input type="radio" name="userSelect" value="${index}">
            ${user.username} (${user.password})
        </div>
    `).join('');
}

async function deleteUser() {
    const selected = document.querySelector('input[name="userSelect"]:checked');
    if (!selected) return alert('Please select a user');
    
    await fetch(`/api/users/${selected.value}`, {
        method: 'DELETE'
    });
    
    loadUsers();
}

loadUsers(); 