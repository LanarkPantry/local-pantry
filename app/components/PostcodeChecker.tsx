"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const DELIVERY_OUTWARD_CODES = ["ML8", "ML11"];

type PostcodeStatus = "idle" | "available" | "unavailable" | "invalid";
type RegisterInterestStatus = "idle" | "success" | "error";

function normalisePostcode(value: string) {
  return value.toUpperCase().replace(/\s+/g, "").trim();
}

function formatPostcode(value: string) {
  const cleaned = normalisePostcode(value);

  if (cleaned.length <= 3) return cleaned;

  return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`;
}

function isValidUkPostcode(value: string) {
  const postcode = formatPostcode(value);
  return /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i.test(postcode);
}

function getOutwardCode(value: string) {
  const cleaned = normalisePostcode(value);
  const match = cleaned.match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
  return match ? match[1] : "";
}

export default function PostcodeChecker() {
  const [postcode, setPostcode] = useState("");
  const [postcodeStatus, setPostcodeStatus] = useState<PostcodeStatus>("idle");

  const [interestEmail, setInterestEmail] = useState("");
  const [interestStatus, setInterestStatus] =
    useState<RegisterInterestStatus>("idle");
  const [interestMessage, setInterestMessage] = useState("");

  const formattedPostcode = useMemo(() => formatPostcode(postcode), [postcode]);
  const outwardCode = useMemo(() => getOutwardCode(postcode), [postcode]);

  const checkPostcode = () => {
    setInterestStatus("idle");
    setInterestMessage("");

    if (!postcode.trim() || !isValidUkPostcode(postcode)) {
      setPostcodeStatus("invalid");
      return;
    }

    setPostcodeStatus(
      DELIVERY_OUTWARD_CODES.includes(outwardCode)
        ? "available"
        : "unavailable",
    );
  };

  const registerInterest = async () => {
    setInterestStatus("idle");
    setInterestMessage("");

    if (!interestEmail.trim()) {
      setInterestStatus("error");
      setInterestMessage("Please enter your email address.");
      return;
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(interestEmail.trim());

    if (!validEmail) {
      setInterestStatus("error");
      setInterestMessage("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch("/api/register-interest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: interestEmail.trim(),
          postcode: formattedPostcode,
          outwardCode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to register interest.");
      }

      setInterestStatus("success");
      setInterestMessage(
        "Thanks — we’ll let you know when delivery opens in your area.",
      );
      setInterestEmail("");
    } catch {
      setInterestStatus("error");
      setInterestMessage("Sorry, something went wrong. Please try again.");
    }
  };

  return (
    <section
      id="postcode-checker"
      className="scroll-mt-24 px-6 pb-16 md:px-10 md:pb-24"
    >
      <div className="mx-auto max-w-4xl rounded-[30px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 text-center shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
          Delivery area
        </p>

        <h2 className="mt-3 font-serif text-4xl md:text-5xl">
          Check your postcode
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-[#667164]">
          Planning works wherever you are. Grocery delivery is currently
          available across ML8 and ML11. Enter your postcode to check
          availability.
        </p>

        <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input
            value={postcode}
            onChange={(e) => {
              setPostcode(e.target.value);

              if (postcodeStatus !== "idle") {
                setPostcodeStatus("idle");
              }

              if (interestStatus !== "idle") {
                setInterestStatus("idle");
                setInterestMessage("");
              }
            }}
            onBlur={() => {
              if (postcode.trim()) {
                setPostcode(formatPostcode(postcode));
              }
            }}
            placeholder="Enter postcode"
            className="flex-1 rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm uppercase tracking-[0.08em] text-[#243328] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[#8b8b7c]"
          />

          <button
            type="button"
            onClick={checkPostcode}
            className="rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#243328]"
          >
            Check
          </button>
        </div>

        {postcodeStatus === "available" && (
          <div className="mt-6 rounded-[24px] border border-[#c8d3c4] bg-[#eef5ea] p-5 text-left">
            <p className="text-sm font-medium text-[#36553c]">
              We currently deliver to your area.
            </p>

            <p className="mt-2 text-sm leading-6 text-[#4f6b55]">
              You&apos;re within our current delivery area for produce boxes,
              pantry staples and weekly groceries.
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="inline-flex rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Shop now
              </Link>

              <Link
                href="/planner"
                className="inline-flex rounded-full border border-[#c8d3c4] bg-white px-5 py-3 text-sm font-medium text-[#2f4635] transition hover:bg-[#f7fbf5]"
              >
                Explore the planner
              </Link>
            </div>
          </div>
        )}

        {postcodeStatus === "unavailable" && (
          <div className="mt-6 rounded-[24px] border border-[#e6dccf] bg-[#fbf7f1] p-5 text-left">
            <p className="text-sm font-medium text-[#243328]">
              We don&apos;t deliver to this postcode yet.
            </p>

            <p className="mt-2 text-sm leading-6 text-[#5f675c]">
              Local Pantry is currently delivering in ML8 and ML11 only.
              Register your interest and we&apos;ll let you know when delivery
              opens in your area.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={interestEmail}
                onChange={(e) => {
                  setInterestEmail(e.target.value);

                  if (interestStatus !== "idle") {
                    setInterestStatus("idle");
                    setInterestMessage("");
                  }
                }}
                placeholder="Enter your email"
                className="rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm text-[#243328] outline-none placeholder:text-[#8b8b7c]"
              />

              <button
                type="button"
                onClick={registerInterest}
                className="w-full rounded-full border border-[#243328] bg-white px-6 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f5f1ea] sm:w-auto"
              >
                Register interest
              </button>
            </div>

            {interestMessage && (
              <p
                className={`mt-3 text-sm ${
                  interestStatus === "error" ? "text-red-700" : "text-[#36553c]"
                }`}
              >
                {interestMessage}
              </p>
            )}

            <div className="mt-5">
              <Link
                href="/planner"
                className="inline-flex rounded-full border border-[#d9d1c4] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f5f1ea]"
              >
                Explore the planner
              </Link>
            </div>
          </div>
        )}

        {postcodeStatus === "invalid" && (
          <div className="mt-6 inline-flex rounded-full border border-[#e6dccf] bg-[#fbf7f1] px-4 py-2 text-sm text-[#7a6753]">
            Please enter a valid UK postcode, for example ML11 7AB.
          </div>
        )}
      </div>
    </section>
  );
}
