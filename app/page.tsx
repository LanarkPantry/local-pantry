"use client";

import { useMemo, useState } from "react";

export default function LocalPantryWebsite() {
  const [postcode, setPostcode] = useState("");
  const [postcodeValid, setPostcodeValid] = useState<boolean | null>(null);
  const [cart, setCart] = useState<{ name: string; price: number; image: string }[]>([]);
  const [isSubscription, setIsSubscription] = useState(true);
  const [deliveryNotes, setDeliveryNotes] = useState("");

  const addOns = [
    { name: "Sorrel & Walnut Pesto", price: 4.5, image: "/sorrel-walnut-pesto.png" },
    { name: "Rose Harissa", price: 5.25, image: "/rose-harissa.png" },
    { name: "Salted Caramel Sauce", price: 5, image: "/salted-caramel.png" },
    { name: "Dark Chocolate & Hazelnut Spread", price: 5, image: "/dark-chocolate.png" },
  ];

  const boxes = [
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

  const jarRecipes = [
    {
      title: "Sorrel & Walnut Pesto",
      recipe: "Toss through hot pasta with roasted veg and a splash of pasta water.",
      ideas: ["Stir into potatoes", "Spread on toast", "Add to grain bowls"],
    },
    {
      title: "Rose Harissa",
      recipe: "Roast carrots and chickpeas with harissa, olive oil and a little honey.",
      ideas: ["Mix into yoghurt", "Brush onto veg", "Add to sauces"],
    },
    {
      title: "Salted Caramel Sauce",
      recipe: "Drizzle over porridge with banana and a pinch of sea salt.",
      ideas: ["Pancakes", "Brownies", "With apples"],
    },
    {
      title: "Dark Chocolate & Hazelnut Spread",
      recipe: "Spread on toast with strawberries or banana.",
      ideas: ["Fill crepes", "Stir into oats", "Dip fruit"],
    },
  ];

  const produceIdeas = [
    {
      title: "Roast Tin Supper",
      text: "Roast potatoes, carrots, onions and finish with pesto or harissa.",
    },
    {
      title: "Seasonal Soup",
      text: "Blend soft veg with stock and finish with a swirl of pesto.",
    },
    {
      title: "Fruit Breakfasts",
      text: "Use fruit for smoothies, porridge toppings or quick salads.",
    },
  ];

  const checkPostcode = () => {
    if (postcode.toLowerCase().startsWith("g")) setPostcodeValid(true);
    else setPostcodeValid(false);
  };

  const addToCart = (item: any) => setCart((c) => [...c, item]);

  const total = useMemo(() => cart.reduce((sum, i) => sum + i.price, 0), [cart]);

  const whatsappLink = `https://wa.me/447000000000?text=${encodeURIComponent(
    `Hi The Local Pantry, I'd like to place ${isSubscription ? "a weekly subscription" : "a one-off order"} for: ${cart.map(i => i.name).join(", ")}`
  )}`;

  return (
    <div className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <header className="p-6 text-center font-serif text-xl tracking-widest">
        THE LOCAL PANTRY
      </header>

      <section className="text-center px-6">
        <h1 className="text-5xl font-serif">Fresh local produce delivered</h1>
        <div className="mt-6">
          <input
            placeholder="Enter postcode"
            value={postcode}
            onChange={(e) => setPostcode(e.target.value)}
            className="border p-2"
          />
          <button onClick={checkPostcode} className="ml-2 bg-green-700 text-white px-4 py-2">
            Check
          </button>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-6 p-6">
        {boxes.map((box) => (
          <div key={box.name} className="bg-white p-4 rounded">
            <img src={box.image} className="h-64 w-full object-contain" />
            <h2 className="text-3xl font-serif mt-4">{box.name}</h2>
            <p>£{box.price}/week</p>
            <button onClick={() => addToCart(box)} className="mt-4 bg-green-800 text-white px-4 py-2">
              Add
            </button>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-4 gap-4 p-6">
        {addOns.map((item) => (
          <div key={item.name} className="bg-white p-4 rounded">
            <img src={item.image} className="h-48 w-full object-contain" />
            <h3 className="font-serif">{item.name}</h3>
            <button onClick={() => addToCart(item)} className="mt-2 bg-green-700 text-white px-3 py-1">
              Add
            </button>
          </div>
        ))}
      </section>

      <section className="p-6">
        <h2 className="text-4xl font-serif text-center">What to cook this week</h2>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {jarRecipes.map((r) => (
            <div key={r.title} className="bg-white p-4 rounded">
              <h3 className="text-2xl font-serif">{r.title}</h3>
              <p className="mt-2">{r.recipe}</p>
              <ul className="mt-2">
                {r.ideas.map((i) => (
                  <li key={i}>• {i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {produceIdeas.map((p) => (
            <div key={p.title} className="bg-white p-4 rounded">
              <h3 className="font-serif">{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}