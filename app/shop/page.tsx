"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useCart } from "../cart-context";

type ShopDisplayItem = {
  name: string;
  price: number;
  image: string;
  description: string;
  details?: string;
  category: "boxes" | "pantry" | "cupboard" | "extras";
  checkoutType: "subscription" | "one-off";
  buttonLabel?: string;
  weeklyIncludes?: string[];
  bestFor?: string;
  note?: string;
  weight?: string;
};

const produceBoxes: ShopDisplayItem[] = [
  {
    name: "Weekly Produce Box",
    price: 20,
    image: "/weekly-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    buttonLabel: "Add weekly box",
    description:
      "A smaller produce box with a useful mix of everyday fruit and veg.",
    details:
      "Best suited to weekly delivery. Contents change week to week depending on availability, so the mix is not fixed.",
    weeklyIncludes: ["Carrots", "Potatoes", "Leeks", "Apples", "Onions"],
    bestFor: "Best for 1–2 people or lighter weekly cooking",
    note: "Best as a weekly subscription",
  },
  {
    name: "Family Produce Box",
    price: 30,
    image: "/family-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    buttonLabel: "Add family box",
    description:
      "A larger produce box for households that cook regularly through the week.",
    details:
      "Designed as a fuller weekly box, with contents changing depending on what is available.",
    weeklyIncludes: ["Carrots", "Potatoes", "Tomatoes", "Apples", "Greens"],
    bestFor: "Best for families or households cooking most nights",
    note: "Best as a weekly subscription",
  },
];

const pantryItems: ShopDisplayItem[] = [
  {
    name: "Sorrel & Walnut Pesto",
    price: 4.5,
    image: "/sorrel-walnut-pesto.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A fresh, savoury jar for pasta or roasted vegetables.",
    details:
      "A useful one-off add-on to include with your weekly box or order.",
    note: "Usually added as a one-off",
  },
  {
    name: "Rose Harissa",
    price: 5.25,
    image: "/rose-harissa.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A gently spiced pantry extra for roasting or dressing.",
    details: "Easy to add when you want a little more flavour in the week.",
    note: "Usually added as a one-off",
  },
  {
    name: "Salted Caramel Sauce",
    price: 5.0,
    image: "/salted-caramel.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A rich sauce for desserts or simple extras.",
    details: "A simple one-off extra rather than part of a weekly base order.",
    note: "Usually added as a one-off",
  },
  {
    name: "Dark Chocolate & Hazelnut Spread",
    price: 5.0,
    image: "/dark-chocolate.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A simple chocolate spread for toast or baking.",
    details: "A good add-on when you want something sweet in the cupboard.",
    note: "Usually added as a one-off",
  },
];

const cupboardItems: ShopDisplayItem[] = [
  {
    name: "Casarecce Pasta",
    price: 4.95,
    image: "/images/cupboard/casarecce.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A slightly more special pasta shape that still feels easy to cook with.",
    details:
      "Good with pesto, harissa, greens, roasted vegetables, or whatever needs using up.",
    note: "Usually added as a one-off",
  },
  {
    name: "Orzo Pasta",
    price: 4.5,
    image: "/images/cupboard/orzo.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A very flexible pasta for quick bowls, soups, traybakes, and easy midweek cooking.",
    details:
      "Especially useful when you want something fast, simple, and not too heavy.",
    note: "Usually added as a one-off",
  },
  {
    name: "Giant Couscous",
    price: 4.75,
    image: "/images/cupboard/giant-couscous.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description: "A useful grain-like cupboard staple that works warm or cold.",
    details:
      "Good with roast vegetables, herbs, dressings, and spoonfuls of something punchy from the fridge.",
    note: "Usually added as a one-off",
  },
  {
    name: "Polenta",
    price: 4.25,
    image: "/images/cupboard/polenta.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A comforting base for soft bowls, roasted vegetables, and simple suppers.",
    details:
      "Naturally gluten-free and especially good with greens, beans, pesto, or harissa.",
    note: "Usually added as a one-off",
  },
  {
    name: "Puy Lentils",
    price: 4.95,
    image: "/images/cupboard/puy-lentils.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A pantry staple with a little more structure, good for warm salads and batch cooking.",
    details:
      "Useful to cook ahead and keep in the fridge for easy lunches, bowls, and simple dinners.",
    note: "Usually added as a one-off",
  },
  {
    name: "Short Grain Rice",
    price: 4.75,
    image: "/images/cupboard/short-grain-rice.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A versatile rice for risotto-style cooking, gentle puddings, and simple sides.",
    details:
      "One of the most useful cupboard basics if you want something that works for sweet or savoury cooking.",
    note: "Usually added as a one-off",
  },
  {
    name: "Farro",
    price: 5.5,
    image: "/images/cupboard/farro.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A nutty, chewy grain that makes simple bowls and salads feel a little more special.",
    details:
      "Especially good with roast vegetables, herbs, soft cheeses, and bold jars like harissa or pesto.",
    note: "Usually added as a one-off",
  },
];

const extraItems: ShopDisplayItem[] = [
  {
    name: "Almonds",
    price: 4.95,
    image: "/images/extras/almonds.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "An everyday nut to keep on hand for baking, breakfast, salads, and simple cooking.",
    note: "Usually added as a one-off",
  },
  {
    name: "Walnuts",
    price: 5.5,
    image: "/images/extras/walnuts.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A savoury-leaning extra that works beautifully with grains, leaves, roast veg, and cheese.",
    note: "Usually added as a one-off",
  },
  {
    name: "Hazelnuts",
    price: 5.95,
    image: "/images/extras/hazelnuts.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A slightly more special nut that works especially well with sweet things and darker flavours.",
    note: "Usually added as a one-off",
  },
  {
    name: "Cashews",
    price: 5.25,
    image: "/images/extras/cashews.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A soft, useful nut for snacking, cooking, and adding a little richness to simple meals.",
    note: "Usually added as a one-off",
  },
];

export default function ShopPage() {
  const { cart, groupedCart, total, addToCart, removeOneFromCart } = useCart();

  const totalItems = useMemo(() => cart.length, [cart]);

  const quantityByName = useMemo(() => {
    return groupedCart.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.item.name] = entry.quantity;
      return acc;
    }, {});
  }, [groupedCart]);

  const basketHref = "/basket";

  const getQuantity = (itemName: string) => quantityByName[itemName] ?? 0;

  const addDisplayItemToCart = (item: ShopDisplayItem) => {
    addToCart({
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      checkoutType: item.checkoutType,
    });
  };

  const renderOrderBadge = (item: ShopDisplayItem) => {
    if (item.checkoutType === "subscription") {
      return (
        <div className="inline-flex rounded-full border border-[#d9d1c5] bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5f675c]">
          Subscription-friendly
        </div>
      );
    }

    return (
      <div className="inline-flex rounded-full border border-[#d9d1c5] bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5f675c]">
        One-off add-on
      </div>
    );
  };

  const renderAddControls = (item: ShopDisplayItem) => {
    const quantity = getQuantity(item.name);

    if (quantity === 0) {
      return (
        <button
          type="button"
          onClick={() => addDisplayItemToCart(item)}
          className="inline-flex w-full items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto"
        >
          {item.buttonLabel ?? "Add to basket"}
        </button>
      );
    }

    return (
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
        <div className="inline-flex items-center self-start rounded-full border border-[#d8d0c4] bg-white">
          <button
            type="button"
            onClick={() => removeOneFromCart(item.name)}
            aria-label={`Decrease quantity of ${item.name}`}
            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            −
          </button>

          <span className="min-w-[2.2rem] text-center text-sm font-medium text-[#243328]">
            {quantity}
          </span>

          <button
            type="button"
            onClick={() => addDisplayItemToCart(item)}
            aria-label={`Increase quantity of ${item.name}`}
            className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
          >
            +
          </button>
        </div>

        <span className="text-sm text-[#5f675c]">Added to basket</span>
      </div>
    );
  };

  const renderCompactCard = (
    item: ShopDisplayItem,
    label: string,
    helperText?: string,
  ) => {
    const quantity = getQuantity(item.name);

    return (
      <article
        key={item.name}
        className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
      >
        <div className="flex flex-col sm:flex-row">
          <div className="border-b border-[#e9dfd2] bg-[#eee7dc] p-4 sm:w-[190px] sm:shrink-0 sm:border-b-0 sm:border-r md:w-[220px]">
            <div className="flex h-full items-center justify-center rounded-[20px] bg-[#f8f4ee] p-4">
              <img
                src={item.image}
                alt={item.name}
                className="h-28 w-full object-contain sm:h-36"
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
            <div>
              <div className="flex flex-col gap-3">
                <div className="max-w-2xl">
                  <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                    {label}
                  </p>
                  <h3 className="mt-2 font-serif text-[1.75rem] leading-tight text-[#243328] md:text-[2rem]">
                    {item.name}
                  </h3>
                </div>

                <div className="self-start rounded-full border border-[#ddd4c8] bg-white px-4 py-2 text-sm font-medium text-[#243328]">
                  £{item.price.toFixed(2)}
                  {item.weight ? ` · ${item.weight}` : ""}
                </div>
              </div>

              <div className="mt-4">{renderOrderBadge(item)}</div>

              <p className="mt-4 text-sm leading-7 text-[#667164]">
                {item.description}
              </p>

              {item.details && (
                <p className="mt-3 text-sm leading-7 text-[#667164]">
                  {item.details}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3">
              {renderAddControls(item)}

              {quantity > 0 && helperText ? (
                <p className="text-xs leading-6 text-[#7a8478]">{helperText}</p>
              ) : quantity > 0 ? (
                <p className="text-xs leading-6 text-[#7a8478]">
                  Easy to add alongside the rest of your order.
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    );
  };

  return (
    <main className="min-h-screen bg-[#f4efe9] px-4 py-6 text-[#243328] sm:px-5 md:px-10 md:py-10">
      <div className="mx-auto max-w-6xl pb-24 md:pb-10">
        <div className="mb-8 flex flex-col gap-4 border-b border-[#ddd4c8] pb-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-sm tracking-[0.35em] text-[#60705f] transition hover:text-[#243328]"
          >
            THE LOCAL PANTRY
          </Link>

          <nav className="-mx-1 flex items-center gap-5 overflow-x-auto px-1 sm:gap-6">
            <Link
              href="/"
              className="shrink-0 text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Home
            </Link>

            <Link
              href="/shop"
              className="shrink-0 text-sm text-[#243328] underline underline-offset-4"
            >
              Shop
            </Link>

            <Link
              href="/recipes"
              className="shrink-0 text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Recipes
            </Link>

            <Link
              href={basketHref}
              className="shrink-0 text-sm text-[#4f5e52] transition hover:text-[#243328]"
            >
              Basket{totalItems > 0 ? ` (${totalItems})` : ""}
            </Link>
          </nav>
        </div>

        <section className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.2em] text-[#6b776c]">
                Shop
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
                Weekly boxes first,
                <br className="hidden sm:block" /> then useful extras
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#667164] md:text-base">
                Start with a produce box if you want a regular weekly order,
                then add pantry jars, cupboard goods, and extras as one-off
                additions.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#produce-boxes"
                  className="inline-flex items-center justify-center rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Shop produce boxes
                </a>

                <a
                  href="#pantry-additions"
                  className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                >
                  Browse pantry items
                </a>

                <a
                  href="#cook-from-the-cupboard"
                  className="inline-flex items-center justify-center rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                >
                  Explore cupboard goods
                </a>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#ddd4c8] bg-white px-4 py-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Boxes suit weekly delivery
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#667164]">
                    Fruit and veg boxes are the strongest fit for subscription.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd4c8] bg-white px-4 py-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Add-ons stay flexible
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#667164]">
                    Pantry jars and extras work well as one-off additions.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#ddd4c8] bg-white px-4 py-4">
                  <p className="text-sm font-medium text-[#243328]">
                    Choose at basket
                  </p>
                  <p className="mt-1 text-sm leading-6 text-[#667164]">
                    You can review everything before choosing one-off or
                    subscription.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-[#ddd4c8] bg-[#efe8dd] p-5">
              <div className="rounded-2xl border border-[#ddd4c8] bg-[#f7f2eb] p-4">
                <p className="text-sm uppercase tracking-[0.16em] text-[#6b776c]">
                  Your basket
                </p>

                <p className="mt-3 text-2xl font-serif text-[#243328]">
                  {totalItems > 0
                    ? `${totalItems} item${totalItems === 1 ? "" : "s"}`
                    : "Nothing added yet"}
                </p>

                <p className="mt-2 text-sm leading-6 text-[#667164]">
                  {totalItems > 0
                    ? `Current total: £${total.toFixed(2)}`
                    : "Start with a produce box, then add a few useful extras if you like."}
                </p>

                <Link
                  href={basketHref}
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
                >
                  {totalItems > 0 ? "Review basket" : "View basket"}
                </Link>
              </div>

              <div className="mt-4 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                <p className="text-sm font-medium text-[#243328]">
                  How ordering works
                </p>
                <ol className="mt-3 space-y-2 text-sm leading-6 text-[#667164]">
                  <li>
                    1. Choose a produce box if you want a weekly base order
                  </li>
                  <li>2. Add pantry, cupboard goods, or extras as needed</li>
                  <li>
                    3. Review your basket and choose how you’d like to order
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <div className="flex flex-wrap gap-3">
            <a
              href="#produce-boxes"
              className="rounded-full border border-[#d8d0c4] bg-white px-4 py-2 text-sm text-[#243328] transition hover:bg-[#faf7f2]"
            >
              Jump to produce boxes
            </a>
            <a
              href="#pantry-additions"
              className="rounded-full border border-[#d8d0c4] bg-white px-4 py-2 text-sm text-[#243328] transition hover:bg-[#faf7f2]"
            >
              Jump to pantry additions
            </a>
            <a
              href="#cook-from-the-cupboard"
              className="rounded-full border border-[#d8d0c4] bg-white px-4 py-2 text-sm text-[#243328] transition hover:bg-[#faf7f2]"
            >
              Jump to cupboard goods
            </a>
            <a
              href="#a-few-good-extras"
              className="rounded-full border border-[#d8d0c4] bg-white px-4 py-2 text-sm text-[#243328] transition hover:bg-[#faf7f2]"
            >
              Jump to extras
            </a>
          </div>
        </section>

        <section id="produce-boxes" className="mt-10 scroll-mt-24">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Produce boxes
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Choose your base for the week
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667164]">
              These are the strongest fit for regular weekly ordering. The mix
              changes depending on what is available and looking good that week.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {produceBoxes.map((item) => {
              const quantity = getQuantity(item.name);

              return (
                <article
                  key={item.name}
                  className="overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
                >
                  <div className="border-b border-[#e9dfd2] bg-[#eee7dc] p-4 md:p-5">
                    <div className="flex items-center justify-center rounded-[22px] bg-[#f8f4ee] p-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-48 w-full object-contain md:h-64"
                      />
                    </div>
                  </div>

                  <div className="p-5 md:p-7">
                    <div className="flex flex-col gap-3">
                      <div>
                        <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                          Produce box
                        </p>
                        <h3 className="mt-2 font-serif text-3xl leading-tight text-[#243328]">
                          {item.name}
                        </h3>
                      </div>

                      <div className="self-start rounded-full border border-[#ddd4c8] bg-white px-4 py-2 text-sm font-medium text-[#243328]">
                        £{item.price.toFixed(2)}
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.bestFor && (
                        <div className="inline-flex rounded-full border border-[#d9d1c5] bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.08em] text-[#5f675c]">
                          {item.bestFor}
                        </div>
                      )}
                      {renderOrderBadge(item)}
                    </div>

                    <p className="mt-5 text-sm leading-7 text-[#667164]">
                      {item.description}
                    </p>

                    {item.details && (
                      <p className="mt-3 text-sm leading-7 text-[#667164]">
                        {item.details}
                      </p>
                    )}

                    {item.weeklyIncludes && (
                      <div className="mt-5 rounded-2xl border border-[#ddd4c8] bg-white p-4">
                        <p className="text-sm font-medium text-[#243328]">
                          This week may include
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {item.weeklyIncludes.map((entry) => (
                            <span
                              key={entry}
                              className="rounded-full border border-[#e5ddcf] bg-[#fbfaf8] px-3 py-1 text-sm text-[#5f675c]"
                            >
                              {entry}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex flex-col gap-3">
                      {renderAddControls(item)}

                      {quantity > 0 && (
                        <Link
                          href={basketHref}
                          className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
                        >
                          Review in basket
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section id="pantry-additions" className="mt-12 scroll-mt-24">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Pantry additions
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Useful jars and extras
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667164]">
              These work best as flexible one-off additions alongside a box or a
              single weekly order.
            </p>
          </div>

          <div className="grid gap-4">
            {pantryItems.map((item) =>
              renderCompactCard(
                item,
                "Pantry item",
                "These are usually best treated as one-off add-ons.",
              ),
            )}
          </div>
        </section>

        <section id="cook-from-the-cupboard" className="mt-12 scroll-mt-24">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              Cook from the cupboard
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Good things to cook with through the week
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667164]">
              Pasta, grains, and staples that make it easier to turn good
              produce and pantry jars into simple meals.
            </p>
          </div>

          <div className="grid gap-4">
            {cupboardItems.map((item) =>
              renderCompactCard(
                item,
                "Cupboard good",
                "These are usually best treated as one-off add-ons.",
              ),
            )}
          </div>
        </section>

        <section id="a-few-good-extras" className="mt-12 scroll-mt-24">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
              A few good extras
            </p>
            <h2 className="mt-2 font-serif text-3xl md:text-4xl">
              Useful things to keep on hand
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#667164]">
              A few simple extras for baking, breakfasts, salads, sweet things,
              and adding a little more depth to everyday cooking.
            </p>
          </div>

          <div className="grid gap-4">
            {extraItems.map((item) =>
              renderCompactCard(
                item,
                "Extra",
                "These are usually best treated as one-off add-ons.",
              ),
            )}
          </div>
        </section>
      </div>

      {totalItems > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#ddd4c8] bg-[#f7f2eb]/95 px-4 py-3 backdrop-blur md:hidden">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-[#243328]">
                {totalItems} item{totalItems === 1 ? "" : "s"} · £
                {total.toFixed(2)}
              </p>
              <p className="truncate text-xs text-[#667164]">
                Ready to review in your basket
              </p>
            </div>

            <Link
              href={basketHref}
              className="shrink-0 rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              View basket
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
