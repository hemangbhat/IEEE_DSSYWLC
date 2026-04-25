"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { z } from "zod";
import { submitRegistration, type RegisterState } from "@/app/actions/register";
import {
  registrationCategories,
  registrationSubmissionSchema,
  step1Schema,
  step2Schema,
  step3Schema,
} from "@/lib/validations";

const initialSubmitState: RegisterState = { success: false };
const MAX_UPLOAD_SIZE_BYTES = 500 * 1024;
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

type UploadType = "ieee_card" | "payment_screenshot";

type Step1FormState = {
  fullName: string;
  email: string;
  phone: string;
  affiliation: string;
};

type Step2FormState = {
  category: string;
  referralCode: string;
  isMember: boolean;
  ieeeId: string;
  studentBranchCode: string;
  ieeeCardS3Key: string;
};

type Step3FormState = {
  paymentScreenshotS3Key: string;
};

const categoryLabels: Record<(typeof registrationCategories)[number], string> = {
  student_member: "Student Member",
  graduate_student_member: "Graduate Student Member",
  professional_member: "Professional Member",
  faculty_member: "Faculty Member",
};

function mapZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors = error.flatten()
    .fieldErrors as Record<string, string[] | undefined>;
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

function StepIndicator({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps = ["Personal Info", "Memberships", "Payment"];

  return (
    <div className="mb-10 flex items-center justify-center gap-2">
      {steps.map((label, index) => {
        const stepNumber = (index + 1) as 1 | 2 | 3;
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
                  <span className="material-symbols-outlined text-base">check</span>
                ) : (
                  stepNumber
                )}
              </div>
              <span
                className={`hidden text-sm font-medium sm:inline ${
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
                className={`h-0.5 w-8 sm:w-16 ${
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

export default function RegisterPage() {
  const [submitState, submitAction, isSubmitting] = useActionState(
    submitRegistration,
    initialSubmitState
  );
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const [step1, setStep1] = useState<Step1FormState>({
    fullName: "",
    email: "",
    phone: "",
    affiliation: "",
  });

  const [step2, setStep2] = useState<Step2FormState>({
    category: "",
    referralCode: "",
    isMember: false,
    ieeeId: "",
    studentBranchCode: "",
    ieeeCardS3Key: "",
  });

  const [step3, setStep3] = useState<Step3FormState>({
    paymentScreenshotS3Key: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState({ ieeeCard: false, payment: false });
  const [ieeeCardFileName, setIeeeCardFileName] = useState("");
  const [paymentFileName, setPaymentFileName] = useState("");

  const serverErrors = useMemo(() => {
    const mapped: Record<string, string> = {};
    const submitErrors =
      (submitState.errors as Record<string, string[] | undefined> | undefined) ||
      {};
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
      if (!prev[field]) {
        return prev;
      }
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  async function uploadFile(file: File, uploadType: UploadType): Promise<string> {
    if (!ALLOWED_FILE_TYPES.includes(file.type as (typeof ALLOWED_FILE_TYPES)[number])) {
      throw new Error("Only JPG, PNG, and WEBP images are allowed.");
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

    const urlPayload = (await urlResponse.json().catch(() => null)) as
      | { uploadUrl?: string; s3Key?: string; error?: string }
      | null;

    if (!urlResponse.ok || !urlPayload?.uploadUrl || !urlPayload?.s3Key) {
      throw new Error(urlPayload?.error || "Failed to get upload URL.");
    }

    const uploadResponse = await fetch(urlPayload.uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file to storage.");
    }

    return urlPayload.s3Key;
  }

  async function handleIeeeCardUpload(file: File | null) {
    if (!file) {
      setIeeeCardFileName("");
      setStep2((prev) => ({ ...prev, ieeeCardS3Key: "" }));
      clearFieldError("ieeeCardS3Key");
      return;
    }

    setUploading((prev) => ({ ...prev, ieeeCard: true }));
    try {
      const s3Key = await uploadFile(file, "ieee_card");
      setStep2((prev) => ({ ...prev, ieeeCardS3Key: s3Key }));
      setIeeeCardFileName(file.name);
      clearFieldError("ieeeCardS3Key");
    } catch (error) {
      setFieldErrors((prev) => ({
        ...prev,
        ieeeCardS3Key: formatFileError(error),
      }));
      setStep2((prev) => ({ ...prev, ieeeCardS3Key: "" }));
    } finally {
      setUploading((prev) => ({ ...prev, ieeeCard: false }));
    }
  }

  async function handlePaymentUpload(file: File | null) {
    if (!file) {
      setPaymentFileName("");
      setStep3({ paymentScreenshotS3Key: "" });
      clearFieldError("paymentScreenshotS3Key");
      return;
    }

    setUploading((prev) => ({ ...prev, payment: true }));
    try {
      const s3Key = await uploadFile(file, "payment_screenshot");
      setStep3({ paymentScreenshotS3Key: s3Key });
      setPaymentFileName(file.name);
      clearFieldError("paymentScreenshotS3Key");
    } catch (error) {
      setFieldErrors((prev) => ({
        ...prev,
        paymentScreenshotS3Key: formatFileError(error),
      }));
      setStep3({ paymentScreenshotS3Key: "" });
    } finally {
      setUploading((prev) => ({ ...prev, payment: false }));
    }
  }

  function goToStep2() {
    const parsed = step1Schema.safeParse(step1);
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setStep(2);
  }

  function goToStep3() {
    const parsed = step2Schema.safeParse(step2);
    if (!parsed.success) {
      setFieldErrors(mapZodErrors(parsed.error));
      return;
    }

    setFieldErrors({});
    setStep(3);
  }

  function handleFinalSubmit(event: React.FormEvent<HTMLFormElement>) {
    const isUploadInProgress = uploading.ieeeCard || uploading.payment;
    if (isUploadInProgress) {
      event.preventDefault();
      setFieldErrors((prev) => ({
        ...prev,
        paymentScreenshotS3Key:
          "Please wait for all file uploads to finish before submitting.",
      }));
      return;
    }

    const finalPayload = {
      ...step1,
      ...step2,
      ...step3,
    };

    const parsed = registrationSubmissionSchema.safeParse(finalPayload);
    if (!parsed.success) {
      event.preventDefault();
      const nextErrors = mapZodErrors(parsed.error);
      setFieldErrors(nextErrors);

      const step1Fields = ["fullName", "email", "phone", "affiliation"];
      const step2Fields = [
        "category",
        "referralCode",
        "isMember",
        "ieeeId",
        "studentBranchCode",
        "ieeeCardS3Key",
      ];

      const keys = Object.keys(nextErrors);
      if (keys.some((key) => step1Fields.includes(key))) {
        setStep(1);
      } else if (keys.some((key) => step2Fields.includes(key))) {
        setStep(2);
      } else {
        setStep(3);
      }
      return;
    }

    setFieldErrors({});
  }

  const inputClass =
    "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34]";

  if (submitState.success && submitState.profileToken) {
    const profileLink = `/profiles?token=${encodeURIComponent(
      submitState.profileToken
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
            Registration Received
          </h1>
          <p className="mb-6 text-sm leading-relaxed text-gray-600">
            Your registration has been submitted and is currently under review.
            Save your profile link to track status updates.
          </p>
          <Link
            href={profileLink}
            className="mb-3 inline-block rounded-lg bg-[#7B1F34] px-8 py-3 text-sm font-bold text-white transition-all hover:brightness-110"
          >
            View My Profile
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
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 text-center">
          <h1 className="mb-2 text-3xl font-bold text-slate-800">
            Congress Registration
          </h1>
          <p className="text-gray-500">
            Complete your details in three simple steps.
          </p>
          <div className="mx-auto mt-4 h-0.5 w-16 bg-[#7B1F34]" />
        </div>

        <StepIndicator currentStep={step} />

        {submitState.message && !submitState.success && (
          <div className="mb-6 rounded-r-lg border-l-4 border-red-500 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">{submitState.message}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={step1.fullName}
                onChange={(event) => {
                  setStep1((prev) => ({ ...prev, fullName: event.target.value }));
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
                value={step1.email}
                onChange={(event) => {
                  setStep1((prev) => ({ ...prev, email: event.target.value }));
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
                value={step1.phone}
                onChange={(event) => {
                  setStep1((prev) => ({ ...prev, phone: event.target.value }));
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
                value={step1.affiliation}
                onChange={(event) => {
                  setStep1((prev) => ({ ...prev, affiliation: event.target.value }));
                  clearFieldError("affiliation");
                }}
                className={inputClass}
                placeholder="Your college or organization"
              />
              {errors.affiliation && (
                <p className="mt-1 text-xs text-red-500">{errors.affiliation}</p>
              )}
            </div>

            <button
              type="button"
              onClick={goToStep2}
              className="w-full rounded-lg bg-[#7B1F34] py-3 text-sm font-bold text-white transition-all hover:brightness-110"
            >
              Continue to Memberships
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 rounded-xl bg-white p-8 shadow-lg">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={step2.category}
                onChange={(event) => {
                  setStep2((prev) => ({ ...prev, category: event.target.value }));
                  clearFieldError("category");
                }}
                className={`${inputClass} bg-white`}
              >
                <option value="" disabled>
                  Select your category
                </option>
                {registrationCategories.map((category) => (
                  <option key={category} value={category}>
                    {categoryLabels[category]}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                Referral Code
              </label>
              <input
                type="text"
                value={step2.referralCode}
                onChange={(event) => {
                  setStep2((prev) => ({ ...prev, referralCode: event.target.value }));
                  clearFieldError("referralCode");
                }}
                className={inputClass}
                placeholder="Enter referral code (if any)"
              />
              {errors.referralCode && (
                <p className="mt-1 text-xs text-red-500">{errors.referralCode}</p>
              )}
            </div>

            <div>
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={step2.isMember}
                  onChange={(event) => {
                    const checked = event.target.checked;
                    setStep2((prev) => ({
                      ...prev,
                      isMember: checked,
                      ieeeId: checked ? prev.ieeeId : "",
                      studentBranchCode: checked ? prev.studentBranchCode : "",
                      ieeeCardS3Key: checked ? prev.ieeeCardS3Key : "",
                    }));
                    if (!checked) {
                      setIeeeCardFileName("");
                    }
                    clearFieldError("ieeeId");
                    clearFieldError("ieeeCardS3Key");
                  }}
                  className="h-4 w-4 rounded accent-[#7B1F34]"
                />
                <span className="text-sm font-semibold text-slate-700">
                  I am an IEEE Member
                </span>
              </label>
            </div>

            {step2.isMember && (
              <div className="space-y-6 border-l-2 border-[#7B1F34]/20 pl-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    IEEE Membership ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={step2.ieeeId}
                    onChange={(event) => {
                      setStep2((prev) => ({ ...prev, ieeeId: event.target.value }));
                      clearFieldError("ieeeId");
                    }}
                    className={inputClass}
                    placeholder="e.g. 12345678"
                  />
                  {errors.ieeeId && (
                    <p className="mt-1 text-xs text-red-500">{errors.ieeeId}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Student Branch Code
                  </label>
                  <input
                    type="text"
                    value={step2.studentBranchCode}
                    onChange={(event) => {
                      setStep2((prev) => ({
                        ...prev,
                        studentBranchCode: event.target.value,
                      }));
                      clearFieldError("studentBranchCode");
                    }}
                    className={inputClass}
                    placeholder="Enter branch code (optional)"
                  />
                  {errors.studentBranchCode && (
                    <p className="mt-1 text-xs text-red-500">
                      {errors.studentBranchCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    IEEE Membership ID Card <span className="text-red-500">*</span>
                  </label>
                  <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-6 text-center transition-colors hover:border-[#7B1F34] hover:bg-gray-50">
                    <span className="material-symbols-outlined mb-2 block text-3xl text-gray-400">
                      cloud_upload
                    </span>
                    {uploading.ieeeCard ? (
                      <p className="text-sm text-[#7B1F34]">Uploading...</p>
                    ) : ieeeCardFileName ? (
                      <p className="text-sm font-medium text-green-700">{ieeeCardFileName}</p>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Click to upload (JPG, PNG, WEBP, max 500KB)
                      </p>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(event) => {
                        void handleIeeeCardUpload(event.target.files?.[0] ?? null);
                      }}
                    />
                  </label>
                  {errors.ieeeCardS3Key && (
                    <p className="mt-1 text-xs text-red-500">{errors.ieeeCardS3Key}</p>
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
                Continue to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <form
            action={submitAction}
            onSubmit={handleFinalSubmit}
            className="space-y-8 rounded-xl bg-white p-8 shadow-lg"
          >
            <div>
              <h3 className="mb-4 text-lg font-bold text-slate-800">Upload Payment Proof</h3>
              <label className="block cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 p-6 text-center transition-colors hover:border-[#7B1F34] hover:bg-gray-50">
                <span className="material-symbols-outlined mb-2 block text-3xl text-gray-400">
                  cloud_upload
                </span>
                {uploading.payment ? (
                  <p className="text-sm text-[#7B1F34]">Uploading...</p>
                ) : paymentFileName ? (
                  <p className="text-sm font-medium text-green-700">{paymentFileName}</p>
                ) : (
                  <p className="text-sm text-gray-500">
                    Click to upload payment screenshot (JPG, PNG, WEBP, max 500KB)
                  </p>
                )}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => {
                    void handlePaymentUpload(event.target.files?.[0] ?? null);
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
              <h3 className="mb-4 text-lg font-bold text-slate-800">Bank Transfer Details</h3>
              <p className="mb-4 text-sm text-gray-500">
                Transfer the registration fee to this account and upload your UTR or
                transaction screenshot above.
              </p>
              <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Bank Name</span>
                  <span className="text-sm font-semibold text-slate-800">
                    State Bank of India
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Account Number</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    XXXXXXXXX1234
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">IFSC Code</span>
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    SBIN0001234
                  </span>
                </div>
                <div className="border-t border-gray-200" />
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-gray-500">Bank Address</span>
                  <span className="max-w-56 text-right text-sm font-semibold text-slate-800">
                    Poornima Campus Branch, Jaipur, Rajasthan
                  </span>
                </div>
              </div>
            </div>

            <input type="hidden" name="fullName" value={step1.fullName} />
            <input type="hidden" name="email" value={step1.email} />
            <input type="hidden" name="phone" value={step1.phone} />
            <input type="hidden" name="affiliation" value={step1.affiliation} />
            <input type="hidden" name="category" value={step2.category} />
            <input type="hidden" name="referralCode" value={step2.referralCode} />
            <input
              type="hidden"
              name="isMember"
              value={String(step2.isMember)}
            />
            <input type="hidden" name="ieeeId" value={step2.ieeeId} />
            <input
              type="hidden"
              name="studentBranchCode"
              value={step2.studentBranchCode}
            />
            <input
              type="hidden"
              name="ieeeCardS3Key"
              value={step2.ieeeCardS3Key}
            />
            <input
              type="hidden"
              name="paymentScreenshotS3Key"
              value={step3.paymentScreenshotS3Key}
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex-1 rounded-lg border border-gray-300 py-3 text-sm font-bold text-slate-700 transition-colors hover:bg-gray-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting || uploading.payment || uploading.ieeeCard}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#7B1F34] py-3 text-sm font-bold text-white transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
