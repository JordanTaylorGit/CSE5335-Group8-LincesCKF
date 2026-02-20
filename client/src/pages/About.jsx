import React from 'react';

export default function About() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <p className="font-accent text-silk-500 text-xs tracking-[0.4em] uppercase mb-4">About</p>
      <h1 className="font-display text-5xl md:text-6xl text-obsidian mb-8">Linces'CKF</h1>
      <div className="divider-silk mb-10" />
      <div className="space-y-6 font-body text-lg text-obsidian/70 leading-relaxed">
        <p>
          Linces'CKF is a premium silk garment brand dedicated to the art of fine textile craftsmanship.
          Founded on the belief that luxury should be accessible without sacrificing quality, we offer
          an exclusive collection of silk blouses, dresses, shirts, and scarves.
        </p>
        <p>
          Beyond direct-to-consumer sales, we operate a professional B2B manufacturing division,
          providing confection services to fashion brands seeking quality and precision in their
          silk garment production.
        </p>
        <p>
          Every piece is crafted with meticulous attention to detail — from sourcing the world's
          finest silk to the final stitch.
        </p>
      </div>
    </div>
  );
}
