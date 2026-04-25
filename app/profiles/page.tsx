import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { registrations } from "@/lib/db/schema";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type ProfilesPageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

const categoryLabels: Record<string, string> = {
  student_member: "Student Member",
  graduate_student_member: "Graduate Student Member",
  professional_member: "Professional Member",
  faculty_member: "Faculty Member",
};

const statusLabels: Record<string, string> = {
  under_review: "Under review",
  verified: "Verified",
  rejected: "Rejected",
};

const statusColors: Record<string, string> = {
  under_review: "bg-amber-100 text-amber-800",
  verified: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function toSingleValue(value?: string | string[]): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

function renderInvalidState() {
  return (
    <div className="min-h-screen bg-[#f0f4f8] px-4 py-12">
      <div className="mx-auto max-w-xl rounded-xl bg-white p-10 text-center shadow-lg">
        <h1 className="mb-3 text-2xl font-bold text-slate-800">Invalid or Expired Link</h1>
        <p className="text-sm text-gray-600">
          The profile link is invalid, expired, or no longer available. Please use the
          latest profile link from your confirmation email.
        </p>
      </div>
    </div>
  );
}

export default async function ProfilesPage({ searchParams }: ProfilesPageProps) {
  const token = toSingleValue((await searchParams).token)?.trim();

  if (!token) {
    return renderInvalidState();
  }

  const result = await db
    .select()
    .from(registrations)
    .where(eq(registrations.profileToken, token))
    .limit(1);

  const registration = result[0];

  if (!registration) {
    return renderInvalidState();
  }

  const statusLabel =
    statusLabels[registration.registrationStatus] || registration.registrationStatus;
  const statusColorClass =
    statusColors[registration.registrationStatus] || "bg-slate-100 text-slate-700";

  return (
    <div className="min-h-screen bg-[#f0f4f8] px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Registration Profile</h1>
              <p className="text-sm text-gray-500">DSSYWLC 2025 submission details</p>
            </div>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusColorClass}`}
            >
              {statusLabel}
            </span>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <section className="rounded-lg border border-gray-200 p-5">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                Personal Info
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Full Name</dt>
                  <dd className="font-medium text-slate-800">{registration.fullName}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Email</dt>
                  <dd className="font-medium text-slate-800">{registration.email}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Phone</dt>
                  <dd className="font-medium text-slate-800">{registration.phone}</dd>
                </div>
                <div>
                  <dt className="text-gray-500">Affiliation</dt>
                  <dd className="font-medium text-slate-800">{registration.affiliation}</dd>
                </div>
              </dl>
            </section>

            <section className="rounded-lg border border-gray-200 p-5">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
                Membership Details
              </h2>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-gray-500">Category</dt>
                  <dd className="font-medium text-slate-800">
                    {categoryLabels[registration.category] || registration.category}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">Referral Code</dt>
                  <dd className="font-medium text-slate-800">
                    {registration.referralCode || "Not provided"}
                  </dd>
                </div>
                <div>
                  <dt className="text-gray-500">IEEE Member</dt>
                  <dd className="font-medium text-slate-800">
                    {registration.isMember ? "Yes" : "No"}
                  </dd>
                </div>
                {registration.isMember && (
                  <>
                    <div>
                      <dt className="text-gray-500">IEEE Membership ID</dt>
                      <dd className="font-medium text-slate-800">
                        {registration.ieeeId || "Not provided"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-gray-500">Student Branch Code</dt>
                      <dd className="font-medium text-slate-800">
                        {registration.studentBranchCode || "Not provided"}
                      </dd>
                    </div>
                  </>
                )}
              </dl>
            </section>
          </div>
        </div>

        <div className="rounded-xl bg-white p-8 shadow-lg">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">
            Payment & Review Status
          </h2>
          <div className="space-y-3 text-sm">
            <p className="text-slate-700">
              Payment proof: <span className="font-semibold">Received</span>
            </p>
            <p className="text-slate-700">
              Current status: <span className="font-semibold">{statusLabel}</span>
            </p>
            <p className="text-gray-500">
              A confirmation and status updates are sent to your registered email address.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
