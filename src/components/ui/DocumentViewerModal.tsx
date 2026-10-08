'use client';

import * as React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  ExternalLink,
  Download,
  FileText,
  Eye,
  Maximize2,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface DocumentViewerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentUrl?: string | null;
  documentName?: string | null;
  title?: string;
  subtitle?: string;
}

interface DocumentViewerBodyProps {
  documentUrl: string;
  documentName?: string | null;
  title: string;
  subtitle: string;
}

function DocumentViewerBody({
  documentUrl,
  documentName,
  title,
  subtitle,
}: DocumentViewerBodyProps) {
  const [zoom, setZoom] = React.useState<number>(100);
  const [rotation, setRotation] = React.useState<number>(0);

  const urlLower = documentUrl.toLowerCase();
  const nameLower = (documentName || '').toLowerCase();

  const isPdf =
    urlLower.startsWith('data:application/pdf') ||
    urlLower.includes('.pdf') ||
    nameLower.endsWith('.pdf');

  const isImage =
    !isPdf &&
    (urlLower.startsWith('data:image') ||
      urlLower.includes('/image/upload/') ||
      urlLower.endsWith('.jpg') ||
      urlLower.endsWith('.jpeg') ||
      urlLower.endsWith('.png') ||
      urlLower.endsWith('.webp') ||
      nameLower.endsWith('.jpg') ||
      nameLower.endsWith('.jpeg') ||
      nameLower.endsWith('.png') ||
      nameLower.endsWith('.webp'));

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

  return (
    <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[92vh] flex flex-col p-4 sm:p-6 bg-white border-border shadow-2xl rounded-3xl overflow-hidden">
      <DialogHeader className="space-y-1 text-left pb-2 border-b border-slate-100 shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pr-8 sm:pr-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="h-9 w-9 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200 flex items-center justify-center shrink-0">
                <Eye className="h-4.5 w-4.5" />
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 truncate">
                  {title}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 truncate">
                  {documentName || subtitle}
                </DialogDescription>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0">
              <Badge
                variant={isPdf ? 'secondary' : 'cyan'}
                className="text-[11px] font-bold px-2.5 py-0.5 uppercase tracking-wider"
              >
                {isPdf ? 'PDF Document' : 'Receipt Photo'}
              </Badge>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 px-2.5 text-xs font-semibold rounded-lg cursor-pointer text-slate-700 hover:text-cyan-700"
              >
                <a
                  href={documentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={documentName || 'document'}
                >
                  <Download className="h-3.5 w-3.5 mr-1" />
                  <span className="hidden sm:inline">Download</span>
                </a>
              </Button>
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg text-slate-600 hover:text-cyan-700 cursor-pointer"
                title="Open in new window"
              >
                <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Toolbar controls for images */}
        {isImage && (
          <div className="flex items-center justify-between gap-2 py-2 px-1 text-xs text-slate-600 border-b border-slate-100 shrink-0">
            <span className="font-medium text-slate-500">
              Zoom: <strong className="text-slate-800">{zoom}%</strong>
            </span>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="h-7 w-7 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                disabled={zoom >= 250}
                className="h-7 w-7 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRotate}
                className="h-7 w-7 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
                title="Rotate 90 degrees"
              >
                <RotateCw className="h-3.5 w-3.5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetZoom}
                className="h-7 px-2 text-[11px] rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer font-medium"
                title="Reset View"
              >
                <Maximize2 className="h-3 w-3 mr-1" />
                Fit
              </Button>
            </div>
          </div>
        )}

        {/* Viewer Content Frame */}
        <div className="flex-1 w-full min-h-[300px] max-h-[64vh] overflow-auto bg-slate-900/5 rounded-2xl border border-slate-200/80 flex items-center justify-center p-2 sm:p-4 my-2 relative">
          {isImage ? (
            <div
              className="transition-transform duration-150 ease-out flex items-center justify-center w-full h-full"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={documentUrl}
                alt={documentName || 'Scanned Document'}
                className="max-h-[56vh] max-w-full object-contain rounded-xl shadow-md border border-slate-200/60 bg-white"
              />
            </div>
          ) : isPdf ? (
            <div className="w-full h-[56vh] flex flex-col rounded-xl overflow-hidden bg-white shadow-inner">
              <iframe
                src={`${documentUrl}#toolbar=0`}
                title={documentName || 'PDF Document Viewer'}
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="h-14 w-14 rounded-2xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-cyan-700">
                <FileText className="h-7 w-7" />
              </div>
              <div>
                <p className="font-bold text-slate-800 text-sm">{documentName}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Attachment ready for preview and verification
                </p>
              </div>
              <Button
                asChild
                variant="default"
                size="sm"
                className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl shadow-xs"
              >
                <a href={documentUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Open Document File
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
  );
}

export function DocumentViewerModal({
  open,
  onOpenChange,
  documentUrl,
  documentName,
  title = 'Document Preview',
  subtitle = 'Verify the attached bill or receipt details',
}: DocumentViewerModalProps) {
  if (!open || !documentUrl) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DocumentViewerBody
        key={documentUrl}
        documentUrl={documentUrl}
        documentName={documentName}
        title={title}
        subtitle={subtitle}
      />
    </Dialog>
  );
}
