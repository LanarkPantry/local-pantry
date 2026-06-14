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
    name: "Harvest Box",
    price: 20,
    image: "/weekly-harvest-box-v2.png",
    category: "boxes",
    checkoutType: "subscription",
    buttonLabel: "Add weekly box",
    description: "A flexible weekly produce base for everyday cooking.",
    details:
      "Contents shift slightly through the seasons depending on availability.",
  },
  {
    name: "Family Harvest Box",
    price: 30,
    image: "/family-harvest-box-v2.png",
    category: "boxes",
    checkoutType: "subscription",
    buttonLabel: "Add family box",
    description: "A fuller Harvest Box for households that cook most nights.",
    details:
      "Contents shift slightly through the seasons depending on availability.",
  },
];

export const pantryItems: ShopDisplayItem[] = [
  {
    name: "Sorrel & Walnut Pesto",
    price: 3.95,
    image: "/images/pantry/sorrel-walnut-pesto.jpg",
    category: "pantry",
    checkoutType: "one-off",
    description:
      "A fresh savoury pesto made with sorrel, walnuts and parmesan.",
    details:
      "Use with pasta, potatoes, beans, orzo, roast vegetables and warm grains.",
    note: "Usually added as a one-off",
    weight: "200ml",
  },
  {
    name: "Rose Harissa Paste",
    price: 3.95,
    image: "/images/pantry/rose-harissa.jpg",
    category: "pantry",
    checkoutType: "one-off",
    description:
      "A fragrant North African-inspired chilli paste with warmth rather than intense heat.",
    details:
      "Excellent with butter beans, white beans, chicken traybakes, couscous, grains and dressings.",
    note: "Usually added as a one-off",
    weight: "200ml",
  },
  {
    name: "Vegetable Stock",
    price: 3.5,
    image: "/images/pantry/vegetable-stock.jpg",
    category: "pantry",
    checkoutType: "one-off",
    description:
      "A concentrated vegetable stock made for soups, risottos, grains, sauces and everyday cooking.",
    details:
      "Adds depth to risotto rice, farro, couscous, beans and simple one-pan dinners.",
    note: "Usually added as a one-off",
    weight: "200ml",
  },
  {
    name: "Gochujang Sauce",
    price: 3.95,
    image: "/images/pantry/gochujang-sauce.jpg",
    category: "pantry",
    checkoutType: "one-off",
    description:
      "A sweet, savoury and gently spicy Korean-inspired cooking sauce.",
    details:
      "Ideal for chicken rice bowls, noodles, sticky chickpeas, tomato beans and quick midweek dinners.",
    note: "Usually added as a one-off",
    weight: "200ml",
  },
];

export const dryGoodsItems: ShopDisplayItem[] = [
  {
    name: "Farro",
    price: 3.95,
    image: "/images/cupboard/farro.jpg?v=2",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A nutty chewy grain for bowls, salads and simple vegetable-led dinners.",
    details:
      "Works well with roast vegetables, herbs, apples, walnuts, pesto and harissa.",
    note: "Usually added as a one-off",
  },
  {
    name: "Polenta",
    price: 2.75,
    image: "/images/cupboard/polenta.jpg",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A soft comforting base for roasted vegetables, beans and simple suppers.",
    details:
      "Naturally gluten-free and useful with roast tomatoes, mushrooms, greens and white beans.",
    note: "Usually added as a one-off",
  },
  {
    name: "Bucatini",
    price: 3.5,
    image: "/images/cupboard/bucatini.jpg",
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
    image: "/images/cupboard/orzo.jpg?v=2",
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
    name: "Puy Lentils",
    price: 3.95,
    image: "/images/cupboard/puy-lentils.jpg?v=2",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "Structured lentils for warm salads, batch cooking, bowls and sides.",
    details:
      "Useful with beetroot, apple, walnuts, squash, herbs and harissa dressings.",
    note: "Usually added as a one-off",
  },
  {
    name: "Risotto Rice",
    price: 3.75,
    image: "/images/cupboard/risotto-rice.jpg?v=2",
    category: "cupboard",
    checkoutType: "one-off",
    weight: "500g",
    description: "risotto rice for creamy risottos, simple sides and puddings.",
    details:
      "Works well with mushrooms, peas, lemon, roast tomatoes, chicken, greens and vegetable stock.",
    note: "Usually added as a one-off",
  },
];

export const extraItems: ShopDisplayItem[] = [
  {
    name: "Blanched Almonds",
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
    image: "/images/extras/walnuts.jpg?v=2",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A savoury-leaning extra for grains, leaves, apples, roast veg and cheese.",
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
      "A slightly special nut for salads, pears, baking and darker flavours.",
    note: "Usually added as a one-off",
  },
  {
    name: "Cashews",
    price: 4.25,
    image: "/images/extras/cashews.jpg?v=2",
    category: "extras",
    checkoutType: "one-off",
    weight: "500g",
    description:
      "A soft useful nut for snacking, noodles, sauces and adding richness.",
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
    details:
      "Works well with harissa, gochujang, tomatoes, greens and roast vegetables.",
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
    details:
      "Works well with harissa, gochujang, roast broccoli, tomatoes, herbs, couscous and tahini.",
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
    details:
      "Works well with harissa, gochujang, roast tomatoes, garlic, lemon, herbs and soft vegetables.",
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
      "Finely chopped tomatoes for sauces, beans, risottos and quick one-pan meals.",
    details:
      "One of the most useful bases to keep in the cupboard, especially with white beans and risotto rice.",
    note: "Usually added as a one-off",
  },
];

export const allShopItems: ShopDisplayItem[] = [
  ...produceBoxes,
  ...pantryItems,
  ...dryGoodsItems,
  ...extraItems,
  ...cupboardItems,
];
