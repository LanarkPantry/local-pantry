import Link from "next/link";

export const metadata = {
  title: "Your Privacy | The Local Pantry",
  description:
    "How The Local Pantry collects, uses and protects customer information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#f7f2eb] px-4 py-10 text-[#243328] sm:px-6 md:px-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm tracking-[0.32em] text-[#60705f]">
          THE LOCAL PANTRY
        </Link>

        <section className="mt-8 rounded-[30px] border border-[#ddd4c8] bg-white/80 p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-10">
          <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
            Your information
          </p>

          <h1 className="mt-3 font-serif text-4xl leading-tight text-[#243328] md:text-5xl">
            Your Privacy
          </h1>

          <p className="mt-4 text-sm text-[#5f675c]">Last updated: June 2026</p>

          <div className="mt-8 space-y-8 text-sm leading-7 text-[#4f5d50]">
            <section className="rounded-[24px] bg-[#f7f2eb] p-5 md:p-6">
              <p className="font-serif text-2xl leading-snug text-[#243328]">
                We believe your information belongs to you.
              </p>

              <p className="mt-4">
                We only collect the information we need to manage your account,
                process orders, deliver your shopping and provide features such
                as meal planning and saved recipes.
              </p>

              <p className="mt-3 font-medium text-[#243328]">
                We never sell your personal information.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">Who we are</h2>

              <p className="mt-3">
                The Local Pantry is responsible for the personal information
                collected through this website.
              </p>

              <p className="mt-3">
                The Local Pantry
                <br />
                Cedar House
                <br />
                Oakwood Mews
                <br />
                Lanark
                <br />
                ML11 7RH
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
                What information we collect
              </h2>

              <p className="mt-3">
                Depending on how you use the website, we may collect:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Your name</li>
                <li>Your email address</li>
                <li>Your delivery address</li>
                <li>Your telephone number, if you provide one</li>
                <li>Your order history</li>
                <li>Your account details</li>
                <li>Saved meal plans, recipes and shopping lists</li>
                <li>Messages you send to us</li>
                <li>Basic website usage information</li>
              </ul>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                Why we collect it
              </h2>

              <p className="mt-3">We use your information to:</p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Deliver your orders</li>
                <li>Manage your account</li>
                <li>Process payments securely</li>
                <li>Provide customer support</li>
                <li>Save your planner and recipe information</li>
                <li>Send important service updates about your orders</li>
                <li>Improve the website and customer experience</li>
                <li>Meet legal, tax and accounting requirements</li>
              </ul>

              <p className="mt-3">
                In legal terms, we use your information where it is needed to
                provide the service you have asked for, where we have a legal
                obligation, where we have a legitimate business reason, or where
                you have given consent.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">Payments</h2>

              <p className="mt-3">
                Payments are processed securely by Stripe. We do not store your
                full payment card details on our website.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                Who helps us run the service
              </h2>

              <p className="mt-3">
                We work with trusted providers that help us operate The Local
                Pantry. These providers only process information where necessary
                to provide their services.
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Stripe for secure payment processing</li>
                <li>Supabase for customer accounts and data storage</li>
                <li>Vercel for website hosting and performance</li>
                <li>Resend for service emails and notifications</li>
                <li>Google Workspace and Gmail for business email</li>
                <li>GitHub for website development and maintenance</li>
              </ul>

              <p className="mt-3">
                We may also share information if required by law or if needed to
                protect our legal rights.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                Marketing emails
              </h2>

              <p className="mt-3">
                If you choose to receive updates from us, we may occasionally
                send emails about seasonal produce, new products, recipes,
                service updates or special offers.
              </p>

              <p className="mt-3">
                You can unsubscribe from marketing emails at any time.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">Cookies</h2>

              <p className="mt-3">
                We use cookies and similar technologies to keep the website
                working properly, maintain login sessions, remember preferences,
                understand how the website is used and improve performance.
              </p>

              <p className="mt-3">
                Some of this may be provided through the technical services we
                use to run the website.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                How long we keep information
              </h2>

              <p className="mt-3">
                We keep personal information only for as long as necessary to
                provide our services, maintain business records and meet legal,
                tax and accounting requirements.
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">
                Your rights
              </h2>

              <p className="mt-3">
                Under UK data protection law, you may have the right to:
              </p>

              <ul className="mt-3 list-disc space-y-2 pl-6">
                <li>Access the personal information we hold about you</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to certain uses of your information</li>
                <li>Request a copy of your information</li>
              </ul>

              <p className="mt-3">
                To ask about any of these rights, email{" "}
                <a
                  href="mailto:hello@thelocalpantry.shop"
                  className="underline underline-offset-4"
                >
                  hello@thelocalpantry.shop
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="font-serif text-2xl text-[#243328]">Contact us</h2>

              <p className="mt-3">
                If you have any questions about privacy or how we handle your
                information, please contact:
              </p>

              <p className="mt-3">
                <a
                  href="mailto:hello@thelocalpantry.shop"
                  className="underline underline-offset-4"
                >
                  hello@thelocalpantry.shop
                </a>
              </p>

              <p className="mt-3">
                If you are unhappy with how your information is handled, you
                also have the right to complain to the UK Information
                Commissioner's Office.
              </p>
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
