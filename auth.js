/* =========================================================
   MISHRA DRY FRUIT MART - AUTHENTICATION JS
   File: frontend/js/auth.js

   Frontend authentication for development/demo.
   Production version will use Node.js backend + database.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STORAGE KEYS
    ===================================================== */

    const USERS_KEY = "dryfruit_users";
    const CURRENT_USER_KEY = "dryfruit_current_user";
    const REMEMBER_KEY = "dryfruit_remember_me";

    /* =====================================================
       PAGE ELEMENTS
    ===================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const registerForm =
        document.getElementById("registerForm");

    /* =====================================================
       INITIALIZE
    ===================================================== */

    initAuth();

    function initAuth() {

        setupPasswordToggles();

        setupLogin();

        setupRegister();

        setupForgotPassword();

        setupPhoneInput();

        updateAccountUI();

        handleAlreadyLoggedIn();

    }

    /* =====================================================
       GET USERS
    ===================================================== */

    function getUsers() {

        try {

            const savedUsers =
                localStorage.getItem(USERS_KEY);

            if (!savedUsers) {
                return [];
            }

            const users =
                JSON.parse(savedUsers);

            return Array.isArray(users)
                ? users
                : [];

        } catch (error) {

            console.error(
                "Unable to load users:",
                error
            );

            return [];

        }

    }

    /* =====================================================
       SAVE USERS
    ===================================================== */

    function saveUsers(users) {

        localStorage.setItem(
            USERS_KEY,
            JSON.stringify(users)
        );

    }

    /* =====================================================
       CURRENT USER
    ===================================================== */

    function getCurrentUser() {

        try {

            const savedUser =
                localStorage.getItem(
                    CURRENT_USER_KEY
                );

            if (!savedUser) {
                return null;
            }

            return JSON.parse(savedUser);

        } catch (error) {

            console.error(
                "Unable to load current user:",
                error
            );

            return null;

        }

    }

    /* =====================================================
       SAVE CURRENT USER
    ===================================================== */

    function saveCurrentUser(user) {

        if (!user) {
            return;
        }

        /*
         * Do not store unnecessary sensitive data
         * in the session object.
         */
        const sessionUser = {

            id: user.id,

            firstName:
                user.firstName,

            lastName:
                user.lastName,

            name:
                user.name,

            email:
                user.email,

            phone:
                user.phone,

            createdAt:
                user.createdAt

        };

        localStorage.setItem(
            CURRENT_USER_KEY,
            JSON.stringify(sessionUser)
        );

    }

    /* =====================================================
       LOGOUT
    ===================================================== */

    function logout() {

        localStorage.removeItem(
            CURRENT_USER_KEY
        );

        localStorage.removeItem(
            REMEMBER_KEY
        );

        showAuthToast(
            "You have been logged out.",
            "success"
        );

        setTimeout(function () {

            window.location.href =
                "index.html";

        }, 700);

    }

    /* =====================================================
       PASSWORD TOGGLES
    ===================================================== */

    function setupPasswordToggles() {

        setupPasswordToggle(
            "loginPassword",
            "loginPasswordToggle"
        );

        setupPasswordToggle(
            "registerPassword",
            "registerPasswordToggle"
        );

        setupPasswordToggle(
            "registerConfirmPassword",
            "registerConfirmPasswordToggle"
        );

    }

    function setupPasswordToggle(
        inputId,
        buttonId
    ) {

        const input =
            document.getElementById(inputId);

        const button =
            document.getElementById(buttonId);

        if (!input || !button) {
            return;
        }

        button.addEventListener(
            "click",
            function () {

                const icon =
                    button.querySelector("i");

                if (input.type === "password") {

                    input.type = "text";

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye"
                        );

                        icon.classList.add(
                            "fa-eye-slash"
                        );

                    }

                    button.setAttribute(
                        "aria-label",
                        "Hide password"
                    );

                } else {

                    input.type = "password";

                    if (icon) {

                        icon.classList.remove(
                            "fa-eye-slash"
                        );

                        icon.classList.add(
                            "fa-eye"
                        );

                    }

                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }

            }
        );

    }

    /* =====================================================
       LOGIN
    ===================================================== */

    function setupLogin() {

        if (!loginForm) {
            return;
        }

        loginForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                loginUser();

            }
        );

    }

    function loginUser() {

        const email =
            getInputValue("loginEmail")
                .toLowerCase();

        const password =
            getInputValue("loginPassword");

        const rememberMe =
            document.getElementById(
                "rememberMe"
            );

        clearLoginErrors();

        let valid = true;

        /* Email */
        if (!isValidEmail(email)) {

            showInputError(
                "loginEmail",
                "Please enter a valid email address."
            );

            valid = false;

        }

        /* Password */
        if (!password) {

            showInputError(
                "loginPassword",
                "Please enter your password."
            );

            valid = false;

        }

        if (!valid) {
            return;
        }

        const users =
            getUsers();

        const user =
            users.find(function (item) {

                return (
                    String(item.email)
                        .toLowerCase() === email
                    &&
                    item.password === password
                );

            });

        if (!user) {

            showInputError(
                "loginPassword",
                "Invalid email or password."
            );

            showAuthToast(
                "Invalid email or password.",
                "error"
            );

            return;

        }

        /* Save session */
        saveCurrentUser(user);

        /* Remember me */
        if (
            rememberMe &&
            rememberMe.checked
        ) {

            localStorage.setItem(
                REMEMBER_KEY,
                "true"
            );

        } else {

            localStorage.removeItem(
                REMEMBER_KEY
            );

        }

        showAuthToast(
            `Welcome back, ${user.firstName}!`,
            "success"
        );

        /* Disable button */
        const loginBtn =
            document.getElementById(
                "loginBtn"
            );

        if (loginBtn) {

            loginBtn.disabled = true;

            loginBtn.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true">
                </span>
                Login Successful
            `;

        }

        /*
         * Check if user came from another page.
         */
        const redirectPage =
            sessionStorage.getItem(
                "dryfruit_login_redirect"
            );

        sessionStorage.removeItem(
            "dryfruit_login_redirect"
        );

        setTimeout(function () {

            if (redirectPage) {

                window.location.href =
                    redirectPage;

            } else {

                window.location.href =
                    "index.html";

            }

        }, 900);

    }

    /* =====================================================
       REGISTER
    ===================================================== */

    function setupRegister() {

        if (!registerForm) {
            return;
        }

        registerForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                registerUser();

            }
        );

        /* Password strength feedback */
        const password =
            document.getElementById(
                "registerPassword"
            );

        if (password) {

            password.addEventListener(
                "input",
                function () {

                    updatePasswordStrength(
                        password.value
                    );

                }
            );

        }

    }

    function registerUser() {

        const firstName =
            getInputValue(
                "registerFirstName"
            );

        const lastName =
            getInputValue(
                "registerLastName"
            );

        const email =
            getInputValue(
                "registerEmail"
            ).toLowerCase();

        const phone =
            getInputValue(
                "registerPhone"
            ).replace(/\D/g, "");

        const password =
            getInputValue(
                "registerPassword"
            );

        const confirmPassword =
            getInputValue(
                "registerConfirmPassword"
            );

        const terms =
            document.getElementById(
                "registerTerms"
            );

        clearRegisterErrors();

        let valid = true;

        /* First name */
        if (firstName.length < 2) {

            showInputError(
                "registerFirstName",
                "Please enter your first name."
            );

            valid = false;

        }

        /* Last name */
        if (lastName.length < 2) {

            showInputError(
                "registerLastName",
                "Please enter your last name."
            );

            valid = false;

        }

        /* Email */
        if (!isValidEmail(email)) {

            showInputError(
                "registerEmail",
                "Please enter a valid email address."
            );

            valid = false;

        }

        /* Phone */
        if (
            !/^[6-9][0-9]{9}$/.test(phone)
        ) {

            showInputError(
                "registerPhone",
                "Please enter a valid 10-digit mobile number."
            );

            valid = false;

        }

        /* Password */
        if (password.length < 6) {

            showInputError(
                "registerPassword",
                "Password must be at least 6 characters."
            );

            valid = false;

        }

        /* Confirm password */
        if (
            password !== confirmPassword
        ) {

            showInputError(
                "registerConfirmPassword",
                "Passwords do not match."
            );

            valid = false;

        }

        /* Terms */
        if (
            !terms ||
            !terms.checked
        ) {

            const termsError =
                document.getElementById(
                    "registerTermsError"
                );

            if (termsError) {

                termsError.textContent =
                    "Please accept the terms and conditions.";

                termsError.style.display =
                    "block";

            }

            if (terms) {

                terms.classList.add(
                    "is-invalid"
                );

            }

            valid = false;

        }

        if (!valid) {

            showAuthToast(
                "Please correct the highlighted fields.",
                "warning"
            );

            return;

        }

        /* =================================================
           CHECK EXISTING USER
        ================================================= */

        const users =
            getUsers();

        const emailExists =
            users.some(function (user) {

                return (
                    String(user.email)
                        .toLowerCase() === email
                );

            });

        if (emailExists) {

            showInputError(
                "registerEmail",
                "An account with this email already exists."
            );

            showAuthToast(
                "Email is already registered.",
                "error"
            );

            return;

        }

        const phoneExists =
            users.some(function (user) {

                return (
                    String(user.phone) === phone
                );

            });

        if (phoneExists) {

            showInputError(
                "registerPhone",
                "This mobile number is already registered."
            );

            showAuthToast(
                "Mobile number is already registered.",
                "error"
            );

            return;

        }

        /* =================================================
           CREATE USER
        ================================================= */

        const newUser = {

            id:
                generateUserId(),

            firstName:
                firstName,

            lastName:
                lastName,

            name:
                `${firstName} ${lastName}`.trim(),

            email:
                email,

            phone:
                phone,

            /*
             * Development-only storage.
             * Production backend will hash passwords.
             */
            password:
                password,

            createdAt:
                new Date().toISOString()

        };

        users.push(newUser);

        saveUsers(users);

        /* Automatically login */
        saveCurrentUser(newUser);

        localStorage.setItem(
            REMEMBER_KEY,
            "true"
        );

        showRegisterSuccess(
            `Account created successfully! Welcome, ${firstName}.`
        );

        const registerBtn =
            document.getElementById(
                "registerBtn"
            );

        if (registerBtn) {

            registerBtn.disabled = true;

            registerBtn.innerHTML = `
                <span
                    class="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true">
                </span>
                Account Created
            `;

        }

        setTimeout(function () {

            window.location.href =
                "index.html";

        }, 1200);

    }

    /* =====================================================
       PASSWORD STRENGTH
    ===================================================== */

    function updatePasswordStrength(
        password
    ) {

        const passwordInput =
            document.getElementById(
                "registerPassword"
            );

        if (!passwordInput) {
            return;
        }

        let strength = "";

        if (!password) {

            strength = "";

        } else if (
            password.length < 6
        ) {

            strength = "weak";

        } else if (
            password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[a-z]/.test(password) &&
            /[0-9]/.test(password)
        ) {

            strength = "strong";

        } else {

            strength = "medium";

        }

        /*
         * Remove old indicator
         */
        const oldIndicator =
            document.getElementById(
                "passwordStrength"
            );

        if (oldIndicator) {
            oldIndicator.remove();
        }

        if (!strength) {
            return;
        }

        const indicator =
            document.createElement("div");

        indicator.id =
            "passwordStrength";

        indicator.className =
            "password-strength";

        let text = "";

        if (strength === "weak") {
            text = "Weak password";
        }

        if (strength === "medium") {
            text = "Medium password";
        }

        if (strength === "strong") {
            text = "Strong password";
        }

        indicator.textContent =
            text;

        passwordInput
            .parentElement
            .parentElement
            .appendChild(
                indicator
            );

    }

    /* =====================================================
       FORGOT PASSWORD
    ===================================================== */

    function setupForgotPassword() {

        const link =
            document.getElementById(
                "forgotPasswordLink"
            );

        if (!link) {
            return;
        }

        link.addEventListener(
            "click",
            function (event) {

                event.preventDefault();

                forgotPassword();

            }
        );

    }

    function forgotPassword() {

        const emailInput =
            document.getElementById(
                "loginEmail"
            );

        let email =
            emailInput
                ? emailInput.value.trim()
                : "";

        if (!email) {

            email =
                prompt(
                    "Enter your registered email address:"
                );

            if (!email) {
                return;
            }

        }

        email =
            email
                .trim()
                .toLowerCase();

        if (!isValidEmail(email)) {

            showAuthToast(
                "Please enter a valid email address.",
                "warning"
            );

            return;

        }

        const users =
            getUsers();

        const user =
            users.find(function (item) {

                return (
                    String(item.email)
                        .toLowerCase() === email
                );

            });

        if (!user) {

            showAuthToast(
                "No account was found with this email.",
                "error"
            );

            return;

        }

        /*
         * This is only a frontend demo.
         * Real reset links will be sent from backend.
         */
        showAuthToast(
            "Password reset feature will be connected to the backend later.",
            "info"
        );

    }

    /* =====================================================
       PHONE INPUT
    ===================================================== */

    function setupPhoneInput() {

        const phone =
            document.getElementById(
                "registerPhone"
            );

        if (!phone) {
            return;
        }

        phone.addEventListener(
            "input",
            function () {

                phone.value =
                    phone.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

            }
        );

    }

    /* =====================================================
       ALREADY LOGGED IN
    ===================================================== */

    function handleAlreadyLoggedIn() {

        const currentUser =
            getCurrentUser();

        if (!currentUser) {
            return;
        }

        /*
         * If the user is on login/register page,
         * don't forcibly redirect immediately.
         * We simply show a helpful message.
         */

        if (
            loginForm &&
            !sessionStorage.getItem(
                "auth_message_shown"
            )
        ) {

            showAuthToast(
                `You are already logged in as ${currentUser.firstName}.`,
                "info"
            );

            sessionStorage.setItem(
                "auth_message_shown",
                "true"
            );

        }

    }

    /* =====================================================
       UPDATE ACCOUNT UI
    ===================================================== */

    function updateAccountUI() {

        const currentUser =
            getCurrentUser();

        /*
         * Existing user menu, if another page
         * has already created one.
         */

        const userNames =
            document.querySelectorAll(
                "[data-user-name]"
            );

        userNames.forEach(
            function (element) {

                element.textContent =
                    currentUser
                        ? currentUser.name
                        : "Account";

            }
        );

        const loggedInElements =
            document.querySelectorAll(
                "[data-auth='logged-in']"
            );

        const loggedOutElements =
            document.querySelectorAll(
                "[data-auth='logged-out']"
            );

        loggedInElements.forEach(
            function (element) {

                element.style.display =
                    currentUser
                        ? ""
                        : "none";

            }
        );

        loggedOutElements.forEach(
            function (element) {

                element.style.display =
                    currentUser
                        ? "none"
                        : "";

            }
        );

    }

    /* =====================================================
       VALIDATION HELPERS
    ===================================================== */

    function isValidEmail(email) {

        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            .test(email);

    }

    function getInputValue(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";

    }

    function showInputError(
        inputId,
        message
    ) {

        const input =
            document.getElementById(
                inputId
            );

        if (!input) {
            return;
        }

        input.classList.add(
            "is-invalid"
        );

        /*
         * Prefer the specific error element
         * already present in HTML.
         */
        const errorElement =
            document.getElementById(
                inputId + "Error"
            );

        if (errorElement) {

            errorElement.textContent =
                message;

            errorElement.style.display =
                "block";

            return;

        }

        let feedback =
            input.parentElement
                .querySelector(
                    ".invalid-feedback"
                );

        if (!feedback) {

            feedback =
                document.createElement(
                    "div"
                );

            feedback.className =
                "invalid-feedback";

            input.parentElement.appendChild(
                feedback
            );

        }

        feedback.textContent =
            message;

    }

    function clearLoginErrors() {

        [
            "loginEmail",
            "loginPassword"
        ].forEach(function (id) {

            clearInputError(id);

        });

    }

    function clearRegisterErrors() {

        [
            "registerFirstName",
            "registerLastName",
            "registerEmail",
            "registerPhone",
            "registerPassword",
            "registerConfirmPassword"
        ].forEach(function (id) {

            clearInputError(id);

        });

        const terms =
            document.getElementById(
                "registerTerms"
            );

        if (terms) {

            terms.classList.remove(
                "is-invalid"
            );

        }

        const termsError =
            document.getElementById(
                "registerTermsError"
            );

        if (termsError) {

            termsError.textContent =
                "";

            termsError.style.display =
                "";

        }

    }

    function clearInputError(id) {

        const input =
            document.getElementById(id);

        if (!input) {
            return;
        }

        input.classList.remove(
            "is-invalid"
        );

        const error =
            document.getElementById(
                id + "Error"
            );

        if (error) {

            error.textContent =
                "";

            error.style.display =
                "";

        }

    }

    /* =====================================================
       SUCCESS MESSAGE
    ===================================================== */

    function showRegisterSuccess(
        message
    ) {

        const messageBox =
            document.getElementById(
                "registerMessage"
            );

        if (messageBox) {

            messageBox.className =
                "auth-message success show";

            messageBox.innerHTML = `
                <i class="fas fa-check-circle me-2"></i>
                ${escapeHTML(message)}
            `;

        }

        showAuthToast(
            message,
            "success"
        );

    }

    /* =====================================================
       TOAST
    ===================================================== */

    function showAuthToast(
        message,
        type = "info"
    ) {

        /*
         * Use existing app.js toast if available.
         */
        if (
            typeof showToast === "function"
        ) {

            showToast(
                message,
                type
            );

            return;

        }

        const toast =
            document.getElementById(
                "toast"
            );

        const toastMessage =
            document.getElementById(
                "toastMessage"
            );

        const toastIcon =
            document.getElementById(
                "toastIcon"
            );

        if (!toast) {

            alert(message);

            return;

        }

        if (toastMessage) {

            toastMessage.textContent =
                message;

        }

        if (toastIcon) {

            toastIcon.className =
                "fas " +
                getToastIcon(type);

        }

        toast.classList.add("show");

        setTimeout(function () {

            toast.classList.remove(
                "show"
            );

        }, 3500);

    }

    function getToastIcon(type) {

        switch (type) {

            case "success":
                return "fa-check-circle";

            case "error":
                return "fa-times-circle";

            case "warning":
                return "fa-exclamation-circle";

            default:
                return "fa-info-circle";

        }

    }

    /* =====================================================
       GENERATE USER ID
    ===================================================== */

    function generateUserId() {

        return (
            "user_" +
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 8)
        );

    }

    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHTML(value) {

        if (
            value === null ||
            value === undefined
        ) {

            return "";

        }

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

    /* =====================================================
       PUBLIC AUTH API
    ===================================================== */

    window.DryFruitAuth = {

        getCurrentUser:
            getCurrentUser,

        getUsers:
            getUsers,

        isLoggedIn:
            function () {

                return !!getCurrentUser();

            },

        logout:
            logout,

        login:
            loginUser,

        register:
            registerUser,

        updateAccountUI:
            updateAccountUI

    };

});