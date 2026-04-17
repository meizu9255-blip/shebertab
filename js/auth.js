document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('auth-container');
  const signUpBtn = document.getElementById('signUpBtn');
  const signInBtn = document.getElementById('signInBtn');
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('reg-form');
  const alertBox = document.getElementById('alert-box');

  const showAlert = (message, type = 'success') => {
    alertBox.textContent = message;
    alertBox.className = `message-box ${type} slide-in`;
    alertBox.style.display = 'block';
    
    setTimeout(() => {
      alertBox.style.display = 'none';
      alertBox.className = 'message-box';
    }, 4000);
  };

  // Setup slider
  if(signUpBtn) {
    signUpBtn.addEventListener('click', () => {
      container.classList.add('active');
    });
  }

  if(signInBtn) {
    signInBtn.addEventListener('click', () => {
      container.classList.remove('active');
    });
  }

  // Register Form Logic
  if(regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = regForm.name.value.trim();
      const email = regForm.email.value;
      const password = regForm.password.value;
      const confirmPassword = regForm.confirmPassword.value;

      if (name.length < 6) {
        return showAlert('Қате: Аты-жөніңіз кемінде 6 символ болуы тиіс!', 'error');
      }

      if (/\d/.test(name)) {
        return showAlert('Қате: Аты-жөніңізге сандар жазуға болмайды!', 'error');
      }

      if (password.length < 5) {
        return showAlert('Қате: Құпиясөз кем дегенде 5 таңба болуы тиіс!', 'error');
      }

      if (password !== confirmPassword) {
        return showAlert('Қате: Құпиясөздер сәйкес келмейді!', 'error');
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      if (users.find(u => u.email === email)) {
        return showAlert('Қате: Бұл email тіркелген!', 'error');
      }

      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      showAlert('Аккаунт жасалды! Жүйеге кіріп жатырсыз...', 'success');
      regForm.reset();
      
      localStorage.setItem('currentUser', JSON.stringify({ name, email }));
      setTimeout(() => window.location.reload(), 1500);
    });
  }

  // Login Form Logic
  if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = loginForm.email.value;
      const password = loginForm.password.value;

      if (!email.includes('@')) {
        return showAlert('Қате: Email дұрыс емес!', 'error');
      }
      if (password.length < 5) {
        return showAlert('Қате: Құпиясөз кем дегенде 5 таңба болуы тиіс!', 'error');
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const found = users.find(u => u.email === email && u.password === password);

      if (found) {
        localStorage.setItem('currentUser', JSON.stringify({ name: found.name, email: found.email }));
        showAlert('Жүйеге сәтті кірдіңіз!', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        return showAlert('Қате: Email немесе пароль қате!', 'error');
      }
    });
  }
});
