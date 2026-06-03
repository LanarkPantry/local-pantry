import Link from "next/link";

export const metadata = {
  title: "Local Producers | The Local Pantry",
  description:
    "Are you a local grower, maker, baker or producer? We'd love to hear from you.",
};

export default function LocalProducersPage() {
  return (
    <main className="bg-[#f7f3ee]">
      {/* Hero */}
      <section className="border-b border-[#ddd4c8] bg-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <h1 className="font-serif text-5xl text-[#243328]">
            Local Producers
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#4b5b4d]">
            The Local Pantry is about more than delivering fruit and vegetables.
            We want to help connect local households with great food from local
            growers, makers and producers whenever we can.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <div className="rounded-[32px] border border-[#ddd4c8] bg-white p-8 sm:p-10">
            <h2 className="font-serif text-3xl text-[#243328]">
              Do you grow or make food locally?
            </h2>

            <p className="mt-4 leading-8 text-[#4b5b4d]">
              We'd love to hear from you.
            </p>

            <p className="mt-4 leading-8 text-[#4b5b4d]">
              Whether you grow vegetables, keep bees, make preserves, bake,
              produce sauces, grow herbs, forage seasonal ingredients or create
              something else entirely, we're always interested in discovering
              local food and drink producers.
            </p>

            <p className="mt-4 leading-8 text-[#4b5b4d]">
              We're particularly interested in producers based in Lanark,
              Carluke, Forth, Carstairs and the surrounding area.
            </p>
          </div>
        </div>
      </section>

      {/* Examples */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-serif text-3xl text-[#243328] text-center">
            Examples of products we're interested in
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
              "Seasonal specialities",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[24px] border border-[#ddd4c8] bg-[#f7f3ee] p-5 text-center"
              >
                <p className="font-medium text-[#243328]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Work With Us */}
      <section>
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
          <h2 className="font-serif text-3xl text-[#243328] text-center">
            Why get in touch?
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <div className="rounded-[24px] border border-[#ddd4c8] bg-white p-6">
              <h3 className="font-serif text-2xl text-[#243328]">
                Reach local customers
              </h3>

              <p className="mt-3 leading-7 text-[#4b5b4d]">
                We may be able to introduce your products to households already
                ordering through The Local Pantry.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#ddd4c8] bg-white p-6">
              <h3 className="font-serif text-2xl text-[#243328]">
                Build local connections
              </h3>

              <p className="mt-3 leading-7 text-[#4b5b4d]">
                We're passionate about supporting local food producers and
                helping more people discover what's available on their doorstep.
              </p>
            </div>

            <div className="rounded-[24px] border border-[#ddd4c8] bg-white p-6">
              <h3 className="font-serif text-2xl text-[#243328]">
                Start a conversation
              </h3>

              <p className="mt-3 leading-7 text-[#4b5b4d]">
                Even if you're only producing small quantities, we'd still love
                to hear what you're working on.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#243328] text-white">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
          <h2 className="font-serif text-4xl">
            Tell us about what you produce
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-white/80">
            Send us a few details and we'll get back to you if we think there
            could be a good fit.
          </p>

          <div className="mt-10">
            <a
              href="mailto:hello@thelocalpantry.shop?subject=Local Producer Enquiry"
              className="inline-flex items-center rounded-full bg-white px-8 py-4 font-medium text-[#243328] transition hover:opacity-90"
            >
              Contact Us
            </a>
          </div>

          <p className="mt-6 text-sm text-white/60">
            hello@thelocalpantry.shop
          </p>
        </div>
      </section>

      {/* Back Link */}
      <section className="bg-white">
        <div className="mx-auto max-w-4xl px-4 py-8 text-center sm:px-6">
          <Link
            href="/"
            className="text-[#243328] underline underline-offset-4"
          >
            Back to The Local Pantry
          </Link>
        </div>
      </section>
    </main>
  );
}
