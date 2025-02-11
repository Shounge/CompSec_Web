// Load user profile
async function loadProfile() {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/';
        return;
    }

    try {
        const response = await fetch(`/api/users/search?query=${username}`);
        const users = await response.json();
        const user = users[0];

        if (user) {
            document.getElementById('userInfo').innerHTML = `
                <h4>${user.username}</h4>
                <p>${user.bio || 'No bio yet'}</p>
            `;
            if (user.avatarUrl) {
                document.getElementById('avatarImage').src = user.avatarUrl;
            }
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Update profile
document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = localStorage.getItem('username');
    const avatarUrl = document.getElementById('avatarUrl').value;
    const bio = document.getElementById('userBio').value;

    try {
        const response = await fetch('/api/profile/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, avatarUrl, bio })
        });

        const data = await response.json();
        if (data.success) {
            alert('Profile updated successfully!');
            loadProfile();
        } else {
            alert('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
});

// Load documents
async function loadDocuments() {
    try {
        const documentsList = document.getElementById('documentsList');
        documentsList.innerHTML = '';

        // Vulnerable to IDOR - no authentication check
        for (let i = 1; i <= 5; i++) {
            const response = await fetch(`/api/documents/${i}`);
            if (response.ok) {
                const doc = await response.json();
                documentsList.innerHTML += `
                    <div class="document">
                        <h4>${doc.title}</h4>
                        <p>${doc.content}</p>
                    </div>
                `;
            }
        }
    } catch (error) {
        console.error('Error loading documents:', error);
    }
}

// Search users - vulnerable to XSS
async function searchUsers() {
    const query = document.getElementById('searchQuery').value;
    try {
        const response = await fetch(`/api/users/search?query=${query}`);
        const users = await response.json();
        
        const resultsDiv = document.getElementById('searchResults');
        resultsDiv.innerHTML = users.map(user => `
            <div class="user-result">
                <img src="${user.avatarUrl || '/images/default-avatar.png'}" width="50">
                <h4>${user.username}</h4>
                <p>${user.bio || 'No bio'}</p>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error searching users:', error);
    }
}

// Logout function
function logout() {
    localStorage.removeItem('username');
    window.location.href = '/';
}

// Check authentication at the start
document.addEventListener('DOMContentLoaded', () => {
    const username = localStorage.getItem('username');
    if (!username) {
        window.location.href = '/';
        return;
    }
    loadProfile();
    loadDocuments();
});

// Initialize dashboard
loadProfile();
loadDocuments(); 