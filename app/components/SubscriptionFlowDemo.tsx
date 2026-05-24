"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const selectedMeals = [
  {
    name: "Rose Harissa Butter Beans",
    image: "/images/demo/rose-harissa.png",
  },
  {
    name: "Sorrel Walnut Bucatini",
    image: "/images/demo/sorrel-walnut-pesto.png",
  },
];

const pantryItems = [
  {
    name: "Casarecce",
    image: "/images/demo/casarecce.jpg",
  },
  {
    name: "Giant Couscous",
    image: "/images/demo/giant-couscous.jpg",
  },
  {
    name: "Rose Harissa",
    image: "/images/demo/rose-harissa.png",
  },
  {
    name: "Sorrel Walnut Pesto",
    image: "/images/demo/sorrel-walnut-pesto.png",
  },
];

export default function SubscriptionFlowDemo() {
  return (
    <section className="overflow-hidden rounded-[32px] border border-[#d8d2c8] bg-[#f8f5ef] p-6 md:p-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-[#7b7b6f]">
            How it works
          </p>

          <h2 className="mb-4 text-3xl font-medium tracking-tight text-[#243328] md:text-5xl">
            Build meals. We build the pantry.
          </h2>

          <p className="text-base leading-relaxed text-[#4e5a51] md:text-lg">
            Choose recipes for the week and your basket updates automatically
            with the pantry ingredients and fresh produce you need.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* STEP 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-[28px] bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#7a7a6d]">Step 1</span>

              <div className="rounded-full bg-[#edf2eb] px-3 py-1 text-xs font-medium text-[#243328]">
                Choose meals
              </div>
            </div>

            <div className="space-y-4">
              {selectedMeals.map((meal, index) => (
                <motion.div
                  key={meal.name}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.2,
                    duration: 0.45,
                  }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 rounded-2xl border border-[#ece7dd] bg-[#faf8f4] p-3"
                >
                  <div className="relative h-20 w-20 overflow-hidden rounded-xl">
                    <Image
                      src={meal.image}
                      alt={meal.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-[#243328]">
                      {meal.name}
                    </p>

                    <p className="mt-1 text-xs text-[#70756d]">
                      Added to weekly plan
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* STEP 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-[28px] bg-white p-5 shadow-sm"
          >
            <div className="mb-5 flex items-center justify-between">
              <span className="text-sm font-medium text-[#7a7a6d]">Step 2</span>

              <div className="rounded-full bg-[#edf2eb] px-3 py-1 text-xs font-medium text-[#243328]">
                Pantry builds
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {pantryItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: index * 0.12,
                    duration: 0.4,
                  }}
                  viewport={{ once: true }}
                  className="overflow-hidden rounded-2xl border border-[#ece7dd] bg-[#faf8f4]"
                >
                  <div className="relative aspect-square">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-3">
                    <p className="text-xs font-medium text-[#243328]">
                      {item.name}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* STEP 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
            className="overflow-hidden rounded-[28px] bg-[#243328] text-white shadow-sm"
          >
            <div className="relative min-h-full">
              <div className="absolute inset-0">
                <Image
                  src="/images/demo/local-delivery.jpg"
                  alt="Local Pantry delivery"
                  fill
                  className="object-cover opacity-45"
                />
              </div>

              <div className="relative z-10 flex h-full flex-col justify-between p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white/70">
                    Step 3
                  </span>

                  <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-sm">
                    Delivered locally
                  </div>
                </div>

                <div className="mt-24">
                  <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="rounded-3xl bg-white/10 p-5 backdrop-blur-md"
                  >
                    <p className="mb-2 text-2xl font-medium">
                      Your week arrives ready to cook.
                    </p>

                    <p className="text-sm leading-relaxed text-white/80">
                      Fresh produce on subscription. Pantry ingredients only
                      when needed. Less waste. Less mental load.
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
