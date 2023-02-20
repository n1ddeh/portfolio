import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePluginFonts, VitePluginFontsOptions } from 'vite-plugin-fonts'
import checker from 'vite-plugin-checker'

const viteFontOptions: VitePluginFontsOptions = {
    custom: {
        families: [
            {
                name: 'Meslo',
                local: 'Meslo',
                src: './src/assets/fonts/Meslo.ttf',
            },
        ],
    },
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        VitePluginFonts(viteFontOptions),
        checker({
            typescript: true,
            eslint: { lintCommand: 'eslint "./src/**/*.{ts,tsx}"' },
            overlay: {
                initialIsOpen: false,
            },
        }),
    ],
})
