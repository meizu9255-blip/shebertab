document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const authLinkList = document.querySelectorAll('.fez-cta-link');
    const authLabelList = document.querySelectorAll('.fez-cta-label');
    
    // Жаһандық Navbar-да атын көрсету
    if (user) {
        authLabelList.forEach(lbl => {
            lbl.textContent = '👤 ' + user.name;
        });
    }

    // Егер біз Auth (login/register) бетінде болсақ
    const authWrapper = document.querySelector('.auth-wrapper');
    if (authWrapper) {
        const hasContainer = document.getElementById('auth-container');
        
        if (user) {
            // Егер қолданушы кірген болса, тіркелу формасын жасырып, Профиль және Шығу көрсету
            if (hasContainer) hasContainer.style.display = 'none';
            
            const profilePanel = document.createElement('div');
            profilePanel.className = 'user-panel-react';
            profilePanel.style.cssText = 'background:var(--surface); padding: 40px; border-radius:10px;text-align:center;box-shadow:var(--shadow-lg); width:100%; max-width:400px; z-index:10; border: 1px solid var(--border);';
            profilePanel.innerHTML = `
                <div style="font-size:3rem;margin-bottom:10px">👤</div>
                <h2 style="margin-bottom:10px; color:var(--text)">Сәлем, <span style="color:var(--primary)">${user.name}</span>!</h2>
                <p style="color:var(--muted); margin-bottom:30px">Жүйеге сәтті кірдіңіз (${user.email})</p>
                <button type="button" class="btn btn-outline" id="logoutBtn" style="width:100%; justify-content:center; border-color:var(--red); color:var(--red)">🚪 Жүйеден шығу</button>
            `;
            authWrapper.appendChild(profilePanel);

            document.getElementById('logoutBtn').addEventListener('click', () => {
                localStorage.removeItem('currentUser');
                window.location.reload();
            });
        }
    }
});
