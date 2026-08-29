import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const themeGradients = {
    default: "#f3f4f6",

    blue: "linear-gradient(135deg, #2563eb, #06b6d4)",

    green: "linear-gradient(135deg, #16a34a, #14b8a6)",

    purple: "linear-gradient(135deg, #7c3aed, #ec4899)",

    orange: "linear-gradient(135deg, #f97316, #facc15)",

    red: "linear-gradient(135deg, #dc2626, #f97316)",

    pink: "linear-gradient(135deg, #db2777, #f43f5e)",

    cyan: "linear-gradient(135deg, #0891b2, #3b82f6)",
};

const darkBackground = {
    default: "#10172a",
    blue: "linear-gradient(135deg, #1e3a8a, #155e75)",
    green: "linear-gradient(135deg, #14532d, #115e59)",
    purple: "linear-gradient(135deg, #3b0764, #831843)",
    orange: "linear-gradient(135deg, #7c2d12, #713f12)",
    red: "linear-gradient(135deg, #7f1d1d, #7c2d12)",
    pink: "linear-gradient(135deg, #831843, #881337)",
    cyan: "linear-gradient(135deg, #164e63, #1e3a8a)",
};

const ThemeProvider = ({ children }) => {
    const { theme, colorTheme } = useSelector(
        (state) => state.theme
    );

    useEffect(() => {
        const root = document.documentElement;

        if (theme === "dark") {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }

        console.log("Theme:", theme);
        console.log("Color Theme:", colorTheme);
    }, [theme, colorTheme]);

    const currentBackground =
        theme === "dark"
            ? darkBackground[colorTheme] ||
              darkBackground.default
            : themeGradients[colorTheme] ||
              themeGradients.default;

    return (
        <div
            className="min-h-screen transition-all duration-500"
            style={{
                background: currentBackground,
            }}
        >
            {children}
        </div>
    );
};

export default ThemeProvider;