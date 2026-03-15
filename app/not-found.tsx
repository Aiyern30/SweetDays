import Link from "next/link";
import { HeartOff, Home, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for has slipped away.",
};

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-700">
      <div className="relative mb-8">
        {/* Background glow circle */}
        <div className="absolute inset-0 bg-rose-200 dark:bg-rose-900/30 blur-3xl rounded-full scale-150 transform -z-10" />

        <div className="w-32 h-32 md:w-40 md:h-40 bg-rose-50/80 dark:bg-zinc-900/80 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/50 dark:border-zinc-800/50 shadow-2xl relative overflow-hidden">
          {/* Subtle heartbeat animation for the icon */}
          <HeartOff className="w-16 h-16 md:w-20 md:h-20 text-rose-500 dark:text-rose-400 drop-shadow-md" />
        </div>

        {/* Floating decorative mini hearts */}
        <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 opacity-50">
          <HeartOff className="w-6 h-6 text-rose-300" />
        </div>
        <div className="absolute bottom-4 left-0 translate-y-4 -translate-x-8 opacity-30 transform -rotate-12">
          <HeartOff className="w-4 h-4 text-rose-400" />
        </div>
      </div>

      <div className="space-y-4 max-w-md mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Oops! <span className="text-rose-500">404</span>
        </h1>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Looks like we lost connection
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed">
          The page you are looking for might have moved, been deleted, or
          something went wrong. But don't worry, love always finds a way back!
        </p>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-sm">
        <Link
          href="/"
          className="w-full px-8 py-3.5 bg-linear-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl hover:shadow-rose-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          Go to Home
        </Link>
      </div>
    </div>
  );
}
