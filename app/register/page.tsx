"use client";

import { useActionState, useState, useEffect, useRef, useCallback } from "react";
import {
  registerUser,
  submitPayment,
  getExistingRegistration,
  type RegisterState,
} from "@/app/actions/register";
import type { Registration } from "@/lib/db/schema";

const initialState: RegisterState = { success: false };

// ─── File-to-base64 helper ───
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Step indicator component ───
function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ["Registration", "Payment", "Confirmation"];
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {steps.map((label, i) => {
        const stepNum = i + 1;
        const isActive = stepNum === currentStep;
        const isComplete = stepNum < currentStep;
        return (
          <div key={label} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
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
                  stepNum
                )}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ${
                  isActive ? "text-[#7B1F34]" : isComplete ? "text-green-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 ${
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

// ─── Upload field component ───
function UploadField({
  id,
  label,
  required,
  fileName,
  onFileChange,
  error,
}: {
  id: string;
  label: string;
  required?: boolean;
  fileName: string;
  onFileChange: (file: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => inputRef.current?.click()}
        className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#7B1F34] hover:bg-gray-50 transition-colors"
      >
        <span className="material-symbols-outlined text-3xl text-gray-400 mb-2 block">
          cloud_upload
        </span>
        {fileName ? (
          <p className="text-sm text-green-700 font-medium">{fileName}</p>
        ) : (
          <p className="text-sm text-gray-500">Click to upload image (JPG, PNG, max 5MB)</p>
        )}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => onFileChange(e.target.files?.[0] ?? null)}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

// ─── Main page ───
export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [existing, setExisting] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);

  // Step 1 state
  const [regState, regAction, regPending] = useActionState(registerUser, initialState);
  const [isMember, setIsMember] = useState(false);
  const [ieeeCardFile, setIeeeCardFile] = useState<string>("");
  const [ieeeCardName, setIeeeCardName] = useState("");
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  // Step 2 state
  const [payState, payAction, payPending] = useActionState(submitPayment, initialState);
  const [payScreenshot, setPayScreenshot] = useState<string>("");
  const [payScreenshotName, setPayScreenshotName] = useState("");

  // Load existing registration
  useEffect(() => {
    getExistingRegistration().then((data) => {
      if (data) {
        setExisting(data);
        setIsMember(data.isMember);
        // If already submitted payment, go to confirmation
        if (data.registrationStatus === "payment_submitted" || data.registrationStatus === "verified") {
          setStep(3);
        }
      }
      setLoading(false);
    });
  }, []);

  // Advance to Step 2 on successful registration
  useEffect(() => {
    if (regState.success) {
      setStep(2);
    }
  }, [regState.success]);

  // Advance to Step 3 on successful payment
  useEffect(() => {
    if (payState.success) {
      setStep(3);
    }
  }, [payState.success]);

  const handleIeeeCardChange = useCallback(async (file: File | null) => {
    if (!file) {
      setIeeeCardFile("");
      setIeeeCardName("");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setClientErrors((prev) => ({ ...prev, ieeeCard: "File must be under 5MB" }));
      return;
    }
    setClientErrors((prev) => {
      const next = { ...prev };
      delete next.ieeeCard;
      return next;
    });
    const base64 = await fileToBase64(file);
    setIeeeCardFile(base64);
    setIeeeCardName(file.name);
  }, []);

  const handlePayScreenshotChange = useCallback(async (file: File | null) => {
    if (!file) {
      setPayScreenshot("");
      setPayScreenshotName("");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setClientErrors((prev) => ({ ...prev, payScreenshot: "File must be under 5MB" }));
      return;
    }
    setClientErrors((prev) => {
      const next = { ...prev };
      delete next.payScreenshot;
      return next;
    });
    const base64 = await fileToBase64(file);
    setPayScreenshot(base64);
    setPayScreenshotName(file.name);
  }, []);

  // ─── Loading ───
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="animate-spin w-8 h-8 border-4 border-[#7B1F34] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // ─── Step 3: Confirmation ───
  if (step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] px-4">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-lg text-center">
          <StepIndicator currentStep={3} />
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 text-3xl">
              check_circle
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            Thank You for Registering!
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            You will be contacted once your registration is verified via email.
            Please ensure your submission details are accurate.
          </p>
          <a
            href="/"
            className="inline-block px-8 py-3 bg-[#7B1F34] text-white rounded font-bold text-sm hover:brightness-110 transition-all"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors";

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Congress Registration</h1>
          <p className="text-gray-500">
            {step === 1 ? "Fill in your details to register for DSSYWLC 2025." : "Complete your payment to finish registration."}
          </p>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto mt-4"></div>
        </div>

        <StepIndicator currentStep={step} />

        {/* ═══════ STEP 1: Registration Form ═══════ */}
        {step === 1 && (
          <>
            {regState.message && !regState.success && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
                <p className="text-red-700 text-sm font-medium">{regState.message}</p>
              </div>
            )}

            <form action={regAction} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input id="fullName" name="fullName" type="text" required defaultValue={existing?.fullName ?? ""} className={inputClass} placeholder="Enter your full name" />
                {regState.errors?.fullName && <p className="text-red-500 text-xs mt-1">{regState.errors.fullName[0]}</p>}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input id="email" name="email" type="email" required defaultValue={existing?.email ?? ""} className={inputClass} placeholder="you@example.com" />
                {regState.errors?.email && <p className="text-red-500 text-xs mt-1">{regState.errors.email[0]}</p>}
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input id="phone" name="phone" type="tel" required defaultValue={existing?.phone ?? ""} className={inputClass} placeholder="+91 XXXXX XXXXX" />
                {regState.errors?.phone && <p className="text-red-500 text-xs mt-1">{regState.errors.phone[0]}</p>}
              </div>

              {/* Affiliation */}
              <div>
                <label htmlFor="affiliation" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  College / Organization <span className="text-red-500">*</span>
                </label>
                <input id="affiliation" name="affiliation" type="text" required defaultValue={existing?.affiliation ?? ""} className={inputClass} placeholder="Your college or organization" />
                {regState.errors?.affiliation && <p className="text-red-500 text-xs mt-1">{regState.errors.affiliation[0]}</p>}
              </div>

              {/* Category */}
              <div>
                <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Category <span className="text-red-500">*</span>
                </label>
                <select id="category" name="category" required defaultValue={existing?.category ?? ""} className={`${inputClass} bg-white`}>
                  <option value="" disabled>Select your category</option>
                  <option value="student_member">Student Member</option>
                  <option value="graduate_student_member">Graduate Student Member</option>
                  <option value="professional_member">Professional Member</option>
                  <option value="faculty_member">Faculty Member</option>
                </select>
                {regState.errors?.category && <p className="text-red-500 text-xs mt-1">{regState.errors.category[0]}</p>}
              </div>

              {/* Referral Code — optional, no asterisk */}
              <div>
                <label htmlFor="referralCode" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Referral Code
                </label>
                <input id="referralCode" name="referralCode" type="text" defaultValue={existing?.referralCode ?? ""} className={inputClass} placeholder="Enter referral code (if any)" />
              </div>

              {/* IEEE Member toggle */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isMember_checkbox"
                    checked={isMember}
                    onChange={(e) => setIsMember(e.target.checked)}
                    className="w-4 h-4 accent-[#7B1F34] rounded"
                  />
                  <span className="text-sm font-semibold text-slate-700">I am an IEEE Member</span>
                </label>
                <input type="hidden" name="isMember" value={String(isMember)} />
              </div>

              {/* IEEE fields — conditionally shown */}
              {isMember && (
                <div className="space-y-6 pl-4 border-l-2 border-[#7B1F34]/20">
                  {/* IEEE Membership ID — required when member */}
                  <div>
                    <label htmlFor="ieeeId" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      IEEE Membership ID <span className="text-red-500">*</span>
                    </label>
                    <input id="ieeeId" name="ieeeId" type="text" defaultValue={existing?.ieeeId ?? ""} className={inputClass} placeholder="e.g. 12345678" />
                    {regState.errors?.ieeeId && <p className="text-red-500 text-xs mt-1">{regState.errors.ieeeId[0]}</p>}
                  </div>

                  {/* Student Branch Code — optional */}
                  <div>
                    <label htmlFor="studentBranchCode" className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Student Branch Code
                    </label>
                    <input id="studentBranchCode" name="studentBranchCode" type="text" defaultValue={existing?.studentBranchCode ?? ""} className={inputClass} placeholder="Enter branch code (optional)" />
                  </div>

                  {/* IEEE Card Upload — required when member */}
                  <UploadField
                    id="ieeeCard"
                    label="IEEE Membership ID Card"
                    required
                    fileName={ieeeCardName}
                    onFileChange={handleIeeeCardChange}
                    error={clientErrors.ieeeCard || regState.errors?.ieeeCardData?.[0]}
                  />
                  <input type="hidden" name="ieeeCardData" value={ieeeCardFile} />
                </div>
              )}

              {/* Submit Step 1 */}
              <button
                type="submit"
                disabled={regPending}
                className="w-full py-3 bg-[#7B1F34] text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {regPending ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Saving...
                  </>
                ) : (
                  "Continue to Payment →"
                )}
              </button>
            </form>
          </>
        )}

        {/* ═══════ STEP 2: Payment ═══════ */}
        {step === 2 && (
          <>
            {payState.message && !payState.success && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
                <p className="text-red-700 text-sm font-medium">{payState.message}</p>
              </div>
            )}

            <form action={payAction} className="bg-white rounded-xl shadow-lg p-8 space-y-8">
              {/* Payment Screenshot Upload — at the top */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">
                  Upload Payment Proof
                </h3>
                <UploadField
                  id="paymentScreenshot"
                  label="UTR / Transaction Screenshot"
                  required
                  fileName={payScreenshotName}
                  onFileChange={handlePayScreenshotChange}
                  error={clientErrors.payScreenshot || payState.errors?.paymentScreenshotData?.[0]}
                />
                <input type="hidden" name="paymentScreenshotData" value={payScreenshot} />
              </div>

              {/* Bank Details */}
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-4">Bank Transfer Details</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Please transfer the registration fee to the following bank account and upload a screenshot of the transaction above.
                </p>
                <div className="bg-gray-50 rounded-lg p-6 space-y-3 border border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Bank Name</span>
                    <span className="text-sm font-semibold text-slate-800">State Bank of India</span>
                  </div>
                  <div className="border-t border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Account Number</span>
                    <span className="text-sm font-semibold text-slate-800 font-mono">XXXXXXXX1234</span>
                  </div>
                  <div className="border-t border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">IFSC Code</span>
                    <span className="text-sm font-semibold text-slate-800 font-mono">SBIN0001234</span>
                  </div>
                  <div className="border-t border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Bank Address</span>
                    <span className="text-sm font-semibold text-slate-800 text-right max-w-[200px]">
                      Poornima Campus Branch, Jaipur, Rajasthan
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 border border-gray-300 text-slate-700 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={payPending}
                  className="flex-1 py-3 bg-[#7B1F34] text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {payPending ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Submitting...
                    </>
                  ) : (
                    "Submit Payment"
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
