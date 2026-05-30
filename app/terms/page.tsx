import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | The Local Pantry",
  description:
    "Terms and conditions for ordering from The Local Pantry, including delivery, substitutions, cancellations, refunds and allergen information.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#f7f2eb] px-4 py-10 text-[#243328] sm:px-6 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm tracking-[0.32em] text-[#60705f]">
          THE LOCAL PANTRY
        </Link>

        <section className="mt-8 rounded-[30px] border border-[#ddd4c8] bg-white/75 p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
            Customer information
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-tight md:text-5xl">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#5f675c]">
            Last updated: 30 May 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-[#4f5d50]">
            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                1. About us
              </h2>
              <p className="mt-3">
                This website is operated by The Local Pantry.
              </p>
              <p className="mt-3">
                Business address: Cedar House, Oakwood Mews, Lanark, ML11 7RH.
              </p>
              <p className="mt-3">
                Contact:{" "}
                <a
                  href="mailto:hello@thelocalpantry.shop"
                  className="underline underline-offset-4"
                >
                  hello@thelocalpantry.shop
                </a>
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                2. Using this website
              </h2>
              <p className="mt-3">
                By using this website or placing an order, you agree to these
                terms. Please read them before ordering. We may update these
                terms from time to time, and the version shown on this page will
                apply at the time you place your order.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                3. Our products
              </h2>
              <p className="mt-3">
                The Local Pantry sells fruit and vegetable boxes, pantry goods,
                dry goods, sauces, condiments and related food products. Product
                availability may vary depending on seasonality, supplier
                availability and local produce quality.
              </p>
              <p className="mt-3">
                Product images are for guidance only. Fresh produce boxes may
                vary from week to week.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                4. Prices and payment
              </h2>
              <p className="mt-3">
                Prices are shown in pounds sterling. The price payable is the
                price shown at checkout when you place your order. Delivery
                charges, where applicable, will be shown before payment.
              </p>
              <p className="mt-3">
                Payment must be completed before your order is accepted.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                5. Orders and acceptance
              </h2>
              <p className="mt-3">
                After placing an order, you may receive an order confirmation by
                email. This confirms that we have received your order. We
                reserve the right to refuse or cancel an order if an item is
                unavailable, there is an error in pricing or product
                information, or we are unable to fulfil the order.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                6. Substitutions
              </h2>
              <p className="mt-3">
                Fresh produce is seasonal and subject to availability. If an
                item is unavailable or not of suitable quality, we may
                substitute it with a similar item of equal or greater value.
              </p>
              <p className="mt-3">
                If you have allergies, dietary requirements or strong
                preferences, please tell us before ordering.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                7. Delivery and collection
              </h2>
              <p className="mt-3">
                Delivery days, delivery areas and collection options are shown
                on the website or at checkout. Please make sure your delivery
                details are accurate.
              </p>
              <p className="mt-3">
                If you are not home, we may leave your order in a safe place if
                one has been provided. Once an order has been delivered to the
                address or agreed safe place, responsibility for the order
                passes to you.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                8. Cancellations and changes
              </h2>
              <p className="mt-3">
                Because many of our products are fresh, perishable or prepared
                for a specific delivery cycle, cancellations and changes must be
                requested before the stated order cut-off.
              </p>
              <p className="mt-3">
                If your order has already been packed, prepared or dispatched,
                we may not be able to cancel or amend it.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                9. Refunds and problems with your order
              </h2>
              <p className="mt-3">
                If something arrives damaged, missing or not as expected, please
                contact us as soon as possible, ideally within 24 hours of
                delivery. Please include your order details and photos where
                relevant.
              </p>
              <p className="mt-3">
                Where appropriate, we may offer a replacement, credit or refund.
                This does not affect your statutory rights.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                10. Allergens and food information
              </h2>
              <p className="mt-3">
                Food allergen information should be checked before ordering and
                again when your order is delivered. If you have an allergy or
                intolerance, contact us before placing an order.
              </p>
              <p className="mt-3">
                Some products may be packed or handled in environments where
                allergens are present. We cannot guarantee that products are
                free from traces of allergens unless specifically stated.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                11. The meal planner
              </h2>
              <p className="mt-3">
                The Local Pantry meal planner is currently provided free of
                charge. It is intended to help customers plan meals, save recipe
                ideas and create shopping lists.
              </p>
              <p className="mt-3">
                Recipe suggestions are for general inspiration only. Please
                check ingredients, allergens, cooking times and food safety
                requirements before preparing any recipe.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                12. Website content
              </h2>
              <p className="mt-3">
                We try to keep product information, prices and availability
                accurate. However, errors may occasionally occur. We may correct
                errors, update content or change product availability at any
                time.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                13. Privacy
              </h2>
              <p className="mt-3">
                We use customer information to process orders, manage delivery,
                respond to enquiries and operate the website. Please see our
                Privacy Policy for more information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                14. Governing law
              </h2>
              <p className="mt-3">
                These terms are governed by the laws of Scotland. Any disputes
                will be subject to the courts of Scotland.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                15. Contact
              </h2>
              <p className="mt-3">
                Questions about these terms can be sent to{" "}
                <a
                  href="mailto:hello@thelocalpantry.shop"
                  className="underline underline-offset-4"
                >
                  hello@thelocalpantry.shop
                </a>
                .
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
