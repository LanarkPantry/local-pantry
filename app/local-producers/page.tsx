import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Local Producers | The Local Pantry",
  description:
    "Do you grow or make food locally? The Local Pantry would love to hear from local growers, makers and producers.",
};

export default function LocalProducersPage() {
  return (
    <main className="bg-[#f4efe9] text-[#243328]">
      <section className="px-4 py-12 sm:px-6 md:px-10 md:py-18">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
              Local producers
            </p>

            <h1 className="mt-4 font-serif text-[2.7rem] leading-[0.98] tracking-tight text-[#243328] sm:text-[4rem] md:text-[5rem]">
              Do you grow or make food locally?
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#667164] md:text-lg">
              We&apos;re building a network of local growers, makers and food
              producers across Lanark, Carluke and the surrounding area.
            </p>

            <p className="mt-4 max-w-2xl text-base leading-8 text-[#667164] md:text-lg">
              If you grow vegetables, keep bees, make preserves, bake, produce
              sauces, grow herbs, forage seasonal ingredients or create
              something else, we&apos;d love to hear what you&apos;re working
              on.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:hello@thelocalpantry.shop?subject=Local Producer Enquiry"
                className="rounded-full bg-[#243328] px-7 py-3 text-center text-sm font-medium text-white transition hover:opacity-90"
              >
                Tell us about your products
              </a>

              <Link
                href="/shop"
                className="rounded-full border border-[#d3cabd] bg-white px-7 py-3 text-center text-sm font-medium text-[#243328] transition hover:bg-[#f7f2eb]"
              >
                Visit the shop
              </Link>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] bg-[#e8dfd3] shadow-[0_12px_34px_rgba(36,51,40,0.08)]">
            <Image
              src="/images/local-producers/local-food-starts-local.png"
              alt="Local produce, preserves, bread, herbs and food from local growers and makers"
              width={1400}
              height={900}
              className="h-full w-full object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
            What we&apos;re interested in
          </p>

          <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[2rem] leading-tight text-[#243328] md:text-[3.2rem]">
            Small batches, seasonal produce and useful local food.
          </h2>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              "Fresh vegetables",
              "Fruit",
              "Honey",
              "Preserves and jams",
              "Chutneys",
              "Herbs",
              "Microgreens",
              "Eggs",
              "Garlic",
              "Baked goods",
              "Foraged ingredients",
              "Seasonal specials",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-5"
              >
                <p className="font-medium text-[#243328]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-3">
          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <h3 className="font-serif text-2xl text-[#243328]">
              Reach local households
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#667164]">
              Your products may be a good fit for customers already ordering
              fresh food through The Local Pantry.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <h3 className="font-serif text-2xl text-[#243328]">Start small</h3>

            <p className="mt-3 text-sm leading-7 text-[#667164]">
              You don&apos;t need to be a large supplier. We&apos;re happy to
              hear from small growers, makers and seasonal producers.
            </p>
          </div>

          <div className="rounded-[28px] bg-white p-6 shadow-[0_10px_28px_rgba(36,51,40,0.05)]">
            <h3 className="font-serif text-2xl text-[#243328]">
              Build local connections
            </h3>

            <p className="mt-3 text-sm leading-7 text-[#667164]">
              The aim is to gradually connect more local food producers with
              more local households.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#243328] px-4 py-14 text-white sm:px-6 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-serif text-3xl md:text-5xl">
            Tell us what you grow or make.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-white/75">
            Send a short email with your name, location, what you produce and
            anything else you think we should know.
          </p>

          <div className="mt-8">
            <a
              href="mailto:hello@thelocalpantry.shop?subject=Local Producer Enquiry"
              className="inline-flex rounded-full bg-white px-8 py-4 text-sm font-medium text-[#243328] transition hover:bg-[#f4efe9]"
            >
              Email The Local Pantry
            </a>
          </div>

          <p className="mt-5 text-sm text-white/55">
            hello@thelocalpantry.shop
          </p>
        </div>
      </section>
    </main>
  );
}
