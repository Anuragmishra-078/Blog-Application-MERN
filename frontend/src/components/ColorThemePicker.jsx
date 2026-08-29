import React from "react";
import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";

import {
    Palette,
    Check,
} from "lucide-react";

import {
    setColorTheme,
} from "@/redux/themeSlice";

const themes = [
    {
        name: "default",
        label: "Original",
        preview: "#374151",
    },
    {
        name: "blue",
        label: "Blue",
        preview: "linear-gradient(135deg, #2563eb, #06b6d4)",
    },
    {
        name: "green",
        label: "Green",
        preview: "linear-gradient(135deg, #16a34a, #14b8a6)",
    },
    {
        name: "purple",
        label: "Purple",
        preview: "linear-gradient(135deg, #7c3aed, #ec4899)",
    },
    {
        name: "orange",
        label: "Orange",
        preview: "linear-gradient(135deg, #f97316, #facc15)",
    },
    {
        name: "red",
        label: "Red",
        preview: "linear-gradient(135deg, #dc2626, #f97316)",
    },
    {
        name: "pink",
        label: "Pink",
        preview: "linear-gradient(135deg, #db2777, #f43f5e)",
    },
    {
        name: "cyan",
        label: "Cyan",
        preview: "linear-gradient(135deg, #0891b2, #3b82f6)",
    },
];

const ColorThemePicker = () => {
    const dispatch = useDispatch();

    const { colorTheme } = useSelector(
        (state) => state.theme
    );

    const handleThemeChange = (themeName) => {
        console.log(
            "Changing color theme to:",
            themeName
        );

        dispatch(
            setColorTheme(themeName)
        );
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    title="Change color theme"
                >
                    <Palette className="h-5 w-5" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-80">

                <div className="space-y-4">

                    <div>
                        <h3 className="text-lg font-semibold">
                            Choose Theme
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Select a color gradient
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-3">

                        {themes.map((item) => (

                            <button
                                key={item.name}
                                type="button"
                                title={item.label}
                                onClick={() =>
                                    handleThemeChange(
                                        item.name
                                    )
                                }
                                className={`relative h-14 rounded-xl transition-all duration-200 hover:scale-105 ${
                                    colorTheme === item.name
                                        ? "ring-4 ring-black dark:ring-white scale-105"
                                        : ""
                                }`}
                                style={{
                                    background:
                                        item.preview,
                                }}
                            >

                                {colorTheme === item.name && (
                                    <span className="absolute inset-0 flex items-center justify-center">
                                        <Check
                                            size={22}
                                            className="text-white drop-shadow-lg"
                                        />
                                    </span>
                                )}

                            </button>

                        ))}

                    </div>

                    <div className="text-sm text-muted-foreground">
                        Current theme:{" "}
                        <span className="font-semibold text-foreground capitalize">
                            {colorTheme}
                        </span>
                    </div>

                </div>

            </PopoverContent>
        </Popover>
    );
};

export default ColorThemePicker;