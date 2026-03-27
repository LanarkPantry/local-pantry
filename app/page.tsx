"use client";

import { useMemo, useState } from "react";

type ShopItem = {
  name: string;
  price: number;
  image: string;
};

type BoxItem = ShopItem & {
  contents: string[];
  urgency: string;
  cta: string;
};

type RecipeItem = {
  title: string;
  image: string;
  recipe: string;
  ideas: string[];
};

type ProduceIdea = {
  title: string;
  text: string;
};

export default function LocalPantryWebsite() {
  const [postcode, setPostcode] = useState("");
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);
  const [cart, setCart] = useState<ShopItem[]>(() => []);
  const [isSubscription, setIsSubscription] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [isLoadingCheckout, setIsLoadingCheckout] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const addOns: ShopItem[] = [
    {
      name: "Sorrel & Walnut Pesto",
      price: 4.5,
      image: "/sorrel-walnut-pesto.png",
    },
    {
      name: "Rose Harissa",
      price: 5.25,
      image: "/rose-harissa.png",
    },
    {
      name: "Salted Caramel Sauce",
      price: 5,
      image: "/salted-caramel.png",
    },
    {
      name: "Dark Chocolate & Hazelnut Spread",
      price: 5,
      image: "/dark-chocolate.png",
    },
  ];

  const boxes: BoxItem[] = [
    {
      name: "Weekly Harvest",
      price: 20,
      image: "/weekly-harvest-box.png",
      contents: ["Carrots", "Potatoes", "Leeks", "Lettuce", "Onions", "Apples"],
      urgency: "Limited slots available this week.",
      cta: "Subscribe Weekly",
    },
    {
      name: "Family Harvest",
      price: 30,
      image: "/family-harvest-box.png",
      contents: ["Carrots", "Potatoes", "Tomatoes", "Apples", "Kale", "Mushrooms"],
      urgency: "Only 8 boxes left for this week",
      cta: "Choose Family Harvest",
    },
  ];

  const jarRecipes: RecipeItem[] = [
    {
      title: "Sorrel & Walnut Pesto",
      image: "/pesto-recipe.jpg",
      recipe:
        "Toss through hot pasta with roasted veg and a splash of pasta water for an easy, vibrant supper.",
      ideas: ["Stir into warm potatoes", "Spread on toast with tomatoes", "Add to grain bowls"],
    },
    {
      title: "Rose Harissa",
      image: "/harissa-recipe.jpg",
      recipe:
        "Roast carrots and chickpeas with rose harissa, olive oil and a touch of honey for a simple traybake.",
      ideas: ["Mix into yoghurt", "Brush onto roast veg", "Add to tomato sauces"],
    },
    {
      title: "Salted Caramel Sauce",
      image: "/caramel-recipe.jpg",
      recipe:
        "Drizzle over porridge with banana and a pinch of sea salt for a soft, indulgent breakfast.",
      ideas: ["Pour over pancakes", "Swirl into brownies", "Serve with apples"],
    },
    {
      title: "Dark Chocolate & Hazelnut Spread",
      image: "/chocolate-recipe.jpg",
      recipe:
        "Spread onto toasted sourdough and top with sliced strawberries or banana for an easy sweet treat.",
      ideas: ["Fill crepes", "Stir into oats", "Dip fruit"],
    },
  ];

  const produceIdeas: ProduceIdea[] = [
    {
      title: "Roast Tin Supper",
      text: "Roast potatoes, carrots and onions, then finish with pesto or harissa for an easy midweek dinner.",
    },
    {
      title: "Seasonal Soup",
      text: "Blend softer vegetables with stock and herbs, then serve with toast and a swirl of pesto.",
    },
    {
      title: "Fruit Breakfasts",
      text: "Use bananas, apples, oranges and berries for smoothies, porridge toppings or quick fruit salads.",
    },
  ];

  const checkPostcode = () => {
    if (postcode.trim().toLowerCase().startsWith("g")) {
      setPostcodeValid(true);
    } else {
      setPostcodeValid(false);
    }
  };

  const addToCart = (item: ShopItem) => {
    setCart((current) => {
      const updated = [...current, item];
      console.log("cart now:", updated);
      return updated;
    });
  };

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price, 0),
    [cart]
  );

  const whatsappLink = `https://wa.me/447000000000?text=${encodeURIComponent(
    "Hi The Local Pantry, I'd like to place an order."
  )}`;

  const startCheckout = async () => {
    try {
      setCheckoutError("");
      setIsLoadingCheckout(true);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          isSubscription,
          deliveryNotes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Checkout failed.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Something went wrong."
      );
    } finally {
      setIsLoadingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="text-sm tracking-[0.35em] text-[#60705f]">
          THE LOCAL PANTRY
        </div>

        <div className="hidden md:flex items-center gap-3 rounded-full border border-[#d6cec2] bg-white/80 px-3 py-2 shadow-sm">
          <input
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            placeholder="Check postcode"
            className="w-40 bg-transparent text-sm outline-none placeholder:text-[#8b8b7c]"
          />
          <button
            onClick={checkPostcode}
            className="rounded-full bg-[#2f4635] px-4 py-2 text-sm text-white"
          >
            Check
          </button>
        </div>
      </header>

      <section className="px-6 pb-8 pt-4 md:px-10">
        <div className="mx-auto max-w-6xl text-center">
          <h1 className="font-serif text-5xl tracking-tight text-[#233226] md:text-7xl">
            The Local Pantry
          </h1>
          <p className="mx-auto mt-8 max-w-4xl font-serif text-2xl italic text-[#314534] md:text-5xl">
            Delivering the best from local farms to your door.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base text-[#6e7368] md:text-lg">
            Seasonal fruit, veg and refillable pantry staples with a calm premium farm shop feel.
          </p>

          {postcodeValid === true && (
            <div className="mx-auto mt-6 inline-flex rounded-full border border-[#c8d3c4] bg-[#eef5ea] px-4 py-2 text-sm text-[#36553c]">
              Great news — we currently deliver to your area.
            </div>
          )}

          {postcodeValid === false && (
            <div className="mx-auto mt-6 inline-flex rounded-full border border-[#ead3cf] bg-[#fff3f1] px-4 py-2 text-sm text-[#9a4f42]">
              Not available yet — join the waitlist for your postcode.
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-14 md:px-10">
        <div className="grid gap-6 lg:grid-cols-2">
          {boxes.map((box) => (
            <div
              key={box.name}
              className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
            >
              <div className="overflow-hidden rounded-[22px] border border-[#e5ddcf] bg-white">
                <img
                  src={box.image}
                  alt={box.name}
                  className="h-[320px] w-full object-contain bg-[#f8f5ef] p-4"
                />

                <div className="px-8 pb-8 pt-6 text-center">
                  <h2 className="font-serif text-4xl leading-none text-[#243328] md:text-5xl">
                    {box.name}
                  </h2>

                  <p className="mt-4 font-serif text-3xl text-[#243328]">
                    £{box.price} <span className="text-xl">per week</span>
                  </p>

                  <div className="mx-auto mt-8 max-w-md border-t border-[#d8d0c5] pt-6">
                    <p className="font-serif text-2xl text-[#243328]">
                      Typical contents:
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-left text-lg text-[#38473b]">
                      {box.contents.map((item) => (
                        <div key={item}>• {item}</div>
                      ))}
                    </div>

                    <p className="mt-6 border-t border-[#d8d0c5] pt-5 text-lg text-[#5f675c]">
                      Changes weekly based on what’s fresh.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(box)}
                    className="relative z-10 mt-8 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-[#334e39] to-[#5a5326] px-6 py-4 font-serif text-2xl text-white shadow-sm"
                  >
                    {box.cta}
                  </button>

                  <div className="mt-4 rounded-2xl border border-[#e7d2a9] bg-[#f3dfb9] px-5 py-3 text-lg text-[#5d4f2a]">
                    {box.urgency}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-10">
        <div className="text-center">
          <h2 className="font-serif text-4xl text-[#243328] md:text-6xl">
            Gourmet Add-Ons
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-[#667164]">
            Luxury pantry jars designed to sit beautifully alongside your weekly harvest box.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {addOns.map((item) => (
            <div
              key={item.name}
              className="rounded-[22px] border border-[#ddd4c8] bg-[#f7f2eb] p-3 shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
            >
              <div className="overflow-hidden rounded-[18px] border border-[#e5ddcf] bg-white">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-56 w-full object-contain bg-[#f8f5ef] p-4"
                />

                <div className="px-4 pb-5 pt-4 text-center">
                  <h3 className="font-serif text-2xl leading-tight text-[#243328]">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-2xl text-[#243328]">
                    £{item.price.toFixed(2)}
                  </p>

                  <button
                    type="button"
                    onClick={() => addToCart(item)}
                    className="relative z-10 mt-4 w-full cursor-pointer rounded-xl bg-gradient-to-r from-[#334e39] to-[#475c40] px-4 py-3 font-serif text-2xl text-white"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10 md:px-10">
        <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
          <div className="text-center">
            <h2 className="font-serif text-4xl text-[#243328] md:text-6xl">
              What To Cook This Week
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-[#667164]">
              Easy serving ideas to help customers make the most of their pantry jars, fruit and veg boxes.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {jarRecipes.map((recipe) => (
              <div
                key={recipe.title}
                className="overflow-hidden rounded-[22px] border border-[#e0d7ca] bg-white shadow-sm"
              >
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="h-64 w-full object-cover"
                />

                <div className="p-6">
                  <h3 className="font-serif text-3xl text-[#243328]">
                    {recipe.title}
                  </h3>

                  <p className="mt-4 text-lg text-[#4d5a4f]">
                    {recipe.recipe}
                  </p>

                  <div className="mt-5 border-t border-[#ece4d8] pt-4">
                    <p className="font-medium uppercase tracking-[0.15em] text-[#6c786c]">
                      Also lovely with
                    </p>

                    <ul className="mt-3 space-y-2 text-[#4d5a4f]">
                      {recipe.ideas.map((idea) => (
                        <li key={idea}>• {idea}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {produceIdeas.map((idea) => (
              <div
                key={idea.title}
                className="rounded-[22px] border border-[#e0d7ca] bg-white p-6 text-center"
              >
                <h3 className="font-serif text-3xl text-[#243328]">
                  {idea.title}
                </h3>
                <p className="mt-4 text-lg text-[#4d5a4f]">{idea.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-16 pt-8 md:px-10">
        <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
          <div className="flex flex-col items-center justify-center gap-3 md:flex-row">
            <button
              onClick={() => setIsSubscription(false)}
              className={`rounded-2xl border px-8 py-4 font-serif text-2xl ${
                !isSubscription
                  ? "border-[#314534] bg-white text-[#243328]"
                  : "border-[#d6cec2] bg-[#f4efe9] text-[#5f675c]"
              }`}
            >
              One-Off Order
            </button>

            <button
              onClick={() => setIsSubscription(true)}
              className={`rounded-2xl px-8 py-4 font-serif text-2xl ${
                isSubscription
                  ? "bg-gradient-to-r from-[#334e39] to-[#5a5326] text-white"
                  : "border border-[#d6cec2] bg-[#f4efe9] text-[#5f675c]"
              }`}
            >
              Continue to Payment (Stripe)
            </button>
          </div>

          <p className="mt-8 text-center text-2xl text-[#3a4539]">
            Prefer not to pay online? Just send us your order details and we’ll reply with your options.
          </p>

          <div className="mt-8 rounded-2xl border border-[#e5ddcf] bg-white p-5">
            <h3 className="font-serif text-2xl text-[#243328]">Your Basket</h3>

            {cart.length === 0 ? (
              <p className="mt-3 text-[#697166]">Your basket is empty for now.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {cart.map((item, index) => (
                  <div
                    key={`${item.name}-${index}`}
                    className="flex items-center justify-between border-b border-[#eee6da] pb-3 text-lg text-[#314534]"
                  >
                    <div>
                      <span>{item.name}</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span>£{item.price.toFixed(2)}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setCart((current) => current.filter((_, i) => i !== index))
                        }
                        className="text-sm underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex items-center justify-between pt-2 text-2xl font-medium text-[#243328]">
                  <span>Total</span>
                  <span>£{total.toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-2xl border border-[#e5ddcf] bg-white p-5">
            <label className="block font-serif text-2xl text-[#243328]">
              Delivery instructions
            </label>
            <textarea
              value={deliveryNotes}
              onChange={(e) => setDeliveryNotes(e.target.value)}
              placeholder="Leave in porch, by side gate, with neighbour at number 12…"
              className="mt-3 min-h-[120px] w-full rounded-2xl border border-[#ddd4c8] bg-[#fbfaf8] p-4 text-lg outline-none placeholder:text-[#9aa099]"
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 md:flex-row">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl border border-[#d6cec2] bg-white px-6 py-4 text-center font-serif text-2xl text-[#243328]"
            >
              Order via WhatsApp
            </a>

            <button
              onClick={startCheckout}
              disabled={cart.length === 0 || isLoadingCheckout}
              className="flex-1 rounded-2xl bg-gradient-to-r from-[#334e39] to-[#5a5326] px-6 py-4 font-serif text-2xl text-white disabled:opacity-50"
            >
              {isLoadingCheckout
                ? "Opening Stripe..."
                : isSubscription
                ? "Start Weekly Subscription"
                : "Pay for One-Off Order"}
            </button>
          </div>

          {checkoutError && (
            <p className="mt-4 text-center text-sm text-red-700">{checkoutError}</p>
          )}

          <p className="mt-5 text-center text-sm text-[#6d756a]">
            Pause or skip a week anytime once your Stripe subscription is live.
          </p>
        </div>
      </section>
    </div>
  );
}
