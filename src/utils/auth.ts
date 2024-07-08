// utils/auth.js
/* Client-Side Utility (utils/auth.js)
This function is essential for client-side logic, especially in situations where you navigate within your single-page application (SPA) or need to conditionally render components based on the user's authentication state. The isAuthenticated function checks the presence of a JWT token in local storage.

Key Points:

Dynamic Client-Side Behavior: It enables dynamic UI changes based on the user's authentication state without needing to make a server request every time. For instance, showing or hiding elements, redirecting users, or adjusting what content is displayed.
Immediate Feedback to Users: Provides instant feedback or action based on the user's state when navigating between client-rendered routes or when performing actions that don't involve a full page reload.*/

export const isAuthenticated = () => !!localStorage.getItem("jwtToken");
