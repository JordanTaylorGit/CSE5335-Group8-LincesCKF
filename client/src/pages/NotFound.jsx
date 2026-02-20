import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-accent text-silk-400 text-xs tracking-[0.4em] uppercase mb-4">404</p>
      <h1 className="font-display text-6xl md:text-8xl text-obsidian mb-6">Not Found</h1>
      <p className="font-body text-obsidian/50 mb-10">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </div>
  );
}
