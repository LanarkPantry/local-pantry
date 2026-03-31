"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useCart } from "./cart-context";

const DELIVERY_OUTWARD_CODES = [
  "G1",
  "G2",
  "G3",
  "G4",
  "G11",
  "G12",
  "G13",
  "G20",
  "G31",
  "G41",
  "G42",
  "G43",
  "G44",
  "G51",
  "G52",
  "G53",
];

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

export default function HomePage() {
  const { cart } = useCart();

  const [postcode, setPostcode] = useState("");
  const [postcodeStatus, setPostcodeStatus] = useState<
    "idle" | "available" | "unavailable" | "invalid"
  >("idle");

  const totalItems = useMemo(() => cart.length, [cart]);

  const checkPostcode = () => {
    if (!postcode.trim()) {
      setPostcodeStatus("invalid");
      return;
    }

    if (!isValidUkPostcode(postcode)) {
      setPostcodeStatus("invalid");
      return;
    }

    const outwardCode = getOutwardCode(postcode);

    if (DELIVERY_OUTWARD_CODES.includes(outwardCode)) {
      setPostcodeStatus("available");
    } else {
      setPostcodeStatus("unavailable");
    }
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="sticky top-0 z-30 border-b border-[#e6ddd2] bg-[#f4efe9]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm text-[#243328] underline underline-offset-4"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Shop
            </Link>

            <Link
              href="/recipes"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Recipes
            </Link>

            <Link
              href="/basket"
              className="text-sm text-[#4f5e52] hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>

          <Link
            href="/basket"
            className="hidden rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2] md:inline-flex"
          >
            View basket{totalItems > 0 ? ` (${totalItems})` : ""}
          </Link>
        </div>
      </header>

      <section className="relative min-h-[78vh] overflow-hidden">
        <img
          src="/hero.jpg"
          alt="The Local Pantry interior"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-end px-6 pb-14 pt-16 md:px-10 md:pb-20">
          <div className="max-w-3xl text-white">
            <p className="text-sm uppercase tracking-[0.25em] text-white/80">
              Carefully chosen, week to week
            </p>

            <h1 className="mt-4 font-serif text-5xl leading-none tracking-tight text-white/95 md:text-7xl">
              The fresh part of your weekly shop, done well.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/90 md:text-xl">
              Fresh produce and a small selection of pantry essentials, chosen
              carefully each week.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-white px-6 py-3 text-sm font-medium text-[#243328] shadow-sm transition hover:bg-[#f5f1ea]"
              >
                Shop the range
              </Link>

              <Link
                href="/basket"
                className="rounded-full border border-white/40 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                View basket{totalItems > 0 ? ` (${totalItems})` : ""}
              </Link>
            </div>

            <p className="mt-5 text-sm text-white/75">
              Weekly delivery across selected local areas.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 pt-16 md:px-10 md:pb-24 md:pt-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Fresh produce
            </p>
            <h2 className="mt-3 font-serif text-3xl">Chosen each week</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              Fruit and veg chosen for quality and how you actually cook.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry essentials
            </p>
            <h2 className="mt-3 font-serif text-3xl">Simple additions</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              A small selection of pantry essentials and useful extras, kept
              simple and chosen well.
            </p>
          </div>

          <div className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-6">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Easy each week
            </p>
            <h2 className="mt-3 font-serif text-3xl">Delivered simply</h2>
            <p className="mt-3 leading-7 text-[#5f675c]">
              Build your basket in a few minutes and keep the weekly shop
              straightforward.
            </p>
          </div>
        </div>
      </section>

      <section className="px-6 pb-16 md:px-10 md:pb-24">
        <div className="mx-auto max-w-4xl rounded-[30px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 text-center shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
          <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
            Delivery area
          </p>

          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            Check your postcode
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-[#667164]">
            We currently deliver to selected areas and are expanding carefully.
            Enter your postcode to see whether delivery is available where you
            are.
          </p>

          <div className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
            <input
              value={postcode}
              onChange={(e) => {
                setPostcode(e.target.value);
                if (postcodeStatus !== "idle") setPostcodeStatus("idle");
              }}
              onBlur={() => {
                if (postcode.trim()) {
                  setPostcode(formatPostcode(postcode));
                }
              }}
              placeholder="Enter postcode"
              className="flex-1 rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm uppercase tracking-[0.08em] outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-[#8b8b7c]"
            />
            <button
              onClick={checkPostcode}
              className="rounded-full bg-[#2f4635] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#243328]"
            >
              Check
            </button>
          </div>

          {postcodeStatus === "available" && (
            <div className="mt-6 inline-flex rounded-full border border-[#c8d3c4] bg-[#eef5ea] px-4 py-2 text-sm text-[#36553c]">
              Great news — we currently deliver to your area.
            </div>
          )}

          {postcodeStatus === "unavailable" && (
            <div className="mt-6 inline-flex rounded-full border border-[#ead3cf] bg-[#fff3f1] px-4 py-2 text-sm text-[#9a4f42]">
              Not available yet — we’re expanding carefully into new areas.
            </div>
          )}

          {postcodeStatus === "invalid" && (
            <div className="mt-6 inline-flex rounded-full border border-[#e6dccf] bg-[#fbf7f1] px-4 py-2 text-sm text-[#7a6753]">
              Please enter a valid UK postcode, for example G12 8QQ.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
