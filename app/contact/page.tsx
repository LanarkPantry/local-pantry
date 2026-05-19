import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <SiteHeader />

      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[32px] border border-[#ddd4c8] bg-white/80 p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)] md:p-10">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Contact
            </p>

            <h1 className="mt-3 font-serif text-[2.5rem] leading-tight md:text-[4rem]">
              Questions, feedback or local delivery enquiries.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#667164]">
              The Local Pantry is currently testing local grocery delivery and
              meal planning in ML11 and nearby areas. Get in touch about
              delivery, tester access, pantry requests or local collaborations.
            </p>

            <div className="mt-8 rounded-[26px] border border-[#ddd4c8] bg-[#f8f4ee] p-5 md:p-6">
              <p className="text-sm font-medium text-[#243328]">Email</p>

              <a
                href="mailto:hello@thelocalpantry.shop"
                className="mt-2 block break-words font-serif text-2xl text-[#243328] underline decoration-[#c8bba8] underline-offset-4 md:text-3xl"
              >
                hello@thelocalpantry.shop
              </a>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Delivery area
                </p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Currently testing deliveries in ML11 and nearby Lanarkshire
                  areas.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#ddd4c8] bg-white/70 p-5">
                <p className="text-sm font-medium text-[#243328]">Best for</p>

                <p className="mt-2 text-sm leading-7 text-[#667164]">
                  Delivery questions, tester feedback, product requests and
                  local supplier conversations.
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/planner"
                className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
              >
                Open planner
              </Link>

              <Link
                href="/shop"
                className="rounded-full border border-[#d6cec2] bg-[#f7f2eb] px-6 py-3 text-sm text-[#243328] transition hover:bg-white"
              >
                Browse shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter hideContactEmail />
    </main>
  );
}
