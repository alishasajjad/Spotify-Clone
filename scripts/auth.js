// ===== auth.js (fixed) =====
document.addEventListener('DOMContentLoaded', () => {
  const loginForm  = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  // Strong but simple rule: 6+ chars, 1 uppercase, 1 digit
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;

  // ----- Helpers -----
  const safeParse = (key, fallback) => {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  };

  const showError = (el, msg) => { if (el) el.textContent = msg; };
  const clearErrors = () => document.querySelectorAll('.error-message').forEach(e => e.textContent = '');

  // Normalize inputs
  const normEmail = (e) => (e || "").trim().toLowerCase();
  const normPass  = (p) => (p || "").trim();
  const nowMs     = () => new Date().getTime();

  // ----- Remembered user (optional autofill) -----
  const checkRememberedUser = () => {
    if (!loginForm) return;
    const remembered = safeParse('rememberedUser', null);
    const current = safeParse('currentUser', null);
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    if (remembered && (nowMs() - remembered.timestamp) < THIRTY_DAYS) {
      const emailInput = document.getElementById('email');
      const rememberMe = document.getElementById('rememberMe');
      if (emailInput)  emailInput.value = remembered.email || '';
      if (rememberMe)  rememberMe.checked = true;

      if (current && current.email === remembered.email) {
        const box = document.querySelector('.login-container');
        if (box) {
          const msg = document.createElement('div');
          msg.className = 'welcome-message';
          msg.textContent = `Welcome back, ${current.name || 'User'}!`;
          box.prepend(msg);
        }
        setTimeout(() => { window.location.href = "home.html"; }, 1200);
      }
    }
  };

  // ----- LOGIN -----
  if (loginForm) {
    const emailInput        = document.getElementById('email');
    const passwordInput     = document.getElementById('password');
    const rememberMeCheckbox= document.getElementById('rememberMe');
    const loginButton       = document.getElementById('loginButton');

    const loginError    = document.getElementById('login-error');
    const emailError    = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    checkRememberedUser();

    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const email    = normEmail(emailInput?.value);
      const password = normPass(passwordInput?.value);
      const remember = !!(rememberMeCheckbox && rememberMeCheckbox.checked);

      let ok = true;
      if (!email)     { showError(emailError, "Email is required"); ok = false; }
      if (!password)  { showError(passwordError, "Password is required"); ok = false; }
      else if (!passwordRegex.test(password)) {
        showError(passwordError, "At least 6 chars, 1 number, 1 uppercase");
        ok = false;
      }
      if (!ok) return;

      const users = safeParse('users', []);
      // Compare email case-insensitively and password exactly
      const user = users.find(u => normEmail(u.email) === email && normPass(u.password) === password);

      // Debug help in console:
      console.log("[auth] users:", users);
      console.log("[auth] trying login:", { email, hasUser: !!user });

      if (user) {
        if (loginButton) loginButton.classList.add('loading');

        if (remember) {
          localStorage.setItem('rememberedUser', JSON.stringify({
            email, timestamp: nowMs()
          }));
        } else {
          localStorage.removeItem('rememberedUser');
        }

        localStorage.setItem('currentUser', JSON.stringify({
          name: user.name, email: normEmail(user.email)
        }));

        setTimeout(() => { window.location.href = "home.html"; }, 800);
      } else {
        showError(loginError, "Invalid email or password");
      }
    });
  }

  // ----- SIGNUP -----
  if (signupForm) {
    const nameInput     = document.getElementById('name');
    const emailInput    = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const signupButton  = document.getElementById('signupButton');

    const nameError     = document.getElementById('name-error');
    const emailError    = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const signupError   = document.getElementById('signup-error');

    passwordInput?.addEventListener('input', () => {
      const p = normPass(passwordInput.value);
      passwordError.textContent = (p && !passwordRegex.test(p))
        ? "At least 6 chars, 1 number, 1 uppercase"
        : "";
    });

    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearErrors();

      const name     = (nameInput?.value || "").trim();
      const email    = normEmail(emailInput?.value);
      const password = normPass(passwordInput?.value);

      let ok = true;
      if (!name)     { showError(nameError, "Name is required"); ok = false; }
      if (!email)    { showError(emailError, "Email is required"); ok = false; }
      if (!password) { showError(passwordError, "Password is required"); ok = false; }
      else if (!passwordRegex.test(password)) {
        showError(passwordError, "At least 6 chars, 1 number, 1 uppercase");
        ok = false;
      }
      if (!ok) return;

      const users = safeParse('users', []);
      if (users.some(u => normEmail(u.email) === email)) {
        showError(emailError, "Email already in use");
        return;
      }

      users.push({ name, email, password });
      localStorage.setItem('users', JSON.stringify(users));

      if (signupButton) signupButton.classList.add('loading');
      setTimeout(() => { window.location.href = "login.html"; }, 800);
    });
  }
});
