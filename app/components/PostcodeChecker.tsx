function PostcodeChecker() {
  const [postcode, setPostcode] = useState("");
  const [result, setResult] = useState<"idle" | "yes" | "no">("idle");

  const DELIVERY_AREAS = ["G74", "G75", "G76"]; // 👈 CHANGE THIS

  const normalise = (value: string) =>
    value.toUpperCase().replace(/\s+/g, "").trim();

  const getOutward = (value: string) => {
    const cleaned = normalise(value);
    const match = cleaned.match(/^([A-Z]{1,2}\d[A-Z\d]?)/);
    return match ? match[1] : "";
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const outward = getOutward(postcode);

    if (DELIVERY_AREAS.includes(outward)) {
      setResult("yes");
    } else {
      setResult("no");
    }
  };

  return (
    <section className="mt-12 rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 md:p-8">
      <h2 className="font-serif text-3xl">Check delivery</h2>

      <p className="mt-3 text-[#667164]">
        We currently deliver to selected areas and expand gradually.
      </p>

      <form onSubmit={handleCheck} className="mt-5 flex gap-3">
        <input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder="Enter postcode"
          className="flex-1 rounded-xl border px-4 py-3"
        />

        <button className="rounded-xl bg-[#2f4635] px-5 py-3 text-white">
          Check
        </button>
      </form>

      {result === "yes" && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <p>We currently deliver to your area.</p>

          <Link href="/shop" className="mt-3 inline-block underline">
            Go to shop
          </Link>
        </div>
      )}

      {result === "no" && (
        <div className="mt-4 rounded-xl bg-white p-4">
          <p>We don’t deliver to this postcode yet.</p>

          <p className="mt-2 text-[#667164]">
            We’re expanding delivery gradually based on local demand. Register
            your interest so we know which areas to open next.
          </p>

          <div className="mt-4 flex gap-3">
            <input
              placeholder="Your email"
              className="flex-1 rounded-xl border px-4 py-3"
            />
            <button className="rounded-xl border px-4 py-3">Register</button>
          </div>
        </div>
      )}
    </section>
  );
}
