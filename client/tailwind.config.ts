import type { Config } from 'tailwindcss';
import { createThemes } from 'tw-colors';
import colors from 'tailwindcss/colors';

const baseColors = [
    'gray',
    'red',
    'yellow',
    'green',
    'blue',
    'indigo',
    'purple',
    'pink',
];

const shadeMapping = {
    "50": 900,
    "100": 800,
    "200": 700,
    "300": 600,
    "400": 500,
    "500": 400,
    "600": 300,
    "700": 200,
    "800": 100,
    "900": 50,
}

const generateThemeObject = (colors: any, mapping: any, invert = false) => {
    const theme: any = {};
    baseColors.forEach((color) => {
        theme[color] = {};
        Object.entries(mapping).forEach(([key, value]: any) => {
            const shadeKey = invert ? value : key;
            theme[color][shadeKey] = colors[color][shadeKey];
        });
    });
    return theme;
}

const lightTheme = createThemes(generateThemeObject(colors, shadeMapping));
const darkTheme = createThemes(generateThemeObject(colors, shadeMapping, true));    

const themes = {
    light: {
        ...lightTheme,
        white: '#fff',
    },
    dark: {
        ...darkTheme,
        white: colors.gray["950"],
        black: colors.gray["50"],
    }
}

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // You can add custom colors here
      },
      fontFamily: {
        // You can add custom fonts here
      },
    },
  },
  plugins: [createThemes(themes)],
}

export default config
