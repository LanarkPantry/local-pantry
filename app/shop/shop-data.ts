export type ShopDisplayItem = {
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

export const produceBoxes: ShopDisplayItem[] = [
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

export const pantryItems: ShopDisplayItem[] = [
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

export const cupboardItems: ShopDisplayItem[] = [
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

export const extraItems: ShopDisplayItem[] = [
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

export const allShopItems: ShopDisplayItem[] = [
  ...produceBoxes,
  ...pantryItems,
  ...cupboardItems,
  ...extraItems,
];
