"use client";

import { useState } from "react";
import Image from "next/image";

const steps = [
  {
    title: "Choose your box",
    text: "Start with a fruit and veg box for the week ahead.",
  },
  {
    title: "Add extras",
    text: "Add jars, beans, pasta, grains or cupboard staples only when useful.",
  },
  {
    title: "Review your basket",
    text: "Your basket clearly separates the repeatable box from one-off extras.",
  },
  {
    title: "Delivered locally",
    text: "Your weekly food arrives ready for normal home cooking.",
  },
];

export default function SubscriptionFlowDemo() {
  const [step, setStep] = useState(0);

  return (
    <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <section className="rounded-[32px] border border-[#ddd4c8] bg-white/80 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
            How orders work
          </p>

          <h2 className="mt-3 max-w-3xl font-serif text-[1.9rem] leading-tight text-[#243328] md:text-[2.7rem]">
            Subscribe to regular fruit & veg. Add pantry extras only when you
            want them.
          </h2>

          <div className="mt-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="space-y-3">
              {steps.map((item, index) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    step === index
                      ? "border-[#243328] bg-[#f8f4ee]"
                      : "border-[#e5dccf] bg-white hover:bg-[#fbf8f4]"
                  }`}
                >
                  <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                    Step {index + 1}
                  </p>

                  <h3 className="mt-1 font-serif text-xl text-[#243328]">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#667164]">
                    {item.text}
                  </p>
                </button>
              ))}
            </div>

            <div className="rounded-[28px] border border-[#e5dccf] bg-[#f8f4ee] p-5">
              {step === 0 && (
                <div>
                  <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white">
                    <Image
                      src="/images/demo/local-delivery.jpg"
                      alt="Fruit and veg box delivery"
                      width={900}
                      height={600}
                      className="h-64 w-full object-cover"
                    />
                  </div>

                  <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-white p-5">
                    <span className="rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                      can repeat
                    </span>

                    <h3 className="mt-4 font-serif text-2xl text-[#243328]">
                      Fruit & veg box
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      The box is the regular part of the order. Choose weekly or
                      fortnightly.
                    </p>
                  </div>
                </div>
              )}

              {step === 1 && (
                <div className="grid gap-4 sm:grid-cols-2">
                  {["Jars", "Beans", "Pasta", "Grains"].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-[#ddd4c8] bg-white p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f4efe9] text-xl">
                        {item === "Jars" && "🥫"}
                        {item === "Beans" && "🫘"}
                        {item === "Pasta" && "🍝"}
                        {item === "Grains" && "🌾"}
                      </div>

                      <h3 className="mt-4 font-serif text-2xl text-[#243328]">
                        {item}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-[#667164]">
                        Optional one-off add-ons for the meals you want to cook.
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {step === 2 && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-2xl border border-[#ddd4c8] bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                      Repeats
                    </p>

                    <h3 className="mt-3 font-serif text-2xl text-[#243328]">
                      Fruit & veg box
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      This can repeat weekly or fortnightly.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#ddd4c8] bg-white p-5">
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                      One-off
                    </p>

                    <h3 className="mt-3 font-serif text-2xl text-[#243328]">
                      Pantry extras
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-[#667164]">
                      Extras only appear when you add them.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-[#243328] p-5 text-white md:col-span-2">
                    <p className="font-serif text-2xl">
                      Clear before checkout.
                    </p>

                    <p className="mt-2 text-sm leading-6 text-white/75">
                      No guessing what repeats. No accidental subscription to
                      cupboard items.
                    </p>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <div className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-white">
                    <Image
                      src="/images/demo/local-delivery.jpg"
                      alt="Local grocery delivery"
                      width={900}
                      height={600}
                      className="h-72 w-full object-cover"
                    />
                  </div>

                  <div className="mt-5 rounded-2xl bg-[#243328] p-5 text-white">
                    <h3 className="font-serif text-2xl">Delivered locally.</h3>

                    <p className="mt-2 text-sm leading-6 text-white/75">
                      Fresh produce as your regular base. Flexible extras when
                      you want them.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
