"use client";

import { useActionState } from "react";
import { useEffect, useState } from "react";
import { registerUser, getExistingRegistration, type RegisterState } from "@/app/actions/register";
import type { Registration } from "@/lib/db/schema";

const initialState: RegisterState = { success: false };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);
  const [existing, setExisting] = useState<Registration | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExistingRegistration().then((data) => {
      if (data) {
        setExisting(data);
        setIsMember(data.isMember);
      }
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="animate-spin w-8 h-8 border-4 border-[#7B1F34] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="material-symbols-outlined text-green-600 text-3xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            {state.message}
          </h2>
          <p className="text-gray-500 mb-8">
            Thank you for registering for DSSYWLC 2025. We look forward to seeing you!
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

  return (
    <div className="min-h-screen bg-[#f0f4f8] py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Congress Registration</h1>
          <p className="text-gray-500">
            {existing ? "Update your registration details below." : "Complete the form below to register for DSSYWLC 2025."}
          </p>
          <div className="w-16 h-0.5 bg-[#7B1F34] mx-auto mt-4"></div>
        </div>

        {state.message && !state.success && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg mb-6">
            <p className="text-red-700 text-sm font-medium">{state.message}</p>
          </div>
        )}

        <form action={formAction} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              defaultValue={existing?.fullName ?? ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors"
              placeholder="Enter your full name"
            />
            {state.errors?.fullName && (
              <p className="text-red-500 text-xs mt-1">{state.errors.fullName[0]}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              defaultValue={existing?.email ?? ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors"
              placeholder="you@example.com"
            />
            {state.errors?.email && (
              <p className="text-red-500 text-xs mt-1">{state.errors.email[0]}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              defaultValue={existing?.phone ?? ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors"
              placeholder="+91 XXXXX XXXXX"
            />
            {state.errors?.phone && (
              <p className="text-red-500 text-xs mt-1">{state.errors.phone[0]}</p>
            )}
          </div>

          {/* Affiliation */}
          <div>
            <label htmlFor="affiliation" className="block text-sm font-semibold text-slate-700 mb-1.5">
              College / Organization <span className="text-red-500">*</span>
            </label>
            <input
              id="affiliation"
              name="affiliation"
              type="text"
              required
              defaultValue={existing?.affiliation ?? ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors"
              placeholder="Your college or organization"
            />
            {state.errors?.affiliation && (
              <p className="text-red-500 text-xs mt-1">{state.errors.affiliation[0]}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="category"
              name="category"
              required
              defaultValue={existing?.category ?? ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors bg-white"
            >
              <option value="" disabled>Select your category</option>
              <option value="student">Student</option>
              <option value="professional">Young Professional</option>
              <option value="faculty">Faculty / Life Member</option>
            </select>
            {state.errors?.category && (
              <p className="text-red-500 text-xs mt-1">{state.errors.category[0]}</p>
            )}
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

          {/* IEEE ID — conditionally shown */}
          {isMember && (
            <div>
              <label htmlFor="ieeeId" className="block text-sm font-semibold text-slate-700 mb-1.5">
                IEEE Membership ID
              </label>
              <input
                id="ieeeId"
                name="ieeeId"
                type="text"
                defaultValue={existing?.ieeeId ?? ""}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors"
                placeholder="e.g. 12345678"
              />
              {state.errors?.ieeeId && (
                <p className="text-red-500 text-xs mt-1">{state.errors.ieeeId[0]}</p>
              )}
            </div>
          )}

          {/* T-Shirt Size */}
          <div>
            <label htmlFor="tshirtSize" className="block text-sm font-semibold text-slate-700 mb-1.5">
              T-Shirt Size
            </label>
            <select
              id="tshirtSize"
              name="tshirtSize"
              defaultValue={existing?.tshirtSize ?? ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors bg-white"
            >
              <option value="">Select size (optional)</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          {/* Dietary Preference */}
          <div>
            <label htmlFor="dietaryPreference" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Dietary Preference
            </label>
            <input
              id="dietaryPreference"
              name="dietaryPreference"
              type="text"
              defaultValue={existing?.dietaryPreference ?? ""}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-slate-800 text-sm focus:border-[#7B1F34] focus:ring-1 focus:ring-[#7B1F34] outline-none transition-colors"
              placeholder="e.g. Vegetarian, Vegan, None"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 bg-[#7B1F34] text-white rounded-lg font-bold text-sm hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                Submitting...
              </>
            ) : existing ? (
              "Update Registration"
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
