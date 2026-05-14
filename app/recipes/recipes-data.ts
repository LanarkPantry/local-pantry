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
    slug: "charred-courgette-bucatini-pesto",
    title: "Charred Courgette Bucatini with Sorrel-Walnut Pesto",
    image: "/images/recipes/charred-courgette-bucatini.jpg",
    alt: "Bucatini pasta with charred courgette and green pesto",
    intro:
      "Silky bucatini, sweet charred courgettes, and a sharp green pesto that makes the whole bowl feel fresh, rich, and properly useful.",
    body: "Cook the bucatini until just tender. While it cooks, slice courgettes and sear them hard in a hot pan with olive oil and salt until golden at the edges. Loosen the sorrel and walnut pesto with a splash of pasta water, then toss through the bucatini with the courgettes. Finish with lemon zest, black pepper, and extra herbs if you have them.",
    pantryLabel: "Made with Sorrel & Walnut Pesto",
    product: {
      name: "Sorrel & Walnut Pesto",
      price: 4.5,
      image: "/sorrel-walnut-pesto.png",
    },
    companionItems: [
      {
        name: "Bucatini",
        price: 4.95,
        image: "/images/cupboard/bucatini.jpg",
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
    time: "25 mins",
    tags: ["pasta", "herby", "weeknight"],
  },
  {
    slug: "harissa-butter-beans-roast-peppers",
    title: "Harissa Butter Beans with Roast Peppers & Herby Couscous",
    image: "/images/recipes/harissa-butter-beans-peppers.jpg",
    alt: "Rose harissa butter beans with roast peppers and couscous",
    intro:
      "Creamy butter beans, smoky rose harissa, sweet roast peppers, and herbs over couscous for a warm bowl that feels generous without being heavy.",
    body: "Roast sliced peppers with olive oil and salt until soft and lightly blistered. Warm butter beans in a pan with a spoon of rose harissa, a splash of water or stock, and a little lemon. Cook giant couscous until tender, then fold through herbs and olive oil. Serve the beans and peppers over the couscous with yoghurt, coriander, or extra lemon if you like.",
    pantryLabel: "Made with Rose Harissa",
    product: {
      name: "Rose Harissa",
      price: 5.25,
      image: "/rose-harissa.png",
    },
    companionItems: [
      {
        name: "Butter Beans",
        price: 3.95,
        image: "/images/cupboard/butter-beans.jpg",
      },
      {
        name: "Giant Couscous",
        price: 4.75,
        image: "/images/cupboard/giant-couscous.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
    category: "savoury",
    time: "30 mins",
    tags: ["beans", "warming", "bowl"],
  },
  {
    slug: "miso-mushroom-orzo-crispy-greens",
    title: "Miso Mushroom Orzo with Crispy Greens",
    image: "/images/recipes/miso-mushroom-orzo.jpg",
    alt: "Miso mushroom orzo with crispy greens",
    intro:
      "Soft spoonable orzo with mushrooms, white miso, and greens cooked until crisp at the edges. Deep, savoury, and still very simple.",
    body: "Cook mushrooms in olive oil until they give off their liquid and begin to brown. Stir in orzo, a little vegetable stock, and a small spoon of white miso, then simmer until the orzo is tender and glossy. In a separate pan, cook chopped greens with oil and salt until wilted and crisp in places. Spoon the greens over the orzo and finish with black pepper and a squeeze of lemon.",
    pantryLabel: "Made with White Miso",
    product: {
      name: "White Miso",
      price: 4.75,
      image: "/white-miso.png",
    },
    companionItems: [
      {
        name: "Orzo",
        price: 4.75,
        image: "/images/cupboard/orzo.jpg",
      },
      {
        name: "Vegetable Stock Concentrate",
        price: 4.5,
        image: "/images/pantry/vegetable-stock-concentrate.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
    category: "savoury",
    time: "30 mins",
    tags: ["orzo", "savoury", "comforting"],
  },
  {
    slug: "gochujang-broccoli-sticky-chickpeas",
    title: "Gochujang Broccoli with Sticky Chickpeas",
    image: "/images/recipes/gochujang-broccoli-chickpeas.jpg",
    alt: "Gochujang broccoli with sticky chickpeas and rice",
    intro:
      "Roasted broccoli, sticky chickpeas, and a glossy gochujang coating. Punchy enough to feel fun, practical enough for a normal night.",
    body: "Roast broccoli florets and chickpeas with oil and salt until the broccoli edges char and the chickpeas firm up. Stir gochujang with a little water, lime, and a touch of honey or sugar if you use it. Toss the hot chickpeas through the sauce, then serve with rice, cucumber, herbs, and extra lime.",
    pantryLabel: "Made with Signature Gochujang",
    product: {
      name: "Signature Gochujang",
      price: 5.25,
      image: "/gochujang.png",
    },
    companionItems: [
      {
        name: "Chickpeas",
        price: 3.75,
        image: "/images/cupboard/chickpeas.jpg",
      },
      {
        name: "Risotto Rice",
        price: 4.95,
        image: "/images/cupboard/risotto-rice.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
    category: "savoury",
    time: "30 mins",
    tags: ["punchy", "traybake", "rice bowl"],
  },
  {
    slug: "jammy-tomato-casarecce-basil-oil",
    title: "Jammy Tomato Casarecce with Basil Oil",
    image: "/images/recipes/jammy-tomato-casarecce.jpg",
    alt: "Casarecce pasta with jammy tomato sauce and basil oil",
    intro:
      "A tomato pasta that feels richer than the effort involved: glossy sauce, sauce-catching casarecce, basil oil, and black pepper.",
    body: "Cook whole tomatoes gently with olive oil, garlic, salt, and black pepper until they collapse into a thick jammy sauce. Cook casarecce until al dente, then toss through the sauce with a splash of pasta water. Tear basil into olive oil with a pinch of salt and spoon it over the pasta just before serving.",
    pantryLabel: "Made with Premium Whole Tomatoes",
    product: {
      name: "Premium Whole Tomatoes",
      price: 3.95,
      image: "/images/cupboard/whole-tomatoes.jpg",
    },
    companionItems: [
      {
        name: "Casarecce Pasta",
        price: 4.95,
        image: "/images/cupboard/casarecce.jpg",
      },
      {
        name: "Almonds",
        price: 4.95,
        image: "/images/extras/almonds.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
    category: "savoury",
    time: "35 mins",
    tags: ["pasta", "tomato", "family-friendly"],
  },
  {
    slug: "beetroot-farro-walnuts-dill",
    title: "Roast Beetroot Farro with Walnuts & Dill",
    image: "/images/recipes/beetroot-farro-walnuts.jpg",
    alt: "Roast beetroot farro bowl with walnuts and dill",
    intro:
      "Earthy roast beetroot, nutty farro, walnuts, dill, and lemon. A sturdy bowl that still feels bright and fresh.",
    body: "Roast beetroot wedges with oil and salt until tender and dark at the edges. Cook farro until chewy and drain well. Toss the warm farro with lemon, olive oil, chopped dill, and black pepper, then fold through the beetroot. Finish with walnuts and yoghurt or tahini if you want something creamy.",
    pantryLabel: "Made with Farro",
    product: {
      name: "Farro",
      price: 4.95,
      image: "/images/cupboard/farro.jpg",
    },
    companionItems: [
      {
        name: "Walnuts",
        price: 5.5,
        image: "/images/extras/walnuts.jpg",
      },
      {
        name: "Tahini",
        price: 4.95,
        image: "/images/pantry/tahini.jpg",
      },
    ],
    shopAnchor: "/shop#pantry-additions",
    shopLabel: "Shop pantry range",
    category: "savoury",
    time: "40 mins",
    tags: ["grain bowl", "herby", "make-ahead"],
  },
  {
    slug: "salted-caramel-pear-toast-almonds",
    title: "Salted Caramel Pear Toast with Toasted Almonds",
    image: "/images/recipes/salted-caramel-pear-toast.jpg",
    alt: "Toast with salted caramel pear and toasted almonds",
    intro:
      "A quick sweet plate with warm toast, soft pear, salted caramel, and toasted almonds. More interesting than pudding, easier than baking.",
    body: "Toast good bread until crisp. Slice ripe pear thinly, then layer it over the toast with a small spoon of salted caramel sauce. Finish with toasted almonds, a pinch of salt, and cinnamon if you like. It also works with apple or banana.",
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
    tags: ["sweet", "toast", "quick"],
  },
  {
    slug: "dark-chocolate-raspberry-yoghurt-bowls",
    title: "Dark Chocolate Raspberry Yoghurt Bowls",
    image: "/images/recipes/dark-chocolate-raspberry-yoghurt.jpg",
    alt: "Yoghurt bowl with dark chocolate hazelnut spread and raspberries",
    intro:
      "Thick yoghurt, dark chocolate hazelnut spread, raspberries, and nuts. A simple sweet bowl that feels polished without becoming a project.",
    body: "Spoon thick yoghurt into bowls. Warm the dark chocolate and hazelnut spread slightly if needed, then swirl it through the yoghurt. Add raspberries or strawberries, then finish with chopped nuts, a pinch of salt, or biscuit crumbs if you want crunch.",
    pantryLabel: "Made with Dark Chocolate & Hazelnut Spread",
    product: {
      name: "Dark Chocolate & Hazelnut Spread",
      price: 5.0,
      image: "/dark-chocolate.png",
    },
    companionItems: [
      {
        name: "Cashews",
        price: 5.5,
        image: "/images/extras/cashews.jpg",
      },
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
    tags: ["sweet", "no-fuss", "yoghurt"],
  },
];

export const useItUpIdeas = [
  {
    title: "Herby Grain Bowl",
    text: "Use cooked grains, roast vegetables, leaves, lemon, and any soft herbs. Finish with pesto, tahini, yoghurt, or olive oil.",
  },
  {
    title: "Soup from Almost Anything",
    text: "Soften veg, add stock or water, then blend if you want it smooth. Miso, harissa, tomatoes, or pesto can shift the flavour quickly.",
  },
  {
    title: "End-of-Week Roast Tin",
    text: "Roast what needs using with oil and salt, then finish with herbs, lemon, yoghurt, tahini, or something punchy from a jar.",
  },
  {
    title: "Beans on Something Better Than Toast",
    text: "Warm beans with tomatoes, greens, miso, harissa, or stock, then spoon over toast, potatoes, rice, or couscous.",
  },
  {
    title: "Pasta with the Last Good Things",
    text: "Use pasta as a base for greens, soft tomatoes, roast veg, herbs, nuts, or a spoon of pesto loosened with pasta water.",
  },
  {
    title: "Soft Fruit Bowl",
    text: "If berries, pears, apples, or bananas are softening, spoon them over yoghurt with caramel, chocolate spread, nuts, or toasted oats.",
  },
];

export const prompts = [
  {
    ingredient: "Broccoli",
    idea: "Roast until the edges char, then add gochujang, lemon, yoghurt, or crispy chickpeas.",
  },
  {
    ingredient: "Courgettes",
    idea: "Char in a hot pan and fold through bucatini, pesto, lemon, or basil oil.",
  },
  {
    ingredient: "Tomatoes",
    idea: "Cook down until jammy for pasta, beans, or toast. Finish with basil or black pepper.",
  },
  {
    ingredient: "Mushrooms",
    idea: "Brown properly, then add miso, orzo, rice, greens, or a little stock for depth.",
  },
  {
    ingredient: "Greens",
    idea: "Wilt into beans, orzo, soups, eggs, rice, or pasta right at the end.",
  },
  {
    ingredient: "Beetroot",
    idea: "Roast and pair with farro, walnuts, dill, lemon, yoghurt, or tahini.",
  },
  {
    ingredient: "Peppers",
    idea: "Roast until sweet, then pair with harissa, butter beans, couscous, or tomatoes.",
  },
  {
    ingredient: "Soft fruit",
    idea: "Spoon over yoghurt, cook into compote, or use with caramel, chocolate spread, or toasted nuts.",
  },
];
