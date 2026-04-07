"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../cart-context";
import {
  produceBoxes,
  pantryItems,
  cupboardItems,
  type ShopDisplayItem,
} from "../shop/shop-data";

type WeekMood = "quick" | "balanced" | "comforting";
type WeekFocus = "veg-heavy" | "low-waste" | "family-friendly";
type PlannerStep = "choices" | "building" | "results";

type PlannedMeal = {
  id: string;
  day: string;
  title: string;
  description: string;
  image: string;
  ingredients: string[];
  matchedProducts: string[];
  steps: string[];
};

type ChoiceChipProps = {
  active: boolean;
  label: string;
  onClick: () => void;
};

const LOADING_MESSAGES = [
  "Looking at what’s in season",
  "Building meals for the week ahead",
  "Keeping the week flexible",
  "Matching your basket",
  "Finishing your plan",
] as const;

const DAY_NAMES = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const IMAGE_POOL = [
  "/images/recipes/rose-harissa-carrots.jpg",
  "/images/recipes/pesto-roast-potatoes.jpg",
  "/images/recipes/chocolate-recipe.jpg",
  "/images/recipes/caramel-recipe.jpg",
] as const;

const QUICK_LIBRARY: PlannedMeal[] = [
  {
    id: "quick-1",
    day: "Monday",
    title: "Tomato pasta with greens",
    description:
      "Soft tomato sauce, a quick pan finish, and something green folded through.",
    image: IMAGE_POOL[1],
    ingredients: ["Tomatoes", "Greens", "Pasta", "Garlic"],
    matchedProducts: ["Casarecce Pasta", "Orzo Pasta"],
    steps: [
      "Bring a pan of salted water to the boil and cook the pasta.",
      "Soften the garlic in olive oil, then add tomatoes and cook until soft.",
      "Fold through chopped greens for the last couple of minutes.",
      "Toss with the pasta and finish with black pepper.",
    ],
  },
  {
    id: "quick-2",
    day: "Tuesday",
    title: "Roast carrots with harissa and yoghurt",
    description:
      "A tray-led supper with something warm, sweet, and gently spiced.",
    image: IMAGE_POOL[0],
    ingredients: ["Carrots", "Chickpeas", "Rose Harissa", "Yoghurt"],
    matchedProducts: ["Rose Harissa"],
    steps: [
      "Heat the oven to 220°C.",
      "Roast the carrots with olive oil and salt until tender and coloured.",
      "Warm the chickpeas and spoon over a little harissa.",
      "Serve with yoghurt and any herbs you have.",
    ],
  },
  {
    id: "quick-3",
    day: "Wednesday",
    title: "Pesto potatoes with beans",
    description:
      "A very easy midweek plate with a useful jar doing the heavy lifting.",
    image: IMAGE_POOL[1],
    ingredients: ["Potatoes", "Beans", "Sorrel & Walnut Pesto"],
    matchedProducts: ["Sorrel & Walnut Pesto"],
    steps: [
      "Boil the potatoes until tender.",
      "Warm the beans in a small pan with a splash of water.",
      "Toss the potatoes with pesto.",
      "Serve everything together with black pepper or soft herbs.",
    ],
  },
  {
    id: "quick-4",
    day: "Thursday",
    title: "Mushroom orzo",
    description: "One-pan, soft-edged, and easy to put together.",
    image: IMAGE_POOL[2],
    ingredients: ["Mushrooms", "Orzo", "Onion", "Stock"],
    matchedProducts: ["Orzo Pasta"],
    steps: [
      "Soften onion in olive oil.",
      "Add mushrooms and cook until they lose their water.",
      "Stir through orzo and stock, then simmer until tender.",
      "Finish with butter, herbs, or a little cheese if you like.",
    ],
  },
  {
    id: "quick-5",
    day: "Friday",
    title: "Couscous with roast veg",
    description: "A fast end-of-week bowl with a bright finish.",
    image: IMAGE_POOL[3],
    ingredients: ["Peppers", "Courgette", "Giant Couscous", "Lemon"],
    matchedProducts: ["Giant Couscous", "Rose Harissa"],
    steps: [
      "Roast the vegetables until softened and coloured.",
      "Cook the giant couscous until tender.",
      "Dress with lemon, olive oil, and salt.",
      "Pile into bowls and finish with herbs or a spoon of harissa.",
    ],
  },
  {
    id: "quick-6",
    day: "Saturday",
    title: "Toast, fruit, and something sweet",
    description: "A lighter weekend idea for brunch or an easy sweet bite.",
    image: IMAGE_POOL[3],
    ingredients: ["Toast", "Fruit", "Dark Chocolate & Hazelnut Spread"],
    matchedProducts: [
      "Dark Chocolate & Hazelnut Spread",
      "Salted Caramel Sauce",
    ],
    steps: [
      "Toast the bread well.",
      "Slice whatever fruit is around.",
      "Spread with chocolate or spoon over a little caramel.",
      "Finish with fruit on the side or piled on top.",
    ],
  },
];

const BALANCED_LIBRARY: PlannedMeal[] = [
  {
    id: "balanced-1",
    day: "Monday",
    title: "Greens, rice, and a herby finish",
    description:
      "A fresh start to the week with one useful base and a bright finish.",
    image: IMAGE_POOL[1],
    ingredients: ["Greens", "Rice", "Garlic", "Lemon"],
    matchedProducts: ["Short Grain Rice", "Sorrel & Walnut Pesto"],
    steps: [
      "Cook the rice until tender.",
      "Steam or sauté the greens with garlic.",
      "Spoon over pesto or lemony olive oil.",
      "Serve warm with black pepper.",
    ],
  },
  {
    id: "balanced-2",
    day: "Tuesday",
    title: "Tomato pan with casarecce",
    description:
      "Saucy enough to feel generous, easy enough for a normal Tuesday.",
    image: IMAGE_POOL[0],
    ingredients: ["Tomatoes", "Casarecce Pasta", "Garlic", "Basil"],
    matchedProducts: ["Casarecce Pasta"],
    steps: [
      "Cook the pasta in salted water.",
      "Soften garlic in oil, then add tomatoes and cook down.",
      "Stir through basil or soft herbs.",
      "Toss with the pasta and finish with pepper.",
    ],
  },
  {
    id: "balanced-3",
    day: "Wednesday",
    title: "Potatoes, greens, and pesto beans",
    description:
      "A grounding midweek plate with a useful jar tying it together.",
    image: IMAGE_POOL[1],
    ingredients: ["Potatoes", "Greens", "Beans", "Sorrel & Walnut Pesto"],
    matchedProducts: ["Sorrel & Walnut Pesto"],
    steps: [
      "Boil the potatoes until tender.",
      "Warm the beans and greens together in a pan.",
      "Spoon over pesto just before serving.",
      "Finish with herbs if you have them.",
    ],
  },
  {
    id: "balanced-4",
    day: "Thursday",
    title: "Farro with roast veg",
    description: "A slower-feeling supper that still stays practical.",
    image: IMAGE_POOL[2],
    ingredients: ["Farro", "Roots", "Garlic", "Herbs"],
    matchedProducts: ["Farro", "Rose Harissa"],
    steps: [
      "Cook the farro until tender.",
      "Roast the vegetables with oil and salt.",
      "Dress with herbs and lemon or a little harissa.",
      "Fold everything together and serve warm.",
    ],
  },
  {
    id: "balanced-5",
    day: "Friday",
    title: "Mushroom orzo with greens",
    description:
      "Soft, useful, and easy to finish with what is already around.",
    image: IMAGE_POOL[2],
    ingredients: ["Mushrooms", "Orzo", "Greens", "Stock"],
    matchedProducts: ["Orzo Pasta"],
    steps: [
      "Cook mushrooms until golden.",
      "Add orzo and stock and simmer gently.",
      "Fold through chopped greens at the end.",
      "Finish with butter or olive oil.",
    ],
  },
  {
    id: "balanced-6",
    day: "Saturday",
    title: "Polenta with roast vegetables",
    description:
      "A weekend supper that feels a little more generous without becoming fussy.",
    image: IMAGE_POOL[0],
    ingredients: ["Polenta", "Cauliflower", "Peppers", "Rose Harissa"],
    matchedProducts: ["Polenta", "Rose Harissa"],
    steps: [
      "Roast the vegetables until deeply coloured.",
      "Cook the polenta until soft and spoonable.",
      "Season well and loosen with butter or olive oil.",
      "Pile vegetables on top and finish with harissa.",
    ],
  },
];

const COMFORTING_LIBRARY: PlannedMeal[] = [
  {
    id: "comforting-1",
    day: "Monday",
    title: "Soft potatoes with greens and mustard butter",
    description: "A warm start to the week that feels cooked and generous.",
    image: IMAGE_POOL[1],
    ingredients: ["Potatoes", "Greens", "Mustard", "Butter"],
    matchedProducts: ["Sorrel & Walnut Pesto"],
    steps: [
      "Boil the potatoes until tender.",
      "Cook the greens in a pan with butter.",
      "Stir a little mustard through the butter.",
      "Serve everything together with black pepper.",
    ],
  },
  {
    id: "comforting-2",
    day: "Tuesday",
    title: "Orzo with mushrooms and stock",
    description: "Softer, more spoonable, and exactly right for a colder day.",
    image: IMAGE_POOL[2],
    ingredients: ["Orzo", "Mushrooms", "Onion", "Stock"],
    matchedProducts: ["Orzo Pasta"],
    steps: [
      "Soften onion in oil.",
      "Add mushrooms and cook until golden.",
      "Add orzo and stock and simmer until tender.",
      "Finish with butter, herbs, or a little cheese.",
    ],
  },
  {
    id: "comforting-3",
    day: "Wednesday",
    title: "Lentils with roast roots",
    description: "A more grounded supper with plenty of room for extras.",
    image: IMAGE_POOL[0],
    ingredients: ["Puy Lentils", "Carrots", "Beetroot", "Rose Harissa"],
    matchedProducts: ["Puy Lentils", "Rose Harissa"],
    steps: [
      "Roast the roots until tender and coloured.",
      "Warm the lentils with olive oil or stock.",
      "Dress with a little harissa or lemon.",
      "Pile together and finish with herbs.",
    ],
  },
  {
    id: "comforting-4",
    day: "Thursday",
    title: "Soft polenta with greens",
    description:
      "A comforting bowl with a useful finish from the fridge or pantry.",
    image: IMAGE_POOL[2],
    ingredients: ["Polenta", "Greens", "Garlic", "Butter"],
    matchedProducts: ["Polenta", "Sorrel & Walnut Pesto"],
    steps: [
      "Cook the polenta until soft.",
      "Sauté greens with garlic.",
      "Spoon polenta into bowls and top with greens.",
      "Finish with butter, pesto, or black pepper.",
    ],
  },
  {
    id: "comforting-5",
    day: "Friday",
    title: "Tomato beans on toast",
    description: "A very good end-of-week supper that still feels satisfying.",
    image: IMAGE_POOL[3],
    ingredients: ["Beans", "Tomatoes", "Toast", "Garlic"],
    matchedProducts: [],
    steps: [
      "Cook garlic in olive oil.",
      "Add tomatoes and simmer until soft.",
      "Add beans and warm through.",
      "Serve on toast with pepper or herbs.",
    ],
  },
  {
    id: "comforting-6",
    day: "Saturday",
    title: "Roast veg with giant couscous",
    description: "Warm, generous, and easy to stretch into a proper meal.",
    image: IMAGE_POOL[0],
    ingredients: ["Roots", "Squash", "Giant Couscous", "Rose Harissa"],
    matchedProducts: ["Giant Couscous", "Rose Harissa"],
    steps: [
      "Roast the vegetables until tender.",
      "Cook giant couscous until soft.",
      "Dress with olive oil and lemon or harissa.",
      "Pile into a warm bowl and finish with herbs.",
    ],
  },
];

function ChoiceChip({ active, label, onClick }: ChoiceChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-sm transition ${
        active
          ? "border-[#243328] bg-[#243328] text-white"
          : "border-[#d6cec2] bg-white/80 text-[#243328] hover:bg-white"
      }`}
    >
      {label}
    </button>
  );
}

function compactCardItem(item: ShopDisplayItem, onAdd: () => void) {
  return (
    <div
      key={item.name}
      className="rounded-[20px] border border-[#e4dbcf] bg-white/88 p-4 shadow-[0_8px_18px_rgba(36,51,40,0.04)]"
    >
      <div className="flex items-start gap-3">
        <img
          src={item.image}
          alt={item.name}
          className="h-16 w-16 rounded-[14px] object-cover"
        />

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-[#243328]">{item.name}</p>
          <p className="mt-1 text-sm leading-6 text-[#667164]">
            {item.description}
          </p>
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-sm font-medium text-[#243328]">
              £{item.price.toFixed(2)}
            </span>
            <button
              type="button"
              onClick={onAdd}
              className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.88)] px-3 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildWeek(mood: WeekMood, nights: number, focus: WeekFocus | null) {
  const source =
    mood === "quick"
      ? QUICK_LIBRARY
      : mood === "comforting"
        ? COMFORTING_LIBRARY
        : BALANCED_LIBRARY;

  return source.slice(0, nights).map((meal, index) => {
    if (focus === "family-friendly") {
      return {
        ...meal,
        description:
          index % 2 === 0
            ? `${meal.description} Easy to put on the table without too much fuss.`
            : meal.description,
      };
    }

    if (focus === "low-waste") {
      return {
        ...meal,
        description:
          index % 2 === 1
            ? `${meal.description} Built to use what is already around.`
            : meal.description,
      };
    }

    if (focus === "veg-heavy") {
      return {
        ...meal,
        description:
          index === 0
            ? `${meal.description} Led by produce first, with the rest supporting it.`
            : meal.description,
      };
    }

    return meal;
  });
}

export default function PlannerPage() {
  const { groupedCart, addToCart } = useCart();

  const [step, setStep] = useState<PlannerStep>("choices");
  const [nights, setNights] = useState(4);
  const [mood, setMood] = useState<WeekMood>("balanced");
  const [focus, setFocus] = useState<WeekFocus | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [week, setWeek] = useState<PlannedMeal[]>([]);
  const [openDay, setOpenDay] = useState<string | null>(null);

  const totalBasketItems = useMemo(
    () => groupedCart.reduce((sum, entry) => sum + entry.quantity, 0),
    [groupedCart],
  );

  const basketNames = useMemo(
    () => groupedCart.map((entry) => entry.item.name),
    [groupedCart],
  );

  const hasProduceBox = useMemo(
    () =>
      basketNames.some((name) => name.toLowerCase().includes("produce box")),
    [basketNames],
  );

  const weeklyProduceBox =
    produceBoxes.find((item) => item.name === "Weekly Produce Box") ??
    produceBoxes[0] ??
    null;

  const familyProduceBox =
    produceBoxes.find((item) => item.name === "Family Produce Box") ??
    produceBoxes.find((item) => item.name !== weeklyProduceBox?.name) ??
    null;

  const recommendedAddOns = useMemo(() => {
    const names = new Set<string>();

    week.forEach((meal) => {
      meal.matchedProducts.forEach((productName) => names.add(productName));
    });

    const allAddOns = [...pantryItems, ...cupboardItems];
    return allAddOns.filter((item) => names.has(item.name)).slice(0, 6);
  }, [week]);

  const fromBoxIngredients = useMemo(() => {
    const ingredientSet = new Set<string>();
    week.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const lower = ingredient.toLowerCase();
        if (
          [
            "carrots",
            "potatoes",
            "greens",
            "tomatoes",
            "peppers",
            "courgette",
            "mushrooms",
            "roots",
            "squash",
            "cauliflower",
            "beetroot",
          ].includes(lower)
        ) {
          ingredientSet.add(ingredient);
        }
      });
    });
    return Array.from(ingredientSet);
  }, [week]);

  useEffect(() => {
    if (step !== "building") return;

    setLoadingIndex(0);

    const interval = window.setInterval(() => {
      setLoadingIndex((current) => {
        if (current >= LOADING_MESSAGES.length - 1) return current;
        return current + 1;
      });
    }, 7000);

    const reveal = window.setTimeout(() => {
      const plannedWeek = buildWeek(mood, nights, focus);
      setWeek(
        plannedWeek.map((meal, index) => ({
          ...meal,
          day: DAY_NAMES[index] ?? meal.day,
        })),
      );
      setOpenDay(plannedWeek[0]?.id ?? null);
      setStep("results");
    }, 45000);

    return () => {
      window.clearInterval(interval);
      window.clearTimeout(reveal);
    };
  }, [step, mood, nights, focus]);

  function handleBuildWeek() {
    setStep("building");
  }

  function handleSwapDay(dayId: string) {
    setWeek((current) =>
      current.map((meal) => {
        if (meal.id !== dayId) return meal;

        return {
          ...meal,
          title: "Roast veg with grains and a good finish",
          description:
            "A more flexible plate built from what is already in the week.",
          image: IMAGE_POOL[0],
          ingredients: ["Roast vegetables", "Grains", "Lemon", "Herbs"],
          matchedProducts: ["Giant Couscous", "Farro", "Rose Harissa"],
          steps: [
            "Roast whatever vegetables you have until coloured and tender.",
            "Cook the grain until soft enough to eat warm or cold.",
            "Dress with lemon, olive oil, and black pepper.",
            "Finish with herbs or a spoon of something punchy from the fridge.",
          ],
        };
      }),
    );
  }

  function addProductByName(productName: string) {
    const product = [...produceBoxes, ...pantryItems, ...cupboardItems].find(
      (item) => item.name === productName,
    );

    if (!product) return;

    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      checkoutType: product.checkoutType,
    });
  }

  function addAllAddOns() {
    recommendedAddOns.forEach((item) => {
      addToCart({
        name: item.name,
        price: item.price,
        image: item.image,
        category: item.category,
        checkoutType: item.checkoutType,
      });
    });
  }

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[rgba(230,221,210,0.86)] px-4 pb-6 pt-5 sm:px-6 md:px-10 md:pb-8 md:pt-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-4 flex items-center justify-between border-b border-[rgba(221,212,200,0.9)] pb-4">
            <Link href="/" className="text-sm tracking-[0.35em] text-[#60705f]">
              THE LOCAL PANTRY
            </Link>

            <div className="flex items-center gap-3">
              <Link href="/shop" className="text-sm text-[#5f675c]">
                Shop
              </Link>
              <Link href="/basket" className="text-sm text-[#243328]">
                Basket{totalBasketItems > 0 ? ` (${totalBasketItems})` : ""}
              </Link>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <article className="rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_12px_30px_rgba(36,51,40,0.06)] md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#6b776c]">
                Weekly planner
              </p>

              <h1 className="mt-3 max-w-3xl font-serif text-[2rem] leading-[1.02] tracking-tight text-[#243328] md:text-[3.35rem]">
                Plan your week
              </h1>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5f675c] md:text-base">
                A few quick choices, then we’ll build your meals for the week
                ahead.
              </p>

              {step === "choices" ? (
                <div className="mt-8 space-y-7">
                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      How many nights?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[3, 4, 5, 6].map((value) => (
                        <ChoiceChip
                          key={value}
                          active={nights === value}
                          label={`${value} nights`}
                          onClick={() => setNights(value)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      What kind of week?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <ChoiceChip
                        active={mood === "quick"}
                        label="Quick & easy"
                        onClick={() => setMood("quick")}
                      />
                      <ChoiceChip
                        active={mood === "balanced"}
                        label="Balanced"
                        onClick={() => setMood("balanced")}
                      />
                      <ChoiceChip
                        active={mood === "comforting"}
                        label="Comforting"
                        onClick={() => setMood("comforting")}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-sm font-medium text-[#243328]">
                      Anything to lean into?
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <ChoiceChip
                        active={focus === "veg-heavy"}
                        label="Veg-heavy"
                        onClick={() =>
                          setFocus((current) =>
                            current === "veg-heavy" ? null : "veg-heavy",
                          )
                        }
                      />
                      <ChoiceChip
                        active={focus === "low-waste"}
                        label="Low waste"
                        onClick={() =>
                          setFocus((current) =>
                            current === "low-waste" ? null : "low-waste",
                          )
                        }
                      />
                      <ChoiceChip
                        active={focus === "family-friendly"}
                        label="Family-friendly"
                        onClick={() =>
                          setFocus((current) =>
                            current === "family-friendly"
                              ? null
                              : "family-friendly",
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-1">
                    <button
                      type="button"
                      onClick={handleBuildWeek}
                      className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                    >
                      Build my week
                    </button>

                    <Link
                      href="/shop"
                      className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                    >
                      Browse the shop
                    </Link>
                  </div>
                </div>
              ) : step === "building" ? (
                <div className="mt-8 rounded-[22px] border border-[#e1d8cc] bg-white/72 p-6">
                  <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
                    Building your week
                  </p>

                  <h2 className="mt-2 font-serif text-[1.6rem] leading-tight text-[#243328]">
                    {LOADING_MESSAGES[loadingIndex]}
                  </h2>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-[#667164]">
                    This takes a little longer because the week is being put
                    together as one complete plan, not as a set of disconnected
                    recipe ideas.
                  </p>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-[rgba(221,212,200,0.95)]">
                    <div
                      className="h-full rounded-full bg-[#243328] transition-all duration-700"
                      style={{
                        width: `${((loadingIndex + 1) / LOADING_MESSAGES.length) * 100}%`,
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const plannedWeek = buildWeek(mood, nights, focus);
                      setWeek(
                        plannedWeek.map((meal, index) => ({
                          ...meal,
                          day: DAY_NAMES[index] ?? meal.day,
                        })),
                      );
                      setOpenDay(plannedWeek[0]?.id ?? null);
                      setStep("results");
                    }}
                    className="mt-6 text-sm text-[#243328] underline underline-offset-4"
                  >
                    See my week now
                  </button>
                </div>
              ) : (
                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setStep("choices")}
                    className="rounded-full bg-[#243328] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
                  >
                    Plan another week
                  </button>
                  <Link
                    href="/basket"
                    className="rounded-full border border-[#d6cec2] bg-white/80 px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                  >
                    Review basket
                  </Link>
                </div>
              )}
            </article>

            <article className="overflow-hidden rounded-[28px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]">
              <div className="relative min-h-[280px]">
                <img
                  src="/hero.jpg"
                  alt="The Local Pantry planner"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0.28)_52%,rgba(0,0,0,0.42)_100%)]" />
                <div className="relative z-10 flex min-h-[280px] items-end p-6 text-white md:p-7">
                  <div className="max-w-md">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-white/80">
                      Food first
                    </p>
                    <h2 className="mt-2 font-serif text-[1.9rem] leading-tight md:text-[2.35rem]">
                      A full week that still feels good to cook
                    </h2>
                    <p className="mt-3 text-sm leading-6 text-white/86">
                      The planner should look useful before you cook, and become
                      more useful once you are actually in the kitchen.
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {step === "results" ? (
        <>
          <section className="px-4 py-8 sm:px-6 md:px-10 md:py-10">
            <div className="mx-auto max-w-7xl">
              <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#6b776c]">
                    Your week
                  </p>
                  <h2 className="mt-1 font-serif text-[2rem] leading-tight text-[#243328] md:text-[2.8rem]">
                    Your meals, already mapped out
                  </h2>
                </div>

                <p className="max-w-xl text-sm leading-6 text-[#667164]">
                  Open the steps when you need them. Leave them closed when you
                  just want to see the week at a glance.
                </p>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                {week.map((meal) => {
                  const isOpen = openDay === meal.id;

                  return (
                    <article
                      key={meal.id}
                      className="overflow-hidden rounded-[26px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.86)] shadow-[0_10px_24px_rgba(36,51,40,0.05)]"
                    >
                      <img
                        src={meal.image}
                        alt={meal.title}
                        className="h-56 w-full object-cover"
                      />

                      <div className="p-5 md:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-[11px] uppercase tracking-[0.16em] text-[#6b776c]">
                              {meal.day}
                            </p>
                            <h3 className="mt-1 font-serif text-[1.55rem] leading-tight text-[#243328]">
                              {meal.title}
                            </h3>
                            <p className="mt-3 text-sm leading-6 text-[#667164]">
                              {meal.description}
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSwapDay(meal.id)}
                            className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.84)] px-3.5 py-1.5 text-xs font-medium text-[#243328] transition hover:bg-white"
                          >
                            Swap
                          </button>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {meal.ingredients.map((ingredient) => (
                            <span
                              key={`${meal.id}-${ingredient}`}
                              className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]"
                            >
                              {ingredient}
                            </span>
                          ))}
                        </div>

                        <div className="mt-5 rounded-[20px] border border-[#e6ddd2] bg-[rgba(249,246,241,0.78)] p-4">
                          <button
                            type="button"
                            onClick={() =>
                              setOpenDay((current) =>
                                current === meal.id ? null : meal.id,
                              )
                            }
                            className="flex w-full items-center justify-between gap-4 text-left"
                          >
                            <span className="text-sm font-medium text-[#243328]">
                              Cooking steps
                            </span>
                            <span className="text-xs text-[#5f675c]">
                              {isOpen ? "Hide" : "Show"}
                            </span>
                          </button>

                          {isOpen ? (
                            <ol className="mt-4 space-y-2.5 text-sm leading-6 text-[#5f675c]">
                              {meal.steps.map((stepText, index) => (
                                <li
                                  key={`${meal.id}-step-${index}`}
                                  className="flex items-start gap-3"
                                >
                                  <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#d6cec2] text-[10px] text-[#243328]">
                                    {index + 1}
                                  </span>
                                  <span>{stepText}</span>
                                </li>
                              ))}
                            </ol>
                          ) : null}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="border-t border-[rgba(230,221,210,0.86)] px-4 py-8 sm:px-6 md:px-10 md:py-10">
            <div className="mx-auto max-w-7xl">
              <div className="grid gap-4 lg:grid-cols-[0.96fr_1.04fr]">
                <article className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(255,255,255,0.84)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-6">
                  {!hasProduceBox ? (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                        Start your week
                      </p>
                      <h2 className="mt-1 font-serif text-[1.65rem] leading-tight text-[#243328]">
                        Add a veg box to make the week work
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                        The produce box gives the week its base. Then the rest
                        of the plan can sit on top of it naturally.
                      </p>

                      <div className="mt-5 grid gap-4">
                        {weeklyProduceBox
                          ? compactCardItem(weeklyProduceBox, () =>
                              addProductByName(weeklyProduceBox.name),
                            )
                          : null}

                        {familyProduceBox
                          ? compactCardItem(familyProduceBox, () =>
                              addProductByName(familyProduceBox.name),
                            )
                          : null}
                      </div>

                      <p className="mt-5 text-sm text-[#667164]">
                        Then add the rest of this week to your basket.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                        Your shop is ready
                      </p>
                      <h2 className="mt-1 font-serif text-[1.65rem] leading-tight text-[#243328]">
                        Add the rest of this week to your basket
                      </h2>
                      <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                        Your produce box is already doing the base work. These
                        are the pantry adds that fit the plan best.
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {fromBoxIngredients.map((item) => (
                          <span
                            key={`from-box-${item}`}
                            className="rounded-full border border-[#ddd4c8] bg-[rgba(247,242,235,0.82)] px-3 py-1.5 text-xs font-medium text-[#4f5e52]"
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={addAllAddOns}
                          className="rounded-full bg-[#243328] px-6 py-3 text-sm font-medium text-white transition hover:opacity-90"
                        >
                          Add this week to my basket
                        </button>

                        <Link
                          href="/basket"
                          className="rounded-full border border-[#d6cec2] bg-[rgba(247,242,235,0.88)] px-5 py-3 text-sm text-[#243328] transition hover:bg-white"
                        >
                          Review basket
                        </Link>
                      </div>
                    </>
                  )}
                </article>

                <article className="rounded-[24px] border border-[rgba(221,212,200,0.95)] bg-[rgba(247,242,235,0.84)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.18em] text-[#6b776c]">
                        Pantry adds
                      </p>
                      <h2 className="mt-1 font-serif text-[1.65rem] leading-tight text-[#243328]">
                        A few good things that fit this plan
                      </h2>
                    </div>

                    {recommendedAddOns.length > 0 ? (
                      <div className="rounded-full border border-[#ddd4c8] bg-white/75 px-3 py-1.5 text-xs text-[#4f5e52]">
                        {recommendedAddOns.length} picks
                      </div>
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                    Useful pantry pieces to help the week land properly, without
                    pretending the shop needs to be huge.
                  </p>

                  {recommendedAddOns.length > 0 ? (
                    <div className="mt-5 grid gap-4 md:grid-cols-2">
                      {recommendedAddOns.map((item) =>
                        compactCardItem(item, () =>
                          addProductByName(item.name),
                        ),
                      )}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm text-[#667164]">
                      As you swap days and shape the week, the best matching
                      pantry pieces will show up here.
                    </p>
                  )}
                </article>
              </div>
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}
