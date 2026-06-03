import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About | The Local Pantry",
  description:
    "Meet Ainsley, founder of The Local Pantry — local fruit, veg and useful pantry staples for easier weekly cooking.",
};

export default function AboutPage() {
  return (
    <main className="bg-[#f4efe9] text-[#243328]">
      <section className="px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="overflow-hidden rounded-[32px] bg-[#e8dfd3] shadow-[0_12px_34px_rgba(36,51,40,0.08)]">
            <Image
              src="/images/founder/ainsley.jpg"
              alt="Ainsley, founder of The Local Pantry"
              width={900}
              height={1100}
              className="h-full w-full object-cover"
              priority
            />
          </div>

          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              About The Local Pantry
            </p>

            <h1 className="mt-4 font-serif text-[2.7rem] leading-[0.98] tracking-tight text-[#243328] sm:text-[4rem] md:text-[5rem]">
              Useful food for normal weeks.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#667164] md:text-lg">
              Hi, I&apos;m Ainsley. I created The Local Pantry to make everyday
              cooking a bit easier for local households.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#667164] md:text-lg">
              I&apos;ve spent years working with food and people locally — from
              running a vegan café and meal delivery service to teaching yoga in
              Lanark. The Local Pantry brings together the parts I know people
              need most: fresh produce, useful staples and simple meal support.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/shop"
                className="rounded-full bg-[#243328] px-7 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                Choose your box
              </Link>

              <Link
                href="/local-producers"
                className="rounded-full border border-[#d3cabd] bg-white px-7 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb]"
              >
                Local producers
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl">
          <h2 className="font-serif text-3xl leading-tight text-[#243328] md:text-5xl">
            Why I started this
          </h2>

          <div className="mt-6 space-y-5 text-base leading-8 text-[#667164] md:text-lg">
            <p>
              I know how easy it is for food shopping to become another job:
              deciding what to buy, working out what to cook, buying too much,
              wasting bits, then doing it all again the next week.
            </p>

            <p>
              The Local Pantry is designed to make that feel simpler. Start with
              a fruit and veg box, add the staples you actually use, then use
              the meal planner when you want a bit of help turning it into
              dinners.
            </p>

            <p>
              It isn&apos;t about perfect food or complicated recipes. It&apos;s
              about having useful ingredients in the house and making normal
              weekday cooking easier.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <h3 className="font-serif text-2xl text-[#243328]">
              Fresh produce first
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#667164]">
              Fruit and veg boxes give the week a simple starting point.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <h3 className="font-serif text-2xl text-[#243328]">
              Staples that help
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#667164]">
              Pantry extras are there to support real meals, not fill cupboards
              with things you never use.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <h3 className="font-serif text-2xl text-[#243328]">
              Local where possible
            </h3>
            <p className="mt-3 text-sm leading-7 text-[#667164]">
              We&apos;re gradually building relationships with local growers,
              makers and producers as the service grows.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#243328] px-4 py-14 text-white sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-5xl">
            Start with one useful box.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75">
            Choose weekly or fortnightly delivery, add any pantry extras you
            need, and pause or cancel anytime.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/shop"
              className="inline-flex rounded-full bg-white px-8 py-4 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
            >
              Shop The Local Pantry
            </Link>

            <Link
              href="/local-producers"
              className="inline-flex rounded-full border border-white/20 bg-white/10 px-8 py-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/20"
            >
              Are you a local producer?
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
