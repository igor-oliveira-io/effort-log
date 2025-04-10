"use client";

export default function Footer() {
  return (
    <footer className="w-full border-t mt-8 py-4 text-center text-sm text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">
      <p>
        Made with ☕️ by <span className="font-semibold">Morphio Project</span> • {new Date().getFullYear()}
      </p>
    </footer>
  );
}
