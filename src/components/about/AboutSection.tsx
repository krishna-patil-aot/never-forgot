'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  ExternalLink,
  Code2,
  Lock,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/ui/AppLogo';
import { useAppMetadata } from '@/hooks/useAppMetadata';

export function AboutSection() {
  const { metadata, isExpanded, toggleExpanded } = useAppMetadata();

  return (
    <section id="about-app-section" className="pt-4 sm:pt-6 pb-2 scroll-mt-24">
      {/* Sleek Toggle Button */}
      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleExpanded}
          className={`h-10 px-4 rounded-full text-xs font-semibold border transition-all duration-200 cursor-pointer shadow-2xs ${
            isExpanded
              ? 'bg-cyan-50 text-cyan-800 border-cyan-200 hover:bg-cyan-100 hover:text-cyan-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
          }`}
          aria-expanded={isExpanded}
          aria-controls="about-app-details"
        >
          <Info className="h-4 w-4 mr-2 text-cyan-600 shrink-0" />
          <span>{isExpanded ? 'Hide Application Details' : 'About Application & Creator'}</span>
          <Badge
            variant="cyan"
            className="ml-2 text-[10px] font-bold px-1.5 py-0 rounded-md bg-cyan-100 text-cyan-800 border-cyan-200"
          >
            {metadata.version}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 ml-2 text-cyan-600 shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 ml-2 text-slate-400 shrink-0" />
          )}
        </Button>
      </div>

      {/* Collapsible Details Card */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id="about-app-details"
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden mt-4"
          >
            <Card className="border border-slate-200/90 bg-gradient-to-br from-white via-slate-50/70 to-cyan-50/30 shadow-sm rounded-2xl">
              <CardContent className="p-4 sm:p-6 md:p-8 space-y-6">
                {/* Top Row: App Title, Badges & Version */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200/70">
                  <div className="flex items-center space-x-3.5">
                    <AppLogo size={48} className="rounded-2xl shadow-md shadow-cyan-600/25" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                          {metadata.title}
                        </h3>
                        <Badge variant="cyan" className="text-[11px] font-bold px-2 py-0.5 bg-cyan-100 text-cyan-800 border-cyan-200">
                          {metadata.version}
                        </Badge>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-cyan-50 text-cyan-800 border border-cyan-200">
                          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                          Simple Vault
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">
                        Never lose track of your bills & warranty dates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-medium text-slate-600 bg-white border border-slate-200/90 shadow-2xs">
                      <Info className="h-3.5 w-3.5 text-cyan-600" />
                      Application Details
                    </span>
                  </div>
                </div>

                {/* Short Description */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    What It Does
                  </h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                    {metadata.shortDescription}
                  </p>
                </div>

                {/* Feature Highlights Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800">Smart Document Scanner</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Reads your bills and receipts automatically so you do not have to type.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800">Friendly Reminders</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Notifies you 30 days and 7 days before warranties or services expire.
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="text-xs font-bold text-slate-800">Private & Safe</h5>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        Your bills belong to you and are safely backed up to your account.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Owner & Creator Details Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center space-x-3.5 min-w-0">
                    <div className="h-11 w-11 rounded-2xl bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center text-sm font-bold text-white shadow-2xs ring-2 ring-slate-100 shrink-0">
                      KP
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Creator & Developer
                      </span>
                      <h4 className="text-base font-bold text-slate-900 truncate">
                        {metadata.owner.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {metadata.owner.role}
                      </p>
                    </div>
                  </div>

                  {/* LinkedIn Hyperlink Button */}
                  <div className="flex items-center gap-2.5 shrink-0">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="h-10 px-4 rounded-xl border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100/70 text-cyan-800 hover:text-cyan-900 font-semibold shadow-2xs transition-all cursor-pointer group"
                    >
                      <a
                        href={metadata.owner.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                        id="owner-linkedin-link"
                      >
                        <svg
                          className="h-4 w-4 fill-current text-cyan-700 group-hover:scale-110 transition-transform shrink-0"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.2a1.64 1.64 0 1 0 0 3.28 1.64 1.64 0 0 0 0-3.28z" />
                        </svg>
                        <span>Connect on LinkedIn</span>
                        <ExternalLink className="h-3.5 w-3.5 text-cyan-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Footer Subtext */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-slate-400 font-medium border-t border-slate-100">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>Built with Next.js, React Hook Form, TypeScript & Tailwind CSS</span>
                  </div>
                  <div>
                    <span>© {metadata.releaseYear} {metadata.title}. All rights reserved.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
