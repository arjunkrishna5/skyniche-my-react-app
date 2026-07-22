# React App Authentication Explainer

This document serves as your side-by-side guide to understanding how the files we created/modified work together to build the login flow and dashboard.

---

## 1. `src/constants/DefaultValues.js`
This is a simple configuration file.

*   **`REST_API`**: This defines the base URL of your backend API server (`http://localhost:4000/`). When you deploy your backend to a live server later, you only have to change it here, and the rest of the application will automatically point to the new URL.

---

## 2. `src/contents/AuthContext.jsx`
This file manages the global authentication state of your app using the React Context API.

### State Variables
*   **`user`**: Stores details of the logged-in user (like their name, email, profile picture) retrieved from the backend. Default is `null`.
*   **`isAuthenticated`**: A boolean flag (`true` or `false`) indicating if the user is currently signed in.
*   **`loading`**: A boolean flag (`true` by default) that prevents the application from rendering anything until we have checked whether the user is already logged in (via their session cookie).

### Key Functions
#### `fetchUser()` (Runs automatically on startup)
*   **How it works:** It makes a `GET` request to `${REST_API}auth/me`. 
*   **Cookie Handling:** The option `{ withCredentials: true }` is critical. It tells Axios to send the browser cookies (where your JWT token is stored) along with the request.
*   **Results:**
    *   If the token is valid, the server returns the user data. We set `user` state and set `isAuthenticated` to `true`.
    *   If the token is missing or expired, it throws an error. We reset the user to `null` and set `isAuthenticated` to `false`.
    *   Once finished (success or failure), we set `loading` to `false` in the `finally` block so the app can start rendering pages.

#### `login(email, password)` (Called by the Login form)
*   **How it works:** Submits the credentials to the backend endpoint `/login` via `POST`.
*   **On Success:** The backend returns the user object and sets a secure cookie on the browser. We save this user object into state, set `isAuthenticated` to `true`, and return `{ success: true }`.
*   **On Failure:** We log the error and return `{ success: false, error: ... }` so the login component can show the error to the user.

#### `logout()` (Called by the Dashboard logout button)
*   **How it works:** Sends a `POST` request to the backend `/logout` endpoint to tell the server to invalidate the token, clears the local `user` state, and sets `isAuthenticated` to `false`.

---

## 3. `src/components/Login.jsx`
This is the visual sign-in page. It uses Material UI (MUI) for styling, and Formik/Yup to manage the form state and validation.

### Formik & Yup Configuration
*   **`initialValues`**: Tells Formik what inputs to track (`email` and `password`).
*   **`validationSchema`**: Powered by `Yup`. It defines the rules:
    *   `email`: Must be a valid email format and is required.
    *   `password`: Is required.
    If the user types something invalid, Formik automatically catches it and displays an error under the corresponding text field.

### Key Logic
*   **`handleSubmit(values, ...)`**:
    1.  Sets `loading` state to `true` to disable the submit button and show a spinner.
    2.  Calls the `login()` function from our `AuthContext`.
    3.  If successful, it pops up a success alert (`notistack` toast) and uses `navigate("/dashboard")` to redirect the user.
    4.  If it fails, it pops up a red error alert.
*   **`showPassword` State**: Controlled by the eye icon in the password field. Clicking it toggles the `type` attribute of the password field between `password` (masked text) and `text` (visible text).

### Styling Highlights
*   **Glassmorphism:** The login card has a translucent background (`rgba(30, 41, 59, 0.7)`), a border with slight transparency, and `backdropFilter: "blur(12px)"`. This creates the frosted-glass effect over the background gradient.

---

## 4. `src/components/Dashboard.jsx`
This is the layout that appears after log-in, powered by `@toolpad/core`.

### How it works
*   **`AppProvider`**: Wraps the layout and provides the theme, routing state, and sidebar items configured in the `NAVIGATION` array.
*   **`DashboardLayout`**: Renders the sidebar and header. 
*   **`slots.toolbarActions`**: This is where we inject the user's avatar. When clicked, it opens a small floating menu (`Menu` and `MenuItem`) displaying the user's name and a "Logout" action.
*   **`handleLogout`**: Calls the `logout()` function from `AuthContext` to clear cookies, and uses `navigate("/login")` to send the user back to the sign-in screen.

---

## 5. `src/main.jsx`
This is the bootstrapping file of the entire app.

*   **`<SnackbarProvider>`**: Wraps the app to enable toast notifications (popup banners) anywhere in our code.
*   **`<AuthProvider>`**: Wraps the app so that any route, component, or layout nested inside it can import and use `useAuth()`.

---

## 6. `src/App.jsx`
This handles client-side routing.

*   **`ProtectedRoute` Component**:
    *   A helper component that checks if `isAuthenticated` is `true`.
    *   If **yes**, it renders its children (i.e. the Dashboard).
    *   If **no**, it redirects the user to `/login` using the `<Navigate to="/login" replace />` component.
*   **Routing Logic:**
    *   Visiting `/login` check: if already authenticated, redirects you to `/dashboard`. Otherwise, renders the `<Login />` page.
    *   Visiting `/dashboard` check: wraps `<Dashboard />` in `<ProtectedRoute>` so it blocks unauthorized users.
    *   Visiting any other URL (`*` wildcard): redirects you to `/dashboard` (if logged in) or `/login` (if logged out).
