"use client";

import Link from "next/link";
import Script from "next/script";
import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { z } from "zod";
import {
  submitBulkRegistration,
  type BulkRegisterState,
} from "@/app/actions/bulk-register";
import { registrationCategories } from "@/lib/validations";

const initialSubmitState: BulkRegisterState = { success: false };

// Public Turnstile site key. When unset, the CAPTCHA is disabled and the form
// behaves as before (server-side verification no-ops outside production).
const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (
    el: HTMLElement,
    options: {
      sitekey: string;
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
      "error-callback"?: () => void;
      "response-field"?: boolean;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const MAX_UPLOAD_SIZE_BYTES = 500 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
const ALLOWED_DOCUMENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;

type UploadType = "ieee_card" | "payment_screenshot";

type LeaderPersonalState = {
  fullName: string;
  email: string;
  phone: string;
  affiliation: string;
};

type LeaderMembershipState = {
  category: string;
  referralCode: string;
  isMember: boolean;
  ieeeId: string;
  studentBranchCode: string;
  ieeeCardS3Key: string;
};

type TeamMemberState = {
  fullName: string;
  email: string;
  phone: string;
  category: string;
  isMember: boolean;
  ieeeId: string;
  studentBranchCode: string;
  ieeeCardS3Key: string;
  ieeeCardFileName: string;
};

const categoryLabels: Record<(typeof registrationCategories)[number], string> =
  {
    student_member: "Student Member",
    graduate_student_member: "Graduate Student Member",
    professional_member: "Professional Member",
    faculty_member: "Faculty Member",
  };

const EMPTY_MEMBER: TeamMemberState = {
  fullName: "",
  email: "",
  phone: "",
  category: "",
  isMember: false,
  ieeeId: "",
  studentBranchCode: "",
  ieeeCardS3Key: "",
  ieeeCardFileName: "",
};

function mapZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >;
  const mapped: Record<string, string> = {};

  for (const [field, values] of Object.entries(fieldErrors)) {
    if (values && values.length > 0) {
      mapped[field] = values[0] as string;
    }
  }

  return mapped;
}

function formatFileError(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return "Upload failed. Please try again.";
}

function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 | 4 }) {
  const steps = ["Leader Info", "Membership", "Team Members", "Payment"];

  return (
    <div className="mb-10 flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3 | 4;
        const isActive = stepNumber === currentStep;
        const isComplete = stepNumber < currentStep;

        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  isComplete
                    ? "bg-green-500 text-white"
                    : isActive
                      ? "bg-[#7B1F34] text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {isComplete ? (
                  <span className="material-symbols-outlined text-base">
                    check
                  </span>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`hidden text-sm font-medium lg:inline ${
                  isActive
                    ? "text-[#7B1F34]"
                    : isComplete
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-6 sm:w-10 ${
                  isComplete ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function BulkRegisterPage() {
  const [submitState, submitAction, isSubmitting] = useActionState(
    submitBulkRegistration,
    initialSubmitState,
  );
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Navigate to the correct step when server-side validation errors come back
  useEffect(() => {
    if (submitState.errors) {
      const step1Fields = ["leaderFullName", "leaderEmail", "leaderPhone", "leaderAffiliation"];
      const step2Fields = [
        "leaderCategory",
        "leaderReferralCode",
        "leaderIsMember",
        "leaderIeeeId",
        "leaderStudentBranchCode",
        "leaderIeeeCardS3Key",
      ];
      const step3Fields = ["members"];
      const keys = Object.keys(submitState.errors);
      if (keys.some((key) => step1Fields.includes(key))) {
        setStep(1);
      } else if (keys.some((key) => step2Fields.includes(key))) {
        setStep(2);
      } else if (keys.some((key) => step3Fields.includes(key))) {
        setStep(3);
      }
    }
  }, [submitState.errors]);

  // Leader state
  const [leaderPersonal, setLeaderPersonal] = useState<LeaderPersonalState>({
    fullName: "",
    email: "",
    phone: "",
    affiliation: "",
  });

  const [leaderMembership, setLeaderMembership] =
    useState<LeaderMembershipState>({
      category: "",
      referralCode: "",
      isMember: false,
      ieeeId: "",
      studentBranchCode: "",
      ieeeCardS3Key: "",
    });

  const [leaderIeeeCardFileName, setLeaderIeeeCardFileName] = useState("");

  // Team members
  const [members, setMembers] = useState<TeamMemberState[]>([
    { ...EMPTY_MEMBER },
    { ...EMPTY_MEMBER },
  ]);

  // Expanded member accordion
  const [expandedMember, setExpandedMember] = useState<number>(0);

  // Payment
  const [paymentScreenshotS3Key, setPaymentScreenshotS3Key] = useState("");
  const [paymentFileName, setPaymentFileName] = useState("");

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [memberFieldErrors, setMemberFieldErrors] = useState<
    Record<number, Record<string, string>>
  >({});
  const [uploading, setUploading] = useState({
    leaderIeeeCard: false,
    payment: false,
    memberIeeeCard: -1, // index of member currently uploading, -1 if none
  });

  // Turnstile CAPTCHA state
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Render / clean up the Turnstile widget when the user reaches the payment step.
  useEffect(() => {
    if (!TURNSTILE_SITE_KEY) return;
    if (step !== 4 || !turnstileReady || !window.turnstile) return;
    const container = turnstileRef.current;
    if (!container || widgetIdRef.current !== null) return;

    widgetIdRef.current = window.turnstile.render(container, {
      sitekey: TURNSTILE_SITE_KEY,
      "response-field": false, // token is submitted via our own hidden input
      callback: (token: string) => {
        setTurnstileToken(token);
        clearFieldError("captcha");
      },
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });

    return () => {
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      setTurnstileToken("");
    };
  }, [step, turnstileReady]);

  const serverErrors = useMemo(() => {
    const mapped: Record<string, string> = {};
    const submitErrors =
      (submitState.errors as
        | Record<string, string[] | undefined>
        | undefined) || {};
    for (const [field, values] of Object.entries(submitErrors)) {
      if (values && values.length > 0) {
        mapped[field] = values[0] as string;
      }
    }
    return mapped;
  }, [submitState.errors]);

  const errors = { ...serverErrors, ...fieldErrors };

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function clearMemberFieldError(index: number, field: string) {
    setMemberFieldErrors((prev) => {
      if (!prev[index]?.[field]) return prev;
      const next = { ...prev };
      const memberErrors = { ...next[index] };
      delete memberErrors[field];
      next[index] = memberErrors;
      return next;
    });
  }

  // ── File upload (reuses same /api/upload endpoint) ──
  async function uploadFile(
    file: File,
    uploadType: UploadType,
  ): Promise<string> {
    const allowedTypes =
      uploadType === "ieee_card" ? ALLOWED_DOCUMENT_TYPES : ALLOWED_IMAGE_TYPES;
    if (!(allowedTypes as readonly string[]).includes(file.type)) {
      const msg =
        uploadType === "ieee_card"
          ? "Only JPG, PNG, WEBP images and PDF files are allowed."
          : "Only JPG, PNG, and WEBP images are allowed.";
      throw new Error(msg);
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      throw new Error("File must be 500KB or smaller.");
    }

    const urlResponse = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        fileType: file.type,
        uploadType,
        fileSize: file.size,
      }),
    });

    const urlPayload = (await urlResponse.json().catch(() => null)) as {
      uploadUrl?: string;
      s3Key?: string;
      error?: string;
    } | null;

    if (!urlResponse.ok || !urlPayload?.uploadUrl || !urlPayload?.s3Key) {
      throw new Error(urlPayload?.error || "Failed to get upload URL.");
    }

    const uploadResponse = await fetch(urlPayload.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file to storage.");
    }

    return urlPayload.s3Key;
  }

  // ── Leader IEEE card upload ──
  async function handleLeaderIeeeCardUpload(file: File | null) {
    if (!file) {
      setLeaderIeeeCardFileName("");
      setLeaderMembership((prev) => ({ ...prev, ieeeCardS3Key: "" }));
      clearFieldError("leaderIeeeCardS3Key");
      return;
    }
    setUploading((prev) => ({ ...prev, leaderIeeeCard: true }));
    try {
      const s3Key = await uploadFile(file, "ieee_card");
      setLeaderMembership((prev) => ({ ...prev, ieeeCardS3Key: s3Key }));
      setLeaderIeeeCardFileName(file.name);
      clearFieldError("leaderIeeeCardS3Key");
    } catch (error) {
      setFieldErrors((prev) => ({
        ...prev,
        leaderIeeeCardS3Key: formatFileError(error),
      }));
      setLeaderMembership((prev) => ({ ...prev, ieeeCardS3Key: "" }));
    } finally {
      setUploading((prev) => ({ ...prev, leaderIeeeCard: false }));
    }
  }

  // ── Member IEEE card upload ──
  async function handleMemberIeeeCardUpload(
    memberIndex: number,
    file: File | null,
  ) {
    if (!file) {
      setMembers((prev) => {
        const next = [...prev];
        next[memberIndex] = {
          ...next[memberIndex],
          ieeeCardS3Key: "",
          ieeeCardFileName: "",
        };
        return next;
      });
      clearMemberFieldError(memberIndex, "ieeeCardS3Key");
      return;
    }
    setUploading((prev) => ({ ...prev, memberIeeeCard: memberIndex }));
    try {
      const s3Key = await uploadFile(file, "ieee_card");
      setMembers((prev) => {
        const next = [...prev];
        next[memberIndex] = {
          ...next[memberIndex],
          ieeeCardS3Key: s3Key,
          ieeeCardFileName: file.name,
        };
        return next;
      });
      clearMemberFieldError(memberIndex, "ieeeCardS3Key");
    } catch (error) {
      setMemberFieldErrors((prev) => ({
        ...prev,
        [memberIndex]: {
          ...(prev[memberIndex] || {}),
          ieeeCardS3Key: formatFileError(error),
        },
      }));
      setMembers((prev) => {
        const next = [...prev];
        next[memberIndex] = {
          ...next[memberIndex],
          ieeeCardS3Key: "",
          ieeeCardFileName: "",
        };
        return next;
      });
    } finally {
      setUploading((prev) => ({ ...prev, memberIeeeCard: -1 }));
    }
  }

  // ── Payment upload ──
  async function handlePaymentUpload(file: File | null) {
    if (!file) {
      setPaymentFileName("");
      setPaymentScreenshotS3Key("");
      clearFieldError("paymentScreenshotS3Key");
      return;
    }
    setUploading((prev) => ({ ...prev, payment: true }));
    try {
      const s3Key = await uploadFile(file, "payment_screenshot");
      setPaymentScreenshotS3Key(s3Key);
      setPaymentFileName(file.name);
      clearFieldError("paymentScreenshotS3Key");
    } catch (error) {
      setFieldErrors((prev) => ({
        ...prev,
        paymentScreenshotS3Key: formatFileError(error),
      }));
      setPaymentScreenshotS3Key("");
    } finally {
      setUploading((prev) => ({ ...prev, payment: false }));
    }
  }

  // ── Step navigation ──
  function goToStep2() {
    const leaderStep1 = {
      fullName: leaderPersonal.fullName,
      email: leaderPersonal.email,
      phone: leaderPersonal.phone,
      affiliation: leaderPersonal.affiliation,
    };

    const result = z
      .object({
        fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
        email: z.string().email("Please enter a valid email address"),
        phone: z.string().min(10, "Phone number must be at least 10 digits").max(15),
        affiliation: z.string().min(2, "Affiliation must be at least 2 characters").max(200),
      })
      .safeParse(leaderStep1);

    if (!result.success) {
      setFieldErrors(mapZodErrors(result.error));
      return;
    }
    setFieldErrors({});
    setStep(2);
  }

  function goToStep3() {
    const leaderStep2 = {
      category: leaderMembership.category,
      referralCode: leaderMembership.referralCode,
      isMember: leaderMembership.isMember,
      ieeeId: leaderMembership.ieeeId,
      studentBranchCode: leaderMembership.studentBranchCode,
      ieeeCardS3Key: leaderMembership.ieeeCardS3Key,
    };

    const schema = z
      .object({
        category: z.enum(registrationCategories, {
          message: "Please select a valid category",
        }),
        referralCode: z.string().max(50).optional().or(z.literal("")),
        isMember: z.boolean().default(false),
        ieeeId: z.string().max(20).optional().or(z.literal("")),
        studentBranchCode: z.string().max(50).optional().or(z.literal("")),
        ieeeCardS3Key: z.string().optional().or(z.literal("")),
      })
      .superRefine((data, ctx) => {
        if (data.isMember) {
          if (!data.ieeeId || data.ieeeId.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "IEEE Membership ID is required for IEEE members",
              path: ["ieeeId"],
            });
          }
          if (!data.ieeeCardS3Key || data.ieeeCardS3Key.trim() === "") {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "IEEE card upload is required for IEEE members",
              path: ["ieeeCardS3Key"],
            });
          }
        }
      });

    const result = schema.safeParse(leaderStep2);
    if (!result.success) {
      const mapped = mapZodErrors(result.error);
      // Prefix with "leader" for unique field names
      const prefixed: Record<string, string> = {};
      for (const [k, v] of Object.entries(mapped)) {
        prefixed[`leader${k.charAt(0).toUpperCase()}${k.slice(1)}`] = v;
      }
      setFieldErrors(prefixed);
      return;
    }
    setFieldErrors({});
    setStep(3);
  }

  function goToStep4() {
    // Validate all members
    const newMemberErrors: Record<number, Record<string, string>> = {};
    let hasErrors = false;

    if (members.length < 10) {
      setFieldErrors({ members: "At least 10 team members are required" });
      return;
    }

    if (members.length > 25) {
      setFieldErrors({ members: "Maximum 25 team members allowed" });
      return;
    }

    for (let i = 0; i < members.length; i++) {
      const m = members[i];
      const errs: Record<string, string> = {};

      if (!m.fullName || m.fullName.trim().length < 2) errs.fullName = "Full name is required";
      if (!m.email || !z.string().email().safeParse(m.email).success) errs.email = "Valid email is required";
      if (!m.phone || m.phone.trim().length < 10) errs.phone = "Phone number is required";
      if (!m.category) errs.category = "Category is required";
      if (m.isMember) {
        if (!m.ieeeId || m.ieeeId.trim() === "") errs.ieeeId = "IEEE ID is required for members";
        if (!m.ieeeCardS3Key || m.ieeeCardS3Key.trim() === "") errs.ieeeCardS3Key = "IEEE card upload is required";
      }

      if (Object.keys(errs).length > 0) {
        newMemberErrors[i] = errs;
        hasErrors = true;
      }
    }

    if (hasErrors) {
      setMemberFieldErrors(newMemberErrors);
      // Expand the first member with errors
      const firstErrIndex = Object.keys(newMemberErrors)[0];
      if (firstErrIndex !== undefined) {
        setExpandedMember(Number(firstErrIndex));
      }
      return;
    }

    setMemberFieldErrors({});
    setFieldErrors({});
    setStep(4);
  }

  function handleFinalSubmit(event: React.FormEvent<HTMLFormElement>) {
    const isUploadInProgress =
      uploading.leaderIeeeCard ||
      uploading.payment ||
      uploading.memberIeeeCard >= 0;

    if (isUploadInProgress) {
      event.preventDefault();
      setFieldErrors({
        paymentScreenshotS3Key:
          "Please wait for all file uploads to finish before submitting.",
      });
      return;
    }

    if (!paymentScreenshotS3Key) {
      event.preventDefault();
      setFieldErrors({
        paymentScreenshotS3Key: "Payment screenshot is required.",
      });
      return;
    }

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      event.preventDefault();
      setFieldErrors({
        captcha: "Please complete the CAPTCHA challenge before submitting.",
      });
      return;
    }

    setFieldErrors({});
  }

  // ── Helpers ──
  function addMember() {
    if (members.length >= 25) return;
    setMembers((prev) => [...prev, { ...EMPTY_MEMBER }]);
    setExpandedMember(members.length);
  }

  function removeMember(index: number) {
    if (members.length <= 10) return;
    setMembers((prev) => prev.filter((_, i) => i !== index));
    setMemberFieldErrors((prev) => {
      const next: Record<number, Record<string, string>> = {};
      for (const [key, val] of Object.entries(prev)) {
        const k = Number(key);
        if (k < index) next[k] = val;
        else if (k > index) next[k - 1] = val;
      }
      return next;
    });
    if (expandedMember >= members.length - 1) {
      setExpandedMember(Math.max(0, members.length - 2));
    }
  }

  function updateMember(
    index: number,
    field: keyof TeamMemberState,
    value: string | boolean,
  ) {
    setMembers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };

      // Clear IEEE fields if unchecking isMember
      if (field === "isMember" && value === false) {
        next[index].ieeeId = "";
        next[index].studentBranchCode = "";
        next[index].ieeeCardS3Key = "";
        next[index].ieeeCardFileName = "";
      }

      return next;
    });
    clearMemberFieldError(index, field);
  }


  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34]";

  // Build the payload for the hidden form input
  const formPayload = JSON.stringify({
    leaderFullName: leaderPersonal.fullName,
    leaderEmail: leaderPersonal.email,
    leaderPhone: leaderPersonal.phone,
    leaderAffiliation: leaderPersonal.affiliation,
    leaderCategory: leaderMembership.category,
    leaderReferralCode: leaderMembership.referralCode,
    leaderIsMember: leaderMembership.isMember,
    leaderIeeeId: leaderMembership.ieeeId,
    leaderStudentBranchCode: leaderMembership.studentBranchCode,
    leaderIeeeCardS3Key: leaderMembership.ieeeCardS3Key,
    members: members.map((m) => ({
      fullName: m.fullName,
      email: m.email,
      phone: m.phone,
      category: m.category,
      isMember: m.isMember,
      ieeeId: m.ieeeId,
      studentBranchCode: m.studentBranchCode,
      ieeeCardS3Key: m.ieeeCardS3Key,
    })),
    paymentScreenshotS3Key,
  });

  // ── Success Screen ──
  if (submitState.success && submitState.leaderProfileToken) {
    const profileLink = `/profiles?token=${encodeURIComponent(
      submitState.leaderProfileToken,
    )}`;

    return (
      <div className="min-h-screen bg-[#f0f4f8] px-4 py-12">
        <div className="mx-auto max-w-lg rounded-xl bg-white p-10 text-center shadow-lg">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="material-symbols-outlined text-3xl text-green-600">
              check_circle
            </span>
          </div>
          <h1 className="mb-3 text-2xl font-bold text-slate-800">
            Team Registration Received!
          </h1>
          <p className="mb-2 text-sm leading-relaxed text-gray-600">
            {submitState.message}
          </p>
          <p className="mb-6 text-xs text-gray-400">
            Each team member will receive a confirmation email with their
            individual profile link.
          </p>
          <Link
            href={profileLink}
            className="mb-3 inline-block rounded-lg bg-[#7B1F34] px-8 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
          >
            View Leader Profile
          </Link>
          <div>
            <Link href="/" className="text-sm text-[#7B1F34] hover:underline">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] px-4 py-12">
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      )}
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">
            Bulk Registration
          </h1>
          <p className="text-gray-500">
            Register your team in one go. Fill in your details, add team
            members, and pay once.
          </p>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-[#7B1F34]" />
        </div>

        <StepIndicator currentStep={step} />

        {submitState.message && !submitState.success && (
          <div className="mb-6 rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">
              {submitState.message}
            </p>
          </div>
        )}

        {/* ═══ Step 1: Leader Personal Info ═══ */}
        {step === 1 && (
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7B1F34]">
                person
              </span>
              <h2 className="text-lg font-bold text-slate-800">
                Team Leader — Personal Info
              </h2>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={leaderPersonal.fullName}
                onChange={(e) => {
                  setLeaderPersonal((p) => ({
                    ...p,
                    fullName: e.target.value,
                  }));
                  clearFieldError("fullName");
                }}
                className={inputClass}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={leaderPersonal.email}
                onChange={(e) => {
                  setLeaderPersonal((p) => ({
                    ...p,
                    email: e.target.value,
                  }));
                  clearFieldError("email");
                }}
                className={inputClass}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                value={leaderPersonal.phone}
                onChange={(e) => {
                  setLeaderPersonal((p) => ({
                    ...p,
                    phone: e.target.value,
                  }));
                  clearFieldError("phone");
                }}
                className={inputClass}
                placeholder="+91 XXXXX XXXXX"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                College / Organization <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={leaderPersonal.affiliation}
                onChange={(e) => {
                  setLeaderPersonal((p) => ({
                    ...p,
                    affiliation: e.target.value,
                  }));
                  clearFieldError("affiliation");
                }}
                className={inputClass}
                placeholder="Your college or organization"
              />
              <p className="mt-1 text-xs text-gray-400">
                This will be the same for all team members.
              </p>
              {errors.affiliation && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.affiliation}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={goToStep2}
              className="w-full rounded-lg bg-[#7B1F34] py-3 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Continue to Membership
            </button>
          </div>
        )}

        {/* ═══ Step 2: Leader Membership ═══ */}
        {step === 2 && (
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
            <div className="mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#7B1F34]">
                badge
              </span>
              <h2 className="text-lg font-bold text-slate-800">
                Team Leader — Membership Details
              </h2>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={leaderMembership.category}
                onChange={(e) => {
                  setLeaderMembership((p) => ({
                    ...p,
                    category: e.target.value,
                  }));
                  clearFieldError("leaderCategory");
                }}
                className={`${inputClass} bg-white`}
              >
                <option value="" disabled>
                  Select your category
                </option>
                {registrationCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {categoryLabels[cat]}
                  </option>
                ))}
              </select>
              {errors.leaderCategory && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.leaderCategory}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Referral Code
              </label>
              <input
                type="text"
                value={leaderMembership.referralCode}
                onChange={(e) => {
                  setLeaderMembership((p) => ({
                    ...p,
                    referralCode: e.target.value,
                  }));
                  clearFieldError("leaderReferralCode");
                }}
                className={inputClass}
                placeholder="Enter referral code (if any)"
              />
            </div>

            <div>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={leaderMembership.isMember}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setLeaderMembership((p) => ({
                      ...p,
                      isMember: checked,
                      ieeeId: checked ? p.ieeeId : "",
                      studentBranchCode: checked ? p.studentBranchCode : "",
                      ieeeCardS3Key: checked ? p.ieeeCardS3Key : "",
                    }));
                    if (!checked) setLeaderIeeeCardFileName("");
                    clearFieldError("leaderIeeeId");
                    clearFieldError("leaderIeeeCardS3Key");
                  }}
                  className="h-4 w-4 rounded accent-[#7B1F34]"
                />
                <span className="text-sm font-semibold text-slate-700">
                  I am an IEEE Member
                </span>
              </label>
            </div>

            {leaderMembership.isMember && (
              <div className="space-y-6 border-l-2 border-[#7B1F34]/20 pl-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    IEEE Membership ID{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={leaderMembership.ieeeId}
                    onChange={(e) => {
                      setLeaderMembership((p) => ({
                        ...p,
                        ieeeId: e.target.value,
                      }));
                      clearFieldError("leaderIeeeId");
                    }}
                    className={inputClass}
                    placeholder="e.g. 12345678"
                  />
                  {errors.leaderIeeeId && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.leaderIeeeId}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Student Branch Code
                  </label>
                  <input
                    type="text"
                    value={leaderMembership.studentBranchCode}
                    onChange={(e) => {
                      setLeaderMembership((p) => ({
                        ...p,
                        studentBranchCode: e.target.value,
                      }));
                    }}
                    className={inputClass}
                    placeholder="Enter branch code (optional)"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    IEEE Membership ID Card{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-6 text-center transition-colors hover:border-[#7B1F34] hover:bg-gray-50">
                    <span className="material-symbols-outlined mb-2 block text-3xl text-gray-400">
                      cloud_upload
                    </span>
                    {uploading.leaderIeeeCard ? (
                      <p className="text-sm text-[#7B1F34]">Uploading...</p>
                    ) : leaderIeeeCardFileName ? (
                      <p className="text-sm font-medium text-green-700">
                        {leaderIeeeCardFileName}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Click to upload (JPG, PNG, WEBP, PDF — max 500KB)
                      </p>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      className="hidden"
                      onChange={(e) => {
                        void handleLeaderIeeeCardUpload(
                          e.target.files?.[0] ?? null,
                        );
                      }}
                    />
                  </label>
                  {errors.leaderIeeeCardS3Key && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.leaderIeeeCardS3Key}
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToStep3}
                className="flex-1 rounded-lg bg-[#7B1F34] py-3 text-sm font-bold text-white transition-all hover:brightness-110"
              >
                Continue to Team Members
              </button>
            </div>
          </div>
        )}

        {/* ═══ Step 3: Team Members ═══ */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-8 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#7B1F34]">
                    group
                  </span>
                  <h2 className="text-lg font-bold text-slate-800">
                    Team Members ({members.length}/25)
                  </h2>
                </div>
                {members.length < 25 && (
                  <button
                    type="button"
                    onClick={addMember}
                    className="flex items-center gap-1 rounded-lg bg-[#7B1F34]/10 px-3 py-1.5 text-xs font-bold text-[#7B1F34] transition-colors hover:bg-[#7B1F34]/20"
                  >
                    <span className="material-symbols-outlined text-base">
                      add
                    </span>
                    Add Member
                  </button>
                )}
              </div>

              <p className="mb-4 text-xs text-gray-400">
                All team members will share the same college/organization as the
                leader ({leaderPersonal.affiliation || "—"}).
              </p>

              {errors.members && (
                <p className="mb-4 text-sm text-red-500">{errors.members}</p>
              )}

              <div className="space-y-3">
                {members.map((member, index) => {
                  const mErrors = memberFieldErrors[index] || {};
                  const isExpanded = expandedMember === index;
                  const hasErrors = Object.keys(mErrors).length > 0;

                  return (
                    <div
                      key={index}
                      className={`rounded-lg border transition-colors ${
                        hasErrors
                          ? "border-red-300 bg-red-50/30"
                          : isExpanded
                            ? "border-[#7B1F34]/30 bg-[#7B1F34]/5"
                            : "border-gray-200"
                      }`}
                    >
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedMember(isExpanded ? -1 : index)
                        }
                        className="flex w-full items-center justify-between p-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                              hasErrors
                                ? "bg-red-100 text-red-600"
                                : member.fullName
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <span className="text-sm font-semibold text-slate-700">
                            {member.fullName || `Member ${index + 1}`}
                          </span>
                          {member.email && (
                            <span className="hidden text-xs text-gray-400 sm:inline">
                              ({member.email})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {members.length > 10 && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                removeMember(index);
                              }}
                              className="material-symbols-outlined cursor-pointer text-lg text-red-400 hover:text-red-600"
                            >
                              delete
                            </span>
                          )}
                          <span
                            className={`material-symbols-outlined text-gray-400 transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          >
                            expand_more
                          </span>
                        </div>
                      </button>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div className="space-y-5 border-t border-gray-200 p-4">
                          <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                              Full Name{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={member.fullName}
                              onChange={(e) =>
                                updateMember(index, "fullName", e.target.value)
                              }
                              className={inputClass}
                              placeholder="Enter member's full name"
                            />
                            {mErrors.fullName && (
                              <p className="mt-1 text-xs text-red-500">
                                {mErrors.fullName}
                              </p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Email{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="email"
                                value={member.email}
                                onChange={(e) =>
                                  updateMember(index, "email", e.target.value)
                                }
                                className={inputClass}
                                placeholder="member@example.com"
                              />
                              {mErrors.email && (
                                <p className="mt-1 text-xs text-red-500">
                                  {mErrors.email}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                Phone{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="tel"
                                value={member.phone}
                                onChange={(e) =>
                                  updateMember(index, "phone", e.target.value)
                                }
                                className={inputClass}
                                placeholder="+91 XXXXX XXXXX"
                              />
                              {mErrors.phone && (
                                <p className="mt-1 text-xs text-red-500">
                                  {mErrors.phone}
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                              Category{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={member.category}
                              onChange={(e) =>
                                updateMember(
                                  index,
                                  "category",
                                  e.target.value,
                                )
                              }
                              className={`${inputClass} bg-white`}
                            >
                              <option value="" disabled>
                                Select category
                              </option>
                              {registrationCategories.map((cat) => (
                                <option key={cat} value={cat}>
                                  {categoryLabels[cat]}
                                </option>
                              ))}
                            </select>
                            {mErrors.category && (
                              <p className="mt-1 text-xs text-red-500">
                                {mErrors.category}
                              </p>
                            )}
                          </div>

                          <div>
                            <label className="flex cursor-pointer items-center gap-3">
                              <input
                                type="checkbox"
                                checked={member.isMember}
                                onChange={(e) =>
                                  updateMember(
                                    index,
                                    "isMember",
                                    e.target.checked,
                                  )
                                }
                                className="h-4 w-4 rounded accent-[#7B1F34]"
                              />
                              <span className="text-sm font-semibold text-slate-700">
                                IEEE Member
                              </span>
                            </label>
                          </div>

                          {member.isMember && (
                            <div className="space-y-5 border-l-2 border-[#7B1F34]/20 pl-4">
                              <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                  IEEE Membership ID{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="text"
                                  value={member.ieeeId}
                                  onChange={(e) =>
                                    updateMember(
                                      index,
                                      "ieeeId",
                                      e.target.value,
                                    )
                                  }
                                  className={inputClass}
                                  placeholder="e.g. 12345678"
                                />
                                {mErrors.ieeeId && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {mErrors.ieeeId}
                                  </p>
                                )}
                              </div>

                              <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                  Student Branch Code
                                </label>
                                <input
                                  type="text"
                                  value={member.studentBranchCode}
                                  onChange={(e) =>
                                    updateMember(
                                      index,
                                      "studentBranchCode",
                                      e.target.value,
                                    )
                                  }
                                  className={inputClass}
                                  placeholder="Enter branch code (optional)"
                                />
                              </div>

                              <div>
                                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                                  IEEE Card{" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-4 text-center transition-colors hover:border-[#7B1F34] hover:bg-gray-50">
                                  <span className="material-symbols-outlined mb-1 block text-2xl text-gray-400">
                                    cloud_upload
                                  </span>
                                  {uploading.memberIeeeCard === index ? (
                                    <p className="text-sm text-[#7B1F34]">
                                      Uploading...
                                    </p>
                                  ) : member.ieeeCardFileName ? (
                                    <p className="text-sm font-medium text-green-700">
                                      {member.ieeeCardFileName}
                                    </p>
                                  ) : (
                                    <p className="text-xs text-gray-500">
                                      JPG, PNG, WEBP, PDF — max 500KB
                                    </p>
                                  )}
                                  <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,application/pdf"
                                    className="hidden"
                                    onChange={(e) => {
                                      void handleMemberIeeeCardUpload(
                                        index,
                                        e.target.files?.[0] ?? null,
                                      );
                                    }}
                                  />
                                </label>
                                {mErrors.ieeeCardS3Key && (
                                  <p className="mt-1 text-xs text-red-500">
                                    {mErrors.ieeeCardS3Key}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>



            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg border border-gray-300 bg-white py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={goToStep4}
                className="flex-1 rounded-lg bg-[#7B1F34] py-3 text-sm font-bold text-white transition-all hover:brightness-110"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {/* ═══ Step 4: Payment ═══ */}
        {step === 4 && (
          <form
            action={submitAction}
            onSubmit={handleFinalSubmit}
            className="space-y-8 rounded-xl bg-white p-8 shadow-lg"
          >


            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-800">
                Upload Payment Proof
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Upload a single payment screenshot covering all team members.
              </p>
              <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-6 text-center transition-colors hover:border-[#7B1F34] hover:bg-gray-50">
                <span className="material-symbols-outlined mb-2 block text-3xl text-gray-400">
                  cloud_upload
                </span>
                {uploading.payment ? (
                  <p className="text-sm text-[#7B1F34]">Uploading...</p>
                ) : paymentFileName ? (
                  <p className="text-sm font-medium text-green-700">
                    {paymentFileName}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Click to upload payment screenshot (JPG, PNG, WEBP, max
                    500KB)
                  </p>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    void handlePaymentUpload(e.target.files?.[0] ?? null);
                  }}
                />
              </label>
              {errors.paymentScreenshotS3Key && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.paymentScreenshotS3Key}
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-800">
                Bank Transfer Details
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                Transfer the total registration fee and upload your UTR or
                transaction screenshot above.
              </p>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Beneficiary Name</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {process.env.NEXT_PUBLIC_BENEFICIARY_NAME || "—"}
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Bank Name</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {process.env.NEXT_PUBLIC_BANK_NAME || "—"}
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Account Number</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    {process.env.NEXT_PUBLIC_BANK_ACCOUNT_NUMBER || "—"}
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">IFSC Code</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    {process.env.NEXT_PUBLIC_BANK_IFSC_CODE || "—"}
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Account Type</span>
                  <span className="text-sm font-semibold text-slate-800">
                    {process.env.NEXT_PUBLIC_BANK_ACCOUNT_TYPE || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Hidden payload */}
            <input type="hidden" name="payload" value={formPayload} />
            <input
              type="hidden"
              name="cf-turnstile-response"
              value={turnstileToken}
            />

            {TURNSTILE_SITE_KEY && (
              <div>
                <div ref={turnstileRef} className="flex justify-center min-h-[65px] items-center">
                  {!turnstileToken && turnstileReady && (
                    <p className="text-xs text-gray-400 animate-pulse">Loading security check...</p>
                  )}
                </div>
                {errors.captcha && (
                  <p
                    role="alert"
                    className="mt-2 text-center text-xs text-red-500"
                  >
                    {errors.captcha}
                  </p>
                )}
              </div>
            )}

            {TURNSTILE_SITE_KEY && !turnstileToken && (
              <p className="text-center text-xs text-amber-600">
                Please complete the security check above to enable registration.
              </p>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  uploading.payment ||
                  uploading.leaderIeeeCard ||
                  uploading.memberIeeeCard >= 0 ||
                  (!!TURNSTILE_SITE_KEY && !turnstileToken)
                }
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#7B1F34] py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Registering Team...
                  </>
                ) : (
                  `Register Team (${1 + members.length} Members)`
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
