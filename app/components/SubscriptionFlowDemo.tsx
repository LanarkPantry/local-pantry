"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

const steps = [
  {
    label: "Step 1",
    title: "Choose your weekly box",
    text: "Your fruit and veg box is the regular part of the order.",
  },
  {
    label: "Step 2",
    title: "Add pantry extras",
    text: "Gochujang, stock paste, beans, pasta and jars stay one-off.",
  },
  {
    label: "Step 3",
    title: "Your basket separates them",
    text: "Only the box repeats. Add-ons are flexible.",
  },
];

const addOns = [
  { name: "Gochujang", price: "£4.95" },
  { name: "Vegetable stock paste", price: "£5.50" },
  { name: "Rose harissa", price: "£5.25" },
];

export default function SubscriptionFlowDemo() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setStep((current) => (current + 1) % steps.length);
    }, 2300);

    return () => window.clearInterval(timer);
  }, []);

  const showAddOns = step >= 1;
  const showSummary = step >= 2;

  return (
    <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[32px] border border-[#ddd4c8] bg-white/80 shadow-[0_12px_34px_rgba(36,51,40,0.06)]">
          <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
            <div className="p-6 md:p-10">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                How it works
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                A weekly fruit & veg box, with flexible pantry add-ons.
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-8 text-[#667164] md:text-base">
                Keep your fresh produce coming regularly, then add the extras
                you need that week. Your basket keeps the repeat box separate
                from the one-off items.
              </p>

              <div className="mt-7 space-y-3">
                {steps.map((item, index) => {
                  const active = step === index;

                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => setStep(index)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        active
                          ? "border-[#243328] bg-[#f8f4ee]"
                          : "border-[#e5dccf] bg-white/70 hover:bg-[#fbf8f4]"
                      }`}
                    >
                      <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                        {item.label}
                      </p>

                      <p className="mt-1 font-serif text-xl text-[#243328]">
                        {item.title}
                      </p>

                      <p className="mt-2 text-sm leading-6 text-[#667164]">
                        {item.text}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Build your basket
                </Link>

                <Link
                  href="/planner"
                  className="rounded-full border border-[#d3cabd] bg-white/70 px-6 py-3 text-sm text-[#243328] transition hover:bg-white"
                >
                  Explore recipes
                </Link>
              </div>
            </div>

            <div className="bg-[#f4efe9] p-5 md:p-8">
              <div className="mx-auto max-w-md rounded-[30px] border border-[#ddd4c8] bg-white p-5 shadow-[0_18px_40px_rgba(36,51,40,0.08)]">
                <div className="flex items-center justify-between gap-4 border-b border-[#eee6dc] pb-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                      Your basket
                    </p>
                    <h3 className="mt-1 font-serif text-2xl text-[#243328]">
                      Week ahead
                    </h3>
                  </div>

                  <motion.div
                    key={step}
                    initial={{ scale: 0.94, opacity: 0.6 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.22 }}
                    className="rounded-full bg-[#243328] px-3 py-1 text-xs text-white"
                  >
                    {showSummary ? "Ready" : "Building"}
                  </motion.div>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-[#243328]">
                    Repeating box
                  </p>

                  <motion.div
                    layout
                    className="mt-3 rounded-2xl border border-[#d8cfbf] bg-[#f8f4ee] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-serif text-xl text-[#243328]">
                          Weekly Produce Box
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#667164]">
                          Fruit and veg for normal weekly cooking.
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-[#243328] px-3 py-1 text-xs text-white">
                        repeats
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {["Potatoes", "Carrots", "Apples", "Greens"].map(
                        (item) => (
                          <span
                            key={item}
                            className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1 text-xs text-[#5f675c]"
                          >
                            {item}
                          </span>
                        ),
                      )}
                    </div>
                  </motion.div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-[#243328]">
                      One-off add-ons
                    </p>

                    <AnimatePresence>
                      {showAddOns && (
                        <motion.span
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 6 }}
                          className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1 text-xs text-[#5f675c]"
                        >
                          added this week only
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="mt-3 space-y-3">
                    <AnimatePresence>
                      {showAddOns ? (
                        addOns.map((item, index) => (
                          <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 18 }}
                            transition={{ duration: 0.25, delay: index * 0.08 }}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-[#e7dfd3] bg-white p-4"
                          >
                            <div>
                              <p className="text-sm font-medium text-[#243328]">
                                {item.name}
                              </p>
                              <p className="mt-1 text-xs text-[#667164]">
                                One-off pantry extra
                              </p>
                            </div>

                            <p className="text-sm font-medium text-[#243328]">
                              {item.price}
                            </p>
                          </motion.div>
                        ))
                      ) : (
                        <motion.div
                          key="empty-addons"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="rounded-2xl border border-dashed border-[#d8cfbf] bg-white/60 p-4 text-sm leading-6 text-[#667164]"
                        >
                          Add jars, pastes, beans or cupboard staples only when
                          you want them.
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <motion.div
                  layout
                  className="mt-6 rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4"
                >
                  <div className="flex items-center justify-between text-sm text-[#667164]">
                    <span>Repeating</span>
                    <span>Weekly Produce Box</span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm text-[#667164]">
                    <span>One-off extras</span>
                    <span>{showAddOns ? "3 items" : "0 items"}</span>
                  </div>

                  <AnimatePresence>
                    {showSummary && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="mt-4 rounded-xl bg-[#243328] px-4 py-3 text-sm text-white"
                      >
                        Only your box repeats. Pantry extras stay flexible.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
