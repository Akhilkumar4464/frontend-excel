# TODO: Optimize Vite Build Chunk Sizes

- [x] Refactor src/App.jsx to use React.lazy and Suspense for dynamic imports of page components (Login, Register, Dashboard, Home, AdminDashboard, SuperAdminDashboard, UserFiles)
- [x] Update vite.config.js to add build.rollupOptions.output.manualChunks configuration for vendor and common chunks
- [x] Optionally adjust build.chunkSizeWarningLimit in vite.config.js
- [x] Test the build to verify chunk sizes are reduced
