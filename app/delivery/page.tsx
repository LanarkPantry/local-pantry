import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import PostcodeChecker from "../components/PostcodeChecker";

export default function DeliveryPage() {
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto max-w-7xl">
          <section className="overflow-hidden rounded-[34px] bg-[#243328] text-white shadow-[0_12px_34px_rgba(36,51,40,0.08)]">
            <div className="grid gap-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="p-6 md:p-10 lg:p-14">
                <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                  Local delivery
                </p>

                <h1 className="mt-4 max-w-3xl font-serif text-[2.7rem] leading-[0.98] tracking-tight text-white sm:text-[3.8rem] md:text-[5rem]">
                  Delivered around Lanark.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-white/78 md:text-lg">
                  Weekly fruit and veg boxes, optional regular staples and
                  simple meal support delivered locally every Tuesday and
                  Wednesday.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/shop"
                    className="rounded-full bg-white px-7 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
                  >
                    Choose your box
                  </Link>

                  <a
                    href="#postcode-checker"
                    className="rounded-full border border-white/25 bg-white/8 px-7 py-3 text-center text-sm font-medium text-white transition hover:bg-white/15"
                  >
                    Check your postcode
                  </a>
                </div>

                <p className="mt-5 text-xs leading-6 text-white/60">
                  Weekly or fortnightly. Pause, skip or cancel anytime.
                </p>
              </div>

              <div className="relative min-h-[320px] lg:min-h-full">
                <img
                  src="/images/home/local-delivery.jpg"
                  alt="Local Pantry delivery with fresh produce and pantry staples"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.44)_100%)]" />
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
            <section className="rounded-[32px] bg-white/82 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                Delivery area
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                Current local delivery.
              </h2>

              <p className="mt-5 text-sm leading-8 text-[#667164] md:text-base">
                Deliveries currently run across Lanark, Carluke and surrounding
                areas. The service will grow carefully so deliveries stay
                reliable.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "Lanark",
                  "Carluke",
                  "New Lanark",
                  "Kirkfieldbank",
                  "Crossford",
                  "Forth",
                  "Kirkmuirhill",
                  "Lesmahagow",
                ].map((area) => (
                  <div
                    key={area}
                    className="rounded-[22px] border border-[#ddd4c8] bg-[#f8f4ee]/85 px-4 py-3 text-sm text-[#4f5e52]"
                  >
                    {area}
                  </div>
                ))}
              </div>

              <p className="mt-6 text-sm leading-7 text-[#667164]">
                Nearby areas may also be covered. Use the postcode checker below
                if you are unsure.
              </p>
            </section>

            <section className="rounded-[32px] bg-[#efe7db] p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                How delivery works
              </p>

              <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                Simple weekly rhythm.
              </h2>

              <div className="mt-7 grid gap-4">
                <article className="rounded-[26px] bg-white/72 p-5">
                  <h3 className="font-serif text-[1.7rem] leading-tight text-[#243328]">
                    Choose your box
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Start with a weekly or fortnightly fruit and veg box.
                  </p>
                </article>

                <article className="rounded-[26px] bg-white/72 p-5">
                  <h3 className="font-serif text-[1.7rem] leading-tight text-[#243328]">
                    Add regular staples
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Add pasta, beans, grains, jars and extras only when you need
                    them.
                  </p>
                </article>

                <article className="rounded-[26px] bg-white/72 p-5">
                  <h3 className="font-serif text-[1.7rem] leading-tight text-[#243328]">
                    Receive local delivery
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Deliveries currently run every Tuesday and Wednesday.
                  </p>
                </article>
              </div>
            </section>
          </div>
        </div>
      </section>

      <section className="px-4 pb-12 sm:px-6 md:px-10 md:pb-16">
        <div className="mx-auto max-w-7xl">
          <section className="rounded-[32px] bg-white/82 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                  Flexibility
                </p>

                <h2 className="mt-3 font-serif text-[2rem] leading-tight text-[#243328] md:text-[3rem]">
                  Built for normal weeks.
                </h2>

                <p className="mt-5 text-sm leading-8 text-[#667164] md:text-base">
                  The aim is not to lock you into a complicated food plan. It is
                  to make it easier to keep useful food in the house.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <article className="rounded-[26px] bg-[#f8f4ee]/85 p-5">
                  <h3 className="font-serif text-[1.55rem] leading-tight text-[#243328]">
                    Pause anytime
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Skip a week when you are away or have enough food in.
                  </p>
                </article>

                <article className="rounded-[26px] bg-[#f8f4ee]/85 p-5">
                  <h3 className="font-serif text-[1.55rem] leading-tight text-[#243328]">
                    Add as needed
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Pantry items are optional one-off extras.
                  </p>
                </article>

                <article className="rounded-[26px] bg-[#f8f4ee]/85 p-5">
                  <h3 className="font-serif text-[1.55rem] leading-tight text-[#243328]">
                    Keep it simple
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#667164]">
                    Use the planner for realistic meal ideas, not rigid menus.
                  </p>
                </article>
              </div>
            </div>
          </section>
        </div>
      </section>

      <PostcodeChecker />

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-5xl">
          <section className="rounded-[32px] bg-[#243328] p-7 text-center text-white shadow-[0_12px_34px_rgba(36,51,40,0.08)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">
              Ready to start?
            </p>

            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2.1rem] leading-tight text-white md:text-[3.4rem]">
              Start with your fruit and veg box.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-8 text-white/74 md:text-base">
              Choose the box size that suits your week, then add regular staples
              when you need them.
            </p>

            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-white px-7 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
              >
                Choose your box
              </Link>

              <Link
                href="/planner"
                className="rounded-full border border-white/20 bg-white/5 px-7 py-3 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Open planner
              </Link>
            </div>
          </section>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
