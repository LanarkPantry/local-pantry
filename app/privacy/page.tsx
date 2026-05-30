import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | The Local Pantry",
  description:
    "Privacy Policy explaining how The Local Pantry collects, uses and protects personal information.",
};

export default function PrivacyPage() {
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
            Privacy Policy
          </h1>

          <p className="mt-4 text-sm leading-7 text-[#5f675c]">
            Last updated: 30 May 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-[#4f5d50]">
            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                1. Who we are
              </h2>

              <p className="mt-3">
                The Local Pantry is responsible for the personal information
                collected through this website.
              </p>

              <p className="mt-3">
                Address: Cedar House, Oakwood Mews, Lanark, ML11 7RH
              </p>

              <p className="mt-3">
                Email:{" "}
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
                2. Information we collect
              </h2>

              <p className="mt-3">
                Depending on how you use the website, we may collect:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Name</li>
                <li>Email address</li>
                <li>Delivery address</li>
                <li>Phone number</li>
                <li>Order history</li>
                <li>Account information</li>
                <li>Planner preferences and saved recipes</li>
                <li>Website usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                3. How we use your information
              </h2>

              <p className="mt-3">We use your information to:</p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Process and deliver orders</li>
                <li>Manage customer accounts</li>
                <li>Provide customer support</li>
                <li>Operate the meal planner and recipe features</li>
                <li>Improve the website and services</li>
                <li>Send service-related communications</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                4. Legal basis for processing
              </h2>

              <p className="mt-3">
                We process personal information where necessary to:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Perform a contract with you</li>
                <li>Comply with legal obligations</li>
                <li>Pursue legitimate business interests</li>
                <li>Act on your consent where required</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                5. Payments
              </h2>

              <p className="mt-3">
                Payments are processed through secure third-party payment
                providers. We do not store full payment card information on our
                systems.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                6. Delivery information
              </h2>

              <p className="mt-3">
                Delivery addresses and contact details are used solely for
                fulfilling orders and providing customer support related to
                those orders.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                7. Planner accounts and saved data
              </h2>

              <p className="mt-3">
                If you create an account, we may store planner information such
                as saved recipes, meal plans and shopping lists so that these
                features remain available when you return.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                8. Marketing communications
              </h2>

              <p className="mt-3">
                If you choose to receive updates, we may send occasional emails
                about products, seasonal boxes, recipes and service updates.
              </p>

              <p className="mt-3">
                You can unsubscribe from marketing communications at any time.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                9. Sharing information
              </h2>

              <p className="mt-3">We do not sell personal information.</p>

              <p className="mt-3">
                We may share information with trusted service providers where
                necessary to operate the business, including:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Payment processors</li>
                <li>Website hosting providers</li>
                <li>Email service providers</li>
                <li>Delivery partners</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                10. Data retention
              </h2>

              <p className="mt-3">
                We retain personal information only for as long as necessary to
                provide services, maintain business records and comply with
                legal obligations.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                11. Security
              </h2>

              <p className="mt-3">
                We take reasonable technical and organisational measures to
                protect personal information from loss, misuse or unauthorised
                access.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                12. Cookies and analytics
              </h2>

              <p className="mt-3">
                The website may use cookies and analytics tools to understand
                how visitors use the site and to improve performance and user
                experience.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                13. Your rights
              </h2>

              <p className="mt-3">
                Under UK data protection law, you may have the right to:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of information</li>
                <li>Object to certain processing activities</li>
                <li>Request a copy of your information</li>
              </ul>

              <p className="mt-3">
                To exercise these rights, contact us using the details below.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                14. Contact us
              </h2>

              <p className="mt-3">
                If you have questions about this Privacy Policy or how your
                information is handled, please contact:
              </p>

              <p className="mt-3">
                The Local Pantry
                <br />
                Cedar House, Oakwood Mews
                <br />
                Lanark
                <br />
                ML11 7RH
              </p>

              <p className="mt-3">
                <a
                  href="mailto:hello@thelocalpantry.shop"
                  className="underline underline-offset-4"
                >
                  hello@thelocalpantry.shop
                </a>
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
