export const devTips = [
    "Use meaningful variable names to improve code readability, e.g., `userCount` instead of `x`.",
    "Break down complex functions into smaller, single-purpose functions for better maintainability.",
    "Leverage version control (e.g., Git) and commit frequently with clear messages to track changes effectively.",
    "Write unit tests to catch bugs early and ensure your code behaves as expected.",
    "Use comments sparingly; focus on making your code self-explanatory through clear structure and naming.",
    "Learn keyboard shortcuts for your IDE to boost productivity, like Ctrl+Shift+F for global search.",
    "Regularly refactor your code to eliminate technical debt and improve performance.",
    "Use linters and formatters (e.g., ESLint, Prettier) to enforce consistent coding styles.",
    "Understand time complexity (e.g., O(n) vs O(n²)) to write efficient algorithms.",
    "Back up your work regularly and use cloud storage to prevent data loss.",
    "Practice defensive programming by validating inputs to prevent unexpected errors.",
    "Keep your dependencies updated, but test thoroughly to avoid breaking changes.",
    "Use environment variables to store sensitive data like API keys securely.",
    "Profile your application to identify and optimize performance bottlenecks.",
    "Read documentation thoroughly before integrating a new library or framework.",
    "Pair program with a colleague to share knowledge and catch mistakes early.",
    "Use `const` by default in JavaScript, and only use `let` when reassignment is needed.",
    "Learn to use debugging tools like breakpoints and watch variables to troubleshoot effectively.",
    "Write clear error messages that help users understand and resolve issues.",
    "Stay curious and experiment with new tools or languages to broaden your skillset.",
];

export const getRandomTip = () => {
    const index = Math.floor(Math.random() * devTips.length);
    return devTips[index];
};

export const showMessage = (message) => {
    // Create a temporary toast message
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #4CAF50;
      color: white;
      padding: 12px 20px;
      border-radius: 6px;
      z-index: 1000;
      font-weight: bold;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
        document.body.removeChild(toast);
    }, 3000);
};

export const hexToRgb = (hex) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgb(${r}, ${g}, ${b})`;
};