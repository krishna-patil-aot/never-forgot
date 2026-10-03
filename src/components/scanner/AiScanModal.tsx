'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud,
  FileText,
  Sparkles,
  Camera,
  AlertCircle,
  ScanLine,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useInvoiceScanner } from '@/hooks/useInvoiceScanner';

export function AiScanModal() {
  const {
    scanStatus,
    scanPayload,
    scanProgressText,
    isScanModalOpen,
    errorMessage,
    setIsScanModalOpen,
    processFile,
    resetScan,
  } = useInvoiceScanner();

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = React.useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const isScanning = scanStatus === 'uploading' || scanStatus === 'scanning';

  return (
    <Dialog
      open={isScanModalOpen}
      onOpenChange={(open) => {
        if (!isScanning) {
          setIsScanModalOpen(open);
          if (!open) resetScan();
        }
      }}
    >
      <DialogContent className="sm:max-w-lg bg-white border-border shadow-2xl max-h-[88vh] sm:max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-xs shrink-0 mt-0.5">
              <ScanLine className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-base sm:text-lg font-bold leading-snug break-words">
                AI Invoice & Policy Scanner
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5 leading-normal">
                Paste or upload any purchase invoice, warranty card, or insurance policy.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Error message if any */}
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Scanning State with Framer Motion Laser Effect */}
        <AnimatePresence mode="wait">
          {isScanning ? (
            <motion.div
              key="scanning-state"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="relative my-4 p-8 rounded-2xl border border-blue-200 bg-gradient-to-b from-blue-50/80 via-white to-slate-50 flex flex-col items-center justify-center min-h-[260px] overflow-hidden shadow-inner"
            >
              {/* Animated Laser Scanning Beam */}
              <motion.div
                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent shadow-[0_0_12px_#3b82f6] z-20"
                animate={{ top: ['5%', '90%', '5%'] }}
                transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
              />

              {/* Document Icon Placeholder in Scanning Mode */}
              <div className="relative z-10 flex flex-col items-center space-y-4">
                <div className="h-16 w-16 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center shadow-xs">
                  <FileText className="h-8 w-8 text-primary animate-pulse" />
                </div>

                <div className="text-center space-y-1">
                  <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-foreground">
                    <Sparkles className="h-4 w-4 text-blue-600 animate-spin" />
                    <span>Multimodal Vision OCR</span>
                  </div>
                  <p className="text-xs text-blue-700 font-semibold animate-pulse">
                    {scanProgressText || 'Extracting invoice data...'}
                  </p>
                  <p className="text-[11px] text-muted-foreground pt-1">
                    {scanPayload?.fileName} ({(Number(scanPayload?.fileSize || 0) / 1024).toFixed(0)} KB)
                  </p>
                </div>
              </div>
            </motion.div>
          ) : (
            /* Upload / Dropzone State */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`my-3 p-4 sm:p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer flex flex-col items-center justify-center text-center space-y-3 ${
                isDragOver
                  ? 'border-primary bg-blue-50/60 scale-[1.01]'
                  : 'border-slate-300 hover:border-primary/60 bg-slate-50/70 hover:bg-blue-50/30'
              }`}
            >
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-xs">
                <UploadCloud className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
              </div>

              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-semibold text-foreground">
                  Drag & drop invoice here, or <span className="text-primary underline">browse</span>
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground">
                  Supports JPG, PNG, WebP, and PDF up to 10MB
                </p>
              </div>

              {/* Keyboard Paste Pro Tip */}
              <div className="pt-1 flex items-center justify-center">
                <Badge variant="outline" className="text-[10px] py-1 px-2.5 bg-white text-slate-600 border-slate-200 whitespace-normal text-center leading-tight">
                  Tip: Press <kbd className="font-mono font-bold text-foreground">Ctrl + V</kbd> anywhere to paste screenshot
                </Badge>
              </div>
            </div>
          )}
        </AnimatePresence>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsScanModalOpen(false)}
            disabled={isScanning}
            className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            className="w-full sm:w-auto h-10 sm:h-9 text-xs sm:text-sm font-semibold cursor-pointer flex items-center justify-center gap-1.5"
            onClick={() => fileInputRef.current?.click()}
            disabled={isScanning}
          >
            <Camera className="h-3.5 w-3.5 text-white" />
            <span>Select File / Camera</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
