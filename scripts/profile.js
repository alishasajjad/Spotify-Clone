// ===== profile.js =====
// Displays and manages user profile

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const profileTitle = document.getElementById("profileTitle");
  const nameField = document.getElementById("userName");
  const emailField = document.getElementById("userEmail");
  const passwordField = document.getElementById("userPassword");
  const editNameInput = document.getElementById("editName");
  const editEmailInput = document.getElementById("editEmail");
  const editPasswordInput = document.getElementById("editPassword");
  const logoutBtn = document.getElementById("logoutBtn");
  const editProfileBtn = document.getElementById("editProfileBtn");
  const updateProfileBtn = document.getElementById("updateProfileBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const updateMessage = document.getElementById("updateMessage");
  const passwordToggleBtn = document.getElementById('passwordToggleBtn');
  
  // Load user data from localStorage
  loadUserData();
  
  // Check if user is logged in, if not redirect to login
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || !currentUser.email) {
    // Show guest mode - no redirect, just show guest info
    console.log("User not logged in - showing guest profile");
  }
  
  // Event Listeners
  logoutBtn.addEventListener("click", handleLogout);
  editProfileBtn.addEventListener("click", toggleEditMode);
  updateProfileBtn.addEventListener("click", handleProfileUpdate);
  cancelEditBtn.addEventListener("click", cancelEdit);
  passwordToggleBtn.addEventListener('click', togglePasswordVisibility);
  
  // Functions
  function loadUserData() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    
    if (currentUser && currentUser.email) {
      // Find the full user data in the users array
      const userData = users.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase()) || {};
      
      // Set user info
      const displayName = currentUser.name || userData.name || "User";
      nameField.textContent = displayName;
      emailField.textContent = currentUser.email;
      passwordField.textContent = "••••••••"; // Masked password
      profileTitle.textContent = `${displayName}'s Profile`;
      
      // Pre-fill edit fields
      editNameInput.value = displayName;
      editEmailInput.value = currentUser.email;
      editPasswordInput.value = userData.password || "";
    } else {
      // Not logged in, show guest info
      nameField.textContent = "Guest";
      emailField.textContent = "Not logged in";
      passwordField.textContent = "Not available";
      profileTitle.textContent = "Guest Profile";
      
      // Disable edit button for guests
      if (editProfileBtn) {
        editProfileBtn.disabled = true;
        editProfileBtn.classList.add("disabled");
      }
    }
  }
  
  function togglePasswordVisibility() {
    const passwordToggleIcon = document.getElementById('passwordToggleIcon');
    const isPassword = editPasswordInput.type === 'password';
    editPasswordInput.type = isPassword ? 'text' : 'password';
    passwordToggleIcon.classList.toggle('fa-eye');
    passwordToggleIcon.classList.toggle('fa-eye-slash');
  }
  
  function handleLogout() {
    // Clear all authentication data
    localStorage.removeItem("currentUser");
    localStorage.removeItem("rememberedUser");
    showMessage("Logged out successfully!");
    
    // Update display to guest mode
    nameField.textContent = "Guest";
    emailField.textContent = "Not logged in";
    passwordField.textContent = "Not available";
    
    // Disable edit button
    editProfileBtn.disabled = true;
    editProfileBtn.classList.add("disabled");
    
    // Redirect to login page after a short delay
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
  }
  
  function toggleEditMode() {
    // Hide display fields, show edit fields
    nameField.style.display = "none";
    emailField.style.display = "none";
    passwordField.style.display = "none";
    editNameInput.style.display = "block";
    editEmailInput.style.display = "block";
    
    // Show password input wrapper (contains input and toggle button)
    const passwordWrapper = document.querySelector('.password-input-wrapper');
    if (passwordWrapper) {
      passwordWrapper.style.display = "block";
    }
    
    // Toggle buttons
    editProfileBtn.style.display = "none";
    updateProfileBtn.style.display = "flex";
    cancelEditBtn.style.display = "flex";
    logoutBtn.style.display = "none";
  }
  
  function cancelEdit() {
    // Show display fields, hide edit fields
    nameField.style.display = "block";
    emailField.style.display = "block";
    passwordField.style.display = "block";
    editNameInput.style.display = "none";
    editEmailInput.style.display = "none";
    
    // Hide password input wrapper
    const passwordWrapper = document.querySelector('.password-input-wrapper');
    if (passwordWrapper) {
      passwordWrapper.style.display = "none";
    }
    
    // Reset password visibility to hidden
    const passwordToggleIcon = document.getElementById('passwordToggleIcon');
    if (passwordToggleIcon && editPasswordInput.type === 'text') {
      togglePasswordVisibility();
    }
    
    // Reset edit fields to current values
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userData = users.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase()) || {};
    
    editNameInput.value = currentUser.name || userData.name || nameField.textContent;
    editEmailInput.value = currentUser.email || emailField.textContent;
    editPasswordInput.value = userData.password || "";
    
    // Toggle buttons back
    editProfileBtn.style.display = "flex";
    updateProfileBtn.style.display = "none";
    cancelEditBtn.style.display = "none";
    logoutBtn.style.display = "flex";
  }
  
  function handleProfileUpdate() {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!currentUser || !currentUser.email) return;
    
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userIndex = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase());
    
    if (userIndex === -1) {
      showMessage("User not found!", "error");
      return;
    }
    
    // Get updated values
    const newName = editNameInput.value.trim();
    const newEmail = editEmailInput.value.trim();
    const newPassword = editPasswordInput.value.trim();
    
    // Validate inputs
    if (!newName || !newEmail || !newPassword) {
      showMessage("All fields are required!", "error");
      return;
    }
    
    // Validate password strength (same as auth.js)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      showMessage("Password must be at least 6 chars with 1 uppercase and 1 number!", "error");
      return;
    }
    
    // Check if email is already taken by another user
    if (newEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
      const emailExists = users.some(u => u.email.toLowerCase() === newEmail.toLowerCase());
      if (emailExists) {
        showMessage("Email already in use!", "error");
        return;
      }
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      name: newName,
      email: newEmail,
      password: newPassword
    };
    
    // Save updated users array
    localStorage.setItem("users", JSON.stringify(users));
    
    // Update current user if email changed
    if (newEmail.toLowerCase() !== currentUser.email.toLowerCase()) {
      localStorage.setItem("currentUser", JSON.stringify({
        name: newName,
        email: newEmail
      }));
    } else {
      localStorage.setItem("currentUser", JSON.stringify({
        name: newName,
        email: currentUser.email
      }));
    }
    
    // Update display
    nameField.textContent = newName;
    emailField.textContent = newEmail;
    passwordField.textContent = "••••••••"; // Masked password
    
    // Exit edit mode
    cancelEdit();
    
    // Show success message
    showMessage("Profile updated successfully!");
  }
  
  function showMessage(message, type = "success") {
    updateMessage.textContent = message;
    updateMessage.className = type === "success" ? "update-message" : "update-message error";
    
    // Show message with animation
    setTimeout(() => {
      updateMessage.classList.add("show");
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
      updateMessage.classList.remove("show");
    }, 3000);
  }
});
