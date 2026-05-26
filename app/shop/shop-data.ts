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
    description: "A flexible weekly produce base for everyday cooking.",
    details:
      "Contents shift slightly through the seasons depending on availability.",
  },
  {
    name: "Family Produce Box",
    price: 30,
    image: "/family-harvest-box.png",
    category: "boxes",
    checkoutType: "subscription",
    buttonLabel: "Add family box",
    description:
      "A fuller weekly produce box for households that cook most nights.",
    details:
      "Contents shift slightly through the seasons depending on availability.",
  },
];

export const pantryItems: ShopDisplayItem[] = [
  {
    name: "Sorrel & Walnut Pesto",
    price: 4.5,
    image: "/sorrel-walnut-pesto.png",
    category: "pantry",
    checkoutType: "one-off",
    description:
      "A fresh savoury jar for pasta, potatoes or roasted vegetables.",
    details: "Add when you want something quick and green in the fridge.",
    note: "Usually added as a one-off",
  },
  {
    name: "Rose Harissa",
    price: 5.25,
    image: "/rose-harissa.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A gently spiced jar for beans, grains and roast vegetables.",
    details:
      "A small spoonful brings warmth without making dinner complicated.",
    note: "Usually added as a one-off",
  },
  {
    name: "Salted Caramel Sauce",
    price: 5.0,
    image: "/salted-caramel.png",
    category: "pantry",
    checkoutType: "one-off",
    description: "A rich sweet jar for desserts, yoghurt, toast or baking.",
    details: "A simple cupboard treat to add when you want one.",
    note: "Usually added as a one-off",
  },
  {
    name: "Dark Chocolate & Hazelnut Spread",
    price: 5.0,
    image: "/dark-chocolate.png",
    category: "pantry",
    checkoutType: "one-off",
    description:
      "A darker chocolate spread for toast, baking or simple puddings.",
    details: "An easy sweet extra to keep in the cupboard.",
    note: "Usually added as a one-off",
  },
];

export const cupboardItems: ShopDisplayItem[] = [
  {
    name: "Bold Bean Co Queen Butter Beans",
    price: 3.5,
    image: "/images/shop/butter-beans.png",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "540g",
    description:
      "Large soft butter beans for fast dinners, traybakes and simple weeknight cooking.",
    details: "Works well with tomatoes, harissa, greens and roast vegetables.",
    note: "Usually added as a one-off",
  },
  {
    name: "Bold Bean Co Queen Chickpeas",
    price: 3.5,
    image: "/images/shop/chickpeas.png",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "540g",
    description:
      "Tender jarred chickpeas for quick bowls, traybakes and easy dinners.",
    details: "Works well with harissa, tomatoes, herbs, couscous and tahini.",
    note: "Usually added as a one-off",
  },
  {
    name: "Bold Bean Co Queen White Beans",
    price: 3.5,
    image: "/images/shop/white-beans.png",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "540g",
    description:
      "Creamy white beans for soups, greens, tomato dishes and simple bowls.",
    details: "Works well with garlic, lemon, miso, herbs and soft vegetables.",
    note: "Usually added as a one-off",
  },
  {
    name: "Mutti Polpa Tomatoes",
    price: 1.5,
    image: "/images/shop/mutti-polpa.png",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "400g",
    description:
      "Finely chopped tomatoes for sauces, beans and quick one-pan meals.",
    details: "One of the most useful bases to keep in the cupboard.",
    note: "Usually added as a one-off",
  },
  {
    name: "Bucatini",
    price: 3.5,
    image: "/images/shop/bucatini.png",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "Hollow pasta with extra bite for tomato sauces, pesto and creamy dishes.",
    details: "A satisfying pasta shape that still feels easy to cook.",
    note: "Usually added as a one-off",
  },
  {
    name: "Casarecce Pasta",
    price: 2.95,
    image: "/images/cupboard/casarecce.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A useful pasta shape for pesto, roasted vegetables, greens and jarred sauces.",
    details:
      "Good when you want something simple but a little more interesting.",
    note: "Usually added as a one-off",
  },
  {
    name: "Orzo Pasta",
    price: 2.75,
    image: "/images/cupboard/orzo.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A small pasta for quick bowls, soups, traybakes and easy midweek cooking.",
    details: "Useful when you want something fast, flexible and not too heavy.",
    note: "Usually added as a one-off",
  },
  {
    name: "Giant Couscous",
    price: 3.75,
    image: "/images/cupboard/giant-couscous.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description: "A flexible cupboard staple that works warm or cold.",
    details: "Good with roast vegetables, herbs, dressings and punchy jars.",
    note: "Usually added as a one-off",
  },
  {
    name: "Polenta",
    price: 4.0,
    image: "/images/cupboard/polenta.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A soft comforting base for roasted vegetables, beans and simple suppers.",
    details: "Naturally gluten-free and useful for quick savoury bowls.",
    note: "Usually added as a one-off",
  },
  {
    name: "Puy Lentils",
    price: 4.5,
    image: "/images/cupboard/puy-lentils.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "Structured lentils for warm salads, batch cooking, bowls and sides.",
    details: "Useful to cook ahead and keep in the fridge for quick meals.",
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
      "A versatile rice for risotto-style cooking, simple sides and puddings.",
    details: "A flexible cupboard basic that works sweet or savoury.",
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
      "A nutty chewy grain for bowls, salads and simple vegetable-led dinners.",
    details:
      "Works well with roast vegetables, herbs, soft cheeses and harissa.",
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
      "An everyday nut for baking, breakfast, salads and simple cooking.",
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
      "A savoury-leaning extra for grains, leaves, roast veg and cheese.",
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
      "A slightly special nut for sweet things, baking and darker flavours.",
    note: "Usually added as a one-off",
  },
  {
    name: "Cashews",
    price: 4.25,
    image: "/images/extras/cashews.jpg",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description: "A soft useful nut for snacking, cooking and adding richness.",
    note: "Usually added as a one-off",
  },
];

export const allShopItems: ShopDisplayItem[] = [
  ...produceBoxes,
  ...pantryItems,
  ...cupboardItems,
  ...extraItems,
];
