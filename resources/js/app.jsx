import '../css/app.css';
import './bootstrap';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
resolve: (name) => {
    // 1. Scan for all JSX files in the Modules directory
    const pages = import.meta.glob('./Modules/**/*.jsx', { eager: true });
    
    // 2. Look for the file
    let page = pages[`./Modules/${name}.jsx`];

    // 3. Fallback: If not found, try adding /Index (common for folder-based components)
    if (!page) {
        page = pages[`./Modules/${name}/Index.jsx`];
    }

    if (!page) {
        console.error(`❌ Inertia cannot find: ./Modules/${name}.jsx`);
        console.log("📂 Available paths in your project:", Object.keys(pages));
        throw new Error(`Page not found: ${name}`);
    }

    return page;
},
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
