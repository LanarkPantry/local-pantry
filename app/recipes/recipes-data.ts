export type RecipeProduct = {
  name: string;
  price: number;
  image: string;
};

export type Recipe = {
  slug: string;
  title: string;
  image: string;
  alt: string;
  intro: string;
  body: string;
  pantryLabel: string;
  product: RecipeProduct;
  companionItems: RecipeProduct[];
  shopAnchor: string;
  shopLabel: string;
  category: "savoury" | "sweet";
  time: string;
  tags: string[];
};

export const recipes: Recipe[] = [
  {
    slug: "rose-harissa-carrots-chickpeas",
    title: "Rose Harissa Carrots & Chickpeas",
    image: "/images/recipes/rose-harissa-carrots.jpg",
    alt: "Roast carrots and chickpeas with rose harissa",
    intro:
      "A warm, easy traybake-style supper with sweetness, spice, and very little effort.",
    body: "Roast carrots until soft and catching at the edges, then add chickpeas and a spoon of rose harissa. Finish with yoghurt, herbs, or a little lemon if you have it.",
    pantryLabel: "Made with Rose Harissa",
    product: {
      name: "Rose Harissa",
      price: 5.25,
      image: "/rose-harissa.png",
    },
    companionItems: [
      {
        name: "Giant Couscous",
        price: 4.75,
        image: "/images/cupboard/giant-couscous.jpg",
      },
      {
        name: "Puy Lentils",
        price: 4.95,
        image: "/images/cupboard/puy-lentils.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
    category: "savoury",
    time: "30 mins",
    tags: ["traybake", "weeknight", "warming"],
  },
  {
    slug: "pesto-roast-potatoes",
    title: "Pesto Roast Potatoes",
    image: "/images/recipes/pesto-roast-potatoes.jpg",
    alt: "Crisp roast potatoes tossed with pesto",
    intro:
      "Crisp potatoes, a spoon of pesto, and dinner feels more or less sorted.",
    body: "Roast potatoes until golden, then toss with sorrel and walnut pesto while still hot. Add greens, beans, or an egg on top if you want to make it more of a meal.",
    pantryLabel: "Made with Sorrel & Walnut Pesto",
    product: {
      name: "Sorrel & Walnut Pesto",
      price: 4.5,
      image: "/sorrel-walnut-pesto.png",
    },
    companionItems: [
      {
        name: "Casarecce Pasta",
        price: 4.95,
        image: "/images/cupboard/casarecce.jpg",
      },
      {
        name: "Walnuts",
        price: 5.5,
        image: "/images/extras/walnuts.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
    category: "savoury",
    time: "35 mins",
    tags: ["simple", "comforting", "flexible"],
  },
  {
    slug: "chocolate-yogurt-pots",
    title: "Chocolate Yogurt Pots",
    image: "/images/recipes/chocolate-recipe.jpg",
    alt: "Yoghurt with dark chocolate and hazelnut spread",
    intro:
      "A very easy pudding or afternoon treat that feels a little special without much work.",
    body: "Spoon thick yoghurt into bowls or jars, swirl through a little dark chocolate and hazelnut spread, then finish with chopped fruit, toasted nuts, or biscuit crumbs if you have them.",
    pantryLabel: "Made with Dark Chocolate & Hazelnut Spread",
    product: {
      name: "Dark Chocolate & Hazelnut Spread",
      price: 5.0,
      image: "/dark-chocolate.png",
    },
    companionItems: [
      {
        name: "Hazelnuts",
        price: 5.95,
        image: "/images/extras/hazelnuts.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop sweet jars",
    category: "sweet",
    time: "10 mins",
    tags: ["quick", "dessert", "no-fuss"],
  },
  {
    slug: "salted-caramel-apple-toast",
    title: "Salted Caramel Apple Toast",
    image: "/images/recipes/caramel-recipe.jpg",
    alt: "Toast with salted caramel sauce and sliced apple",
    intro:
      "The kind of quick sweet thing that works for breakfast, pudding, or a late snack.",
    body: "Toast good bread, spread with a little salted caramel sauce, then top with thin apple slices and a pinch of salt or cinnamon. Soft pears work well too.",
    pantryLabel: "Made with Salted Caramel Sauce",
    product: {
      name: "Salted Caramel Sauce",
      price: 5.0,
      image: "/salted-caramel.png",
    },
    companionItems: [
      {
        name: "Almonds",
        price: 4.95,
        image: "/images/extras/almonds.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop sweet jars",
    category: "sweet",
    time: "10 mins",
    tags: ["breakfast", "sweet", "quick"],
  },
];

export const useItUpIdeas = [
  {
    title: "Everything Smoothie",
    text: "Use soft fruit, yoghurt or milk, and something to thicken if needed. Frozen fruit works beautifully too.",
  },
  {
    title: "Soup from Almost Anything",
    text: "Soften veg, add stock or water, then blend if you want it smooth. A spoon of pesto or harissa helps bring it together.",
  },
  {
    title: "End-of-Week Roast Tin",
    text: "Roast whatever needs using up with oil and salt, then finish with something punchy at the end.",
  },
  {
    title: "Things on Toast",
    text: "Beans, greens, leftovers, soft tomatoes, mushrooms, eggs — if it’s warm and good on bread, it counts.",
  },
  {
    title: "Big Bowl of Bits",
    text: "Grains, leaves, roast veg, herbs, and a spoon of something useful from the fridge makes a very good lunch.",
  },
  {
    title: "Soft Fruit Compote",
    text: "If berries, plums, apples, or pears are on their way out, cook them down gently and spoon over yoghurt, porridge, or toast.",
  },
];

export const prompts = [
  {
    ingredient: "Carrots",
    idea: "Roast until sweet, then add harissa, herbs, or yoghurt.",
  },
  {
    ingredient: "Potatoes",
    idea: "Roast well, then finish with pesto or a sharp dressing.",
  },
  {
    ingredient: "Tomatoes",
    idea: "Cook down gently for sauce, or roast until jammy.",
  },
  {
    ingredient: "Greens",
    idea: "Wilt into soups, beans, pasta, or eggs right at the end.",
  },
  {
    ingredient: "Soft fruit",
    idea: "Blend into smoothies, spoon over yoghurt, or cook into compote.",
  },
  {
    ingredient: "Good bread",
    idea: "Use for toast, tartines, or quick sweet things with fruit and a jar.",
  },
];
