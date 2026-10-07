'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useFeedbackForm, EXPERIENCE_SUGGESTION_TAGS } from '@/hooks/useFeedbackForm';
import {
  Star,
  Bug,
  Lightbulb,
  Palette,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Send,
  User,
  Mail,
  Sparkles,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { IFeedbackCategoryOption } from '@/types/feedback.types';

const CATEGORY_OPTIONS: IFeedbackCategoryOption[] = [
  {
    value: 'general',
    label: 'General',
    description: 'General thoughts or opinion',
    iconName: 'MessageSquare',
    badgeClass: 'hover:border-teal-400 data-[state=active]:border-teal-600 data-[state=active]:bg-teal-50',
  },
  {
    value: 'bug_report',
    label: 'Issue / Bug',
    description: 'Something broken or not working',
    iconName: 'Bug',
    badgeClass: 'hover:border-rose-400 data-[state=active]:border-rose-600 data-[state=active]:bg-rose-50',
  },
  {
    value: 'feature_request',
    label: 'Feature Idea',
    description: 'Suggest a tool or feature',
    iconName: 'Lightbulb',
    badgeClass: 'hover:border-purple-400 data-[state=active]:border-purple-600 data-[state=active]:bg-purple-50',
  },
  {
    value: 'ui_experience',
    label: 'UI & Design',
    description: 'Visual styling or layout',
    iconName: 'Palette',
    badgeClass: 'hover:border-sky-400 data-[state=active]:border-sky-600 data-[state=active]:bg-sky-50',
  },
];

export function FeedbackModal() {
  const {
    isFeedbackModalOpen,
    handleClose,
    isUserLoggedIn,
    rating,
    hoveredRating,
    setRating,
    setHoveredRating,
    category,
    setCategory,
    message,
    setMessage,
    userName,
    setUserName,
    userEmail,
    setUserEmail,
    selectedTags,
    handleToggleTag,
    isSubmitting,
    error,
    isSuccess,
    successMessage,
    activeRatingTier,
    handleSubmit,
  } = useFeedbackForm();

  return (
    <Dialog open={isFeedbackModalOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-[calc(100%-1.25rem)] sm:w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto overscroll-contain bg-white rounded-3xl p-0 border border-cyan-150 shadow-2xl my-auto flex flex-col gap-0 box-border">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-cyan-700 via-teal-700 to-cyan-800 p-5 sm:p-6 text-white relative rounded-t-3xl pr-12 sm:pr-14">
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-cyan-100 border border-white/25">
              <Sparkles className="h-3 w-3 text-cyan-200" />
              Community Voice
            </span>
          </div>

          <DialogHeader className="text-left space-y-1">
            <DialogTitle className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
              Share Your Thoughts & Feedback
            </DialogTitle>
            <DialogDescription className="text-xs text-cyan-100/90 leading-relaxed font-normal">
              Help us make NeverForgot even better. Report issues, suggest features, or rate your experience.
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Modal Body Container */}
        <div className="p-5 sm:p-6 flex-1 min-h-0 overflow-y-auto">
          {/* Success Screen */}
          {isSuccess ? (
            <div className="py-8 px-4 text-center space-y-5 animate-in fade-in zoom-in-95 duration-300">
              <div className="h-16 w-16 mx-auto rounded-3xl bg-teal-50 border-2 border-teal-200 text-teal-600 flex items-center justify-center shadow-md shadow-teal-500/10">
                <CheckCircle2 className="h-9 w-9 text-teal-600" />
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                  Feedback Received!
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {successMessage ||
                    'Thank you for helping us improve NeverForgot! A notification with your feedback has been sent directly to our team.'}
                </p>
              </div>

              <div className="pt-2 flex justify-center">
                <Button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl px-6 h-10 bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Close & Back to App
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Error Banner */}
              {error && (
                <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-800 border border-rose-200 flex items-start gap-2.5 text-xs">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0 text-rose-600" />
                  <p className="font-semibold leading-relaxed flex-1">{error}</p>
                </div>
              )}

              {/* 1. Interactive 5-Star Rating */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-2">
                <Label className="text-xs font-bold text-slate-700 block">
                  How would you rate your experience with NeverForgot?
                </Label>

                {/* Stars Row */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
                  {[1, 2, 3, 4, 5].map((starVal) => {
                    const isFilled = starVal <= (hoveredRating || rating);
                    return (
                      <button
                        key={starVal}
                        type="button"
                        onClick={() => setRating(starVal)}
                        onMouseEnter={() => setHoveredRating(starVal)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="p-1 rounded-lg transition-transform hover:scale-125 active:scale-95 cursor-pointer focus:outline-none"
                        aria-label={`Rate ${starVal} stars`}
                      >
                        <Star
                          className={`h-7 w-7 sm:h-8 sm:w-8 transition-colors ${
                            isFilled
                              ? 'text-amber-400 fill-amber-400 drop-shadow-xs'
                              : 'text-slate-300 stroke-1'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Active Tier Emotion Text */}
                <p className="text-xs font-bold text-slate-800 transition-all flex items-center justify-center gap-1.5">
                  <span>{activeRatingTier.emoji}</span>
                  <span className={activeRatingTier.colorClass}>
                    {activeRatingTier.label} ({hoveredRating || rating}/5)
                  </span>
                </p>
              </div>

              {/* 2. Feedback Category Selector */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700">
                  What is this feedback about?
                </Label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORY_OPTIONS.map((opt) => {
                    const isSelected = category === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setCategory(opt.value)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          isSelected
                            ? 'border-cyan-600 bg-cyan-50/70 shadow-xs ring-1 ring-cyan-500'
                            : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          {opt.value === 'bug_report' && (
                            <Bug
                              className={`h-3.5 w-3.5 ${
                                isSelected ? 'text-rose-600' : 'text-slate-500'
                              }`}
                            />
                          )}
                          {opt.value === 'feature_request' && (
                            <Lightbulb
                              className={`h-3.5 w-3.5 ${
                                isSelected ? 'text-purple-600' : 'text-slate-500'
                              }`}
                            />
                          )}
                          {opt.value === 'ui_experience' && (
                            <Palette
                              className={`h-3.5 w-3.5 ${
                                isSelected ? 'text-sky-600' : 'text-slate-500'
                              }`}
                            />
                          )}
                          {opt.value === 'general' && (
                            <MessageSquare
                              className={`h-3.5 w-3.5 ${
                                isSelected ? 'text-teal-600' : 'text-slate-500'
                              }`}
                            />
                          )}
                          <span
                            className={`text-xs font-bold truncate ${
                              isSelected ? 'text-cyan-900' : 'text-slate-700'
                            }`}
                          >
                            {opt.label}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 line-clamp-1">
                          {opt.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Quick Highlights Tags */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-slate-700">
                  Quick Highlights (Optional)
                </Label>
                <div className="flex flex-wrap gap-1.5">
                  {EXPERIENCE_SUGGESTION_TAGS.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={`text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all cursor-pointer border ${
                          isSelected
                            ? 'bg-cyan-600 text-white border-cyan-600 shadow-2xs'
                            : 'bg-slate-100 text-slate-600 border-slate-200/80 hover:bg-slate-200/70 hover:text-slate-800'
                        }`}
                      >
                        {isSelected ? '✓ ' : '+ '}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Feedback Detailed Message */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-700">
                    Your Feedback or Issue Details
                  </Label>
                  <span className="text-[10px] text-slate-400">
                    {message.length} chars
                  </span>
                </div>
                <Textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  placeholder={
                    category === 'bug_report'
                      ? 'Please describe what went wrong, which button you clicked, or the error message you saw...'
                      : category === 'feature_request'
                      ? 'What new feature or workflow would make NeverForgot more useful for you?'
                      : 'Tell us about your experience, what you like, or where we can improve...'
                  }
                  className="rounded-xl text-xs sm:text-sm resize-none focus:border-cyan-500 focus:ring-cyan-500"
                />
              </div>

              {/* 5. Contact Details (Locked for Logged In Users) */}
              {isUserLoggedIn ? (
                <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-cyan-200/80 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-cyan-100 text-cyan-800 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
                      <User className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-slate-800 truncate text-xs">{userName}</p>
                        <span title="Locked to active account">
                          <Lock className="h-3 w-3 text-slate-400 shrink-0" />
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate" title={userEmail}>
                        {userEmail}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-200">
                    <ShieldCheck className="h-3.5 w-3.5 text-cyan-600" />
                    Verified User
                  </span>
                </div>
              ) : (
                <div className="space-y-2 pt-1">
                  <p className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                    <span>Submitting as guest</span>
                    <span className="text-slate-400">• Sign in to link feedback to your vault</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">
                        Your Name <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="text"
                          required
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          placeholder="e.g. Krishna Patil"
                          className="pl-9 h-10 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs font-semibold text-slate-700">
                        Your Email <span className="text-rose-500">*</span>
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                        <Input
                          type="email"
                          required
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          placeholder="e.g. user@example.com"
                          className="pl-9 h-10 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit & Cancel Buttons */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-end gap-2.5">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleClose}
                    className="rounded-xl h-10 px-4 text-xs font-bold text-slate-600 hover:text-slate-800 cursor-pointer"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      !message.trim() ||
                      (!isUserLoggedIn && (!userName.trim() || !userEmail.trim()))
                    }
                    className="rounded-xl h-10 px-5 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-cyan-600/20 cursor-pointer flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit Feedback</span>
                        <Send className="h-3.5 w-3.5" />
                      </>
                    )}
                  </Button>
                </div>
                {!isUserLoggedIn && (!userName.trim() || !userEmail.trim()) && (
                  <p className="text-[10px] text-slate-400 text-right">
                    * Name and email are required to submit feedback
                  </p>
                )}
              </div>
            </form>

          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
