import React from 'react';
import { Trees } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[var(--terra-border)] bg-[var(--terra-bg)] mt-auto py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 text-xs font-mono text-[var(--terra-ink-tertiary)]">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[var(--terra-accent)] text-white flex items-center justify-center">
              <Trees className="w-3.5 h-3.5" />
            </div>
            <span className="font-display font-bold text-sm text-[var(--terra-ink)]">
              TouchGrass
            </span>
            <span className="text-[var(--terra-border-strong)]">/</span>
            <span>Hacktoberfest 2026 Week 1 Prototype</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Exclusively Powered by Gemma 4</span>
            <span className="text-[var(--terra-border-strong)]">/</span>
            <span>Zero Remote Databases</span>
            <span className="text-[var(--terra-border-strong)]">/</span>
            <span>Local Timestamps</span>
          </div>
        </div>

        <p className="text-[11px] font-mono text-[var(--terra-ink-tertiary)] leading-relaxed border-t border-[var(--terra-border)] pt-6">
          Created for Hacktoberfest 2026 Week 1 ("Touch Grass"). This prototype demonstrates how open-weight AI models can be deployed to facilitate real-world human habits rather than driving passive digital screen consumption.
        </p>
      </div>
    </footer>
  );
};
