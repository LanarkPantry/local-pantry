export type StaticPlannerRecipe = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  mood: "quick" | "balanced" | "comforting";
  eatingStyle: "veg" | "balanced" | "protein";
  focusTags: ("veg-heavy" | "low-waste" | "family-friendly")[];
  ingredients: string[];
  matchedProducts: string[];
  steps: string[];
};

export const staticPlannerRecipes: StaticPlannerRecipe[] = [
  // 1. Bucatini with Charred Courgette & Green Pesto
  {
    id: "bucatini-courgette-pesto",
    title: "Bucatini with Charred Courgette & Green Pesto",
    description:
      "A quick green pasta with smoky courgette, glossy pesto and a fresh lemon finish.",
    imageUrl: "/images/recipes/bucatini-courgette-pesto.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: ["Bucatini", "Courgette", "Green pesto", "Lemon", "Parmesan"],
    matchedProducts: ["Bucatini", "Sorrel & Walnut Pesto"],
    steps: [
      "Prepare the bucatini and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 2. Rose Harissa Butter Beans with Roast Peppers & Giant Couscous
  {
    id: "harissa-butterbeans-peppers-couscous",
    title: "Rose Harissa Butter Beans with Roast Peppers & Giant Couscous",
    description:
      "Soft butter beans, sweet roasted peppers and giant couscous in a warm harissa dressing.",
    imageUrl: "/images/recipes/harissa-butterbeans-peppers-couscous.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "family-friendly"],
    ingredients: [
      "Butter beans",
      "Roast peppers",
      "Giant couscous",
      "Rose harissa",
      "Parsley",
    ],
    matchedProducts: ["Butter Beans", "Giant Couscous", "Rose Harissa"],
    steps: [
      "Prepare the butter beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 3. Miso Mushrooms with Farro & Greens
  {
    id: "miso-mushroom-farro-greens",
    title: "Miso Mushrooms with Farro & Greens",
    description:
      "Deeply savoury mushrooms with chewy farro, leafy greens and a miso glaze.",
    imageUrl: "/images/recipes/miso-mushroom-farro.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: ["Mushrooms", "Farro", "Greens", "White miso", "Garlic"],
    matchedProducts: ["Farro", "White Miso"],
    steps: [
      "Prepare the mushrooms and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 4. Tomato Chickpea Orzo with Herbs
  {
    id: "tomato-chickpea-orzo-herbs",
    title: "Tomato Chickpea Orzo with Herbs",
    description:
      "A one-pan orzo with chickpeas, tomatoes and soft herbs for an easy midweek supper.",
    imageUrl: "/images/recipes/tomato-chickpea-orzo.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: ["Orzo", "Chickpeas", "Tomatoes", "Garlic", "Basil"],
    matchedProducts: ["Orzo", "Chickpeas", "Premium Whole Tomatoes"],
    steps: [
      "Prepare the orzo and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 5. Gochujang Broccoli Rice Bowls
  {
    id: "gochujang-broccoli-rice-bowls",
    title: "Gochujang Broccoli Rice Bowls",
    description:
      "Charred broccoli with sticky gochujang dressing, rice and a cooling crunchy finish.",
    imageUrl: "/images/recipes/gochujang-broccoli-rice-bowl.jpg",
    mood: "quick",
    eatingStyle: "balanced",
    focusTags: ["veg-heavy"],
    ingredients: ["Broccoli", "Rice", "Gochujang", "Cucumber", "Spring onions"],
    matchedProducts: ["Signature Gochujang"],
    steps: [
      "Prepare the broccoli and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 6. Roast Cauliflower Lentils with Soft Polenta
  {
    id: "cauliflower-lentils-polenta",
    title: "Roast Cauliflower Lentils with Soft Polenta",
    description:
      "A comforting bowl of roasted cauliflower, puy lentils and creamy polenta.",
    imageUrl: "/images/recipes/cauliflower-lentil-polenta.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "veg-heavy"],
    ingredients: ["Cauliflower", "Puy lentils", "Polenta", "Thyme", "Garlic"],
    matchedProducts: ["Puy Lentils", "Polenta"],
    steps: [
      "Prepare the cauliflower and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 7. Aubergine, Cannellini Beans & Tomatoes
  {
    id: "aubergine-cannellini-tomatoes",
    title: "Aubergine, Cannellini Beans & Tomatoes",
    description:
      "A soft, tomato-rich pan of aubergine and beans, good with bread, rice or couscous.",
    imageUrl: "/images/recipes/aubergine-cannellini-tomatoes.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste", "veg-heavy"],
    ingredients: [
      "Aubergine",
      "Cannellini beans",
      "Tomatoes",
      "Garlic",
      "Parsley",
    ],
    matchedProducts: ["Cannellini Beans", "Premium Whole Tomatoes"],
    steps: [
      "Prepare the aubergine and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 8. Beetroot Grain Salad with Herbs
  {
    id: "beetroot-grain-salad-herbs",
    title: "Beetroot Grain Salad with Herbs",
    description:
      "Earthy beetroot, grains, herbs and a sharp dressing for a useful lunch or light supper.",
    imageUrl: "/images/recipes/beetroot-grain-salad.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Beetroot", "Farro", "Parsley", "Lemon", "Walnuts"],
    matchedProducts: ["Farro"],
    steps: [
      "Prepare the beetroot and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 9. Green Bean & Lemon Risotto
  {
    id: "green-bean-lemon-risotto",
    title: "Green Bean & Lemon Risotto",
    description:
      "A gentle risotto with green beans, lemon and herbs for a calm midweek dinner.",
    imageUrl: "/images/recipes/green-bean-risotto.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Risotto rice", "Green beans", "Lemon", "Parmesan", "Mint"],
    matchedProducts: ["Risotto Rice"],
    steps: [
      "Prepare the risotto rice and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 10. Pepper, Potato & Herb Frittata
  {
    id: "pepper-potato-herb-frittata",
    title: "Pepper, Potato & Herb Frittata",
    description:
      "A flexible egg-based supper for using up peppers, potatoes and soft herbs.",
    imageUrl: "/images/recipes/pepper-potato-frittata.jpg",
    mood: "quick",
    eatingStyle: "protein",
    focusTags: ["low-waste", "family-friendly"],
    ingredients: ["Eggs", "Peppers", "Potatoes", "Parsley", "Onion"],
    matchedProducts: [],
    steps: [
      "Prepare the eggs and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 11. Salmon, Dill & Crushed Potato Traybake
  {
    id: "salmon-dill-crushed-potato-traybake",
    title: "Salmon, Dill & Crushed Potato Traybake",
    description:
      "A simple traybake with flaky salmon, crushed potatoes, greens and a bright dill finish.",
    imageUrl: "/images/recipes/salmon-dill-crushed-potato-traybake.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Salmon", "Potatoes", "Dill", "Lemon", "Green beans"],
    matchedProducts: [],
    steps: [
      "Prepare the salmon and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 12. Gochujang Chicken Rice Bowls with Cucumber
  {
    id: "gochujang-chicken-rice-cucumber",
    title: "Gochujang Chicken Rice Bowls with Cucumber",
    description:
      "Sticky gochujang chicken with rice, cucumber, herbs and a fresh crunchy finish.",
    imageUrl: "/images/recipes/gochujang-chicken-rice-cucumber.jpg",
    mood: "quick",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Chicken", "Rice", "Gochujang", "Cucumber", "Spring onions"],
    matchedProducts: ["Signature Gochujang"],
    steps: [
      "Prepare the chicken and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 13. Cashew Broccoli Noodles with Lime
  {
    id: "cashew-broccoli-noodles-lime",
    title: "Cashew Broccoli Noodles with Lime",
    description: "Noodles with charred broccoli, cashew sauce, lime and herbs.",
    imageUrl: "/images/recipes/cashew-broccoli-noodles-lime.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Broccoli", "Rice noodles", "Cashews", "Lime", "Coriander"],
    matchedProducts: [],
    steps: [
      "Prepare the broccoli and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 14. Crispy Tofu Peanut Rice Bowls
  {
    id: "crispy-tofu-peanut-rice-bowls",
    title: "Crispy Tofu Peanut Rice Bowls",
    description:
      "Crispy tofu, vegetables and rice with a creamy peanut-lime sauce.",
    imageUrl: "/images/recipes/crispy-tofu-peanut-rice-bowls.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Tofu", "Rice", "Peanut sauce", "Cucumber", "Carrots"],
    matchedProducts: [],
    steps: [
      "Prepare the tofu and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 15. Roast Pepper Cashew Cream Casarecce
  {
    id: "roast-pepper-cashew-cream-casarecce",
    title: "Roast Pepper Cashew Cream Casarecce",
    description:
      "Casarecce folded through a silky roast pepper and cashew cream sauce.",
    imageUrl: "/images/recipes/roast-pepper-cashew-cream-casarecce.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: [
      "Casarecce Pasta",
      "Roast peppers",
      "Cashews",
      "Garlic",
      "Basil",
    ],
    matchedProducts: ["Casarecce Pasta"],
    steps: [
      "Prepare the casarecce pasta and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 16. Lemon Herb Chicken with Giant Couscous
  {
    id: "lemon-herb-chicken-giant-couscous",
    title: "Lemon Herb Chicken with Giant Couscous",
    description:
      "Golden chicken with herby giant couscous, vegetables and lemon.",
    imageUrl: "/images/recipes/lemon-herb-chicken-giant-couscous.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Chicken", "Giant couscous", "Lemon", "Parsley", "Courgette"],
    matchedProducts: ["Giant Couscous"],
    steps: [
      "Prepare the chicken and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 17. Salmon with Crushed Peas & Herby Potatoes
  {
    id: "salmon-crushed-peas-herby-potatoes",
    title: "Salmon with Crushed Peas & Herby Potatoes",
    description:
      "A fresh salmon supper with crushed peas, soft herbs and potatoes.",
    imageUrl: "/images/recipes/salmon-crushed-peas-herby-potatoes.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Salmon", "Peas", "Potatoes", "Mint", "Lemon"],
    matchedProducts: [],
    steps: [
      "Prepare the salmon and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 18. Roast Fennel & Tomato Burrata Toasts
  {
    id: "roast-fennel-tomato-burrata-toasts",
    title: "Roast Fennel & Tomato Burrata Toasts",
    description:
      "Sweet roast fennel and tomatoes over toast with creamy burrata.",
    imageUrl: "/images/recipes/roast-fennel-tomato-burrata-toasts.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Fennel", "Tomatoes", "Burrata", "Sourdough", "Basil"],
    matchedProducts: [],
    steps: [
      "Prepare the fennel and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 19. Spinach, Ricotta & Herb Stuffed Peppers
  {
    id: "spinach-ricotta-herb-stuffed-peppers",
    title: "Spinach, Ricotta & Herb Stuffed Peppers",
    description:
      "Sweet peppers filled with spinach, ricotta, herbs and grains.",
    imageUrl: "/images/recipes/spinach-ricotta-herb-stuffed-peppers.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "veg-heavy"],
    ingredients: ["Peppers", "Spinach", "Ricotta", "Herbs", "Rice"],
    matchedProducts: [],
    steps: [
      "Prepare the peppers and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 20. Sticky Soy Chicken with Greens & Rice
  {
    id: "sticky-soy-chicken-greens-rice",
    title: "Sticky Soy Chicken with Greens & Rice",
    description:
      "Glossy soy chicken with greens, rice and a sharp fresh finish.",
    imageUrl: "/images/recipes/sticky-soy-chicken-greens-rice.jpg",
    mood: "quick",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Chicken", "Rice", "Greens", "Soy", "Ginger"],
    matchedProducts: [],
    steps: [
      "Prepare the chicken and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 21. Creamy Tuscan Butter Beans with Greens
  {
    id: "creamy-tuscan-butterbeans-greens",
    title: "Creamy Tuscan Butter Beans with Greens",
    description:
      "Butter beans in a creamy garlic sauce with greens, herbs and parmesan.",
    imageUrl: "/images/recipes/creamy-tuscan-butterbeans-greens.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste", "family-friendly"],
    ingredients: ["Butter beans", "Greens", "Cream", "Garlic", "Parmesan"],
    matchedProducts: ["Butter Beans"],
    steps: [
      "Prepare the butter beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 22. Charred Courgette & Whipped Feta Orzo
  {
    id: "charred-courgette-whipped-feta-orzo",
    title: "Charred Courgette & Whipped Feta Orzo",
    description: "Lemony orzo with charred courgette, herbs and whipped feta.",
    imageUrl: "/images/recipes/charred-courgette-whipped-feta-orzo.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Orzo", "Courgette", "Feta", "Lemon", "Mint"],
    matchedProducts: ["Orzo"],
    steps: [
      "Prepare the orzo and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 23. Coconut Lime Greens with Crispy Tofu
  {
    id: "coconut-lime-greens-crispy-tofu",
    title: "Coconut Lime Greens with Crispy Tofu",
    description: "A coconut-lime greens bowl with crispy tofu and rice.",
    imageUrl: "/images/recipes/coconut-lime-greens-crispy-tofu.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Tofu", "Greens", "Coconut milk", "Lime", "Rice"],
    matchedProducts: [],
    steps: [
      "Prepare the tofu and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 24. Roasted Tomato Burrata Gnocchi
  {
    id: "roasted-tomato-burrata-gnocchi",
    title: "Roasted Tomato Burrata Gnocchi",
    description: "Crispy gnocchi with roasted tomatoes, basil oil and burrata.",
    imageUrl: "/images/recipes/roasted-tomato-burrata-gnocchi.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Gnocchi", "Tomatoes", "Burrata", "Basil", "Garlic"],
    matchedProducts: [],
    steps: [
      "Prepare the gnocchi and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 25. Hot Honey Halloumi with Herby Couscous
  {
    id: "hot-honey-halloumi-herby-couscous",
    title: "Hot Honey Halloumi with Herby Couscous",
    description:
      "Golden halloumi with lemony couscous, herbs and a chilli honey finish.",
    imageUrl: "/images/recipes/hot-honey-halloumi-couscous.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: [
      "Halloumi",
      "Giant couscous",
      "Cucumber",
      "Mint",
      "Hot honey",
    ],
    matchedProducts: ["Giant Couscous"],
    steps: [
      "Prepare the halloumi and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 26. Smoky Sweet Potato Black Bean Bowls
  {
    id: "smoky-sweet-potato-black-bean-bowls",
    title: "Smoky Sweet Potato Black Bean Bowls",
    description: "Roasted sweet potato, black beans, rice and avocado yoghurt.",
    imageUrl: "/images/recipes/smoky-sweet-potato-black-bean-bowls.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "family-friendly"],
    ingredients: [
      "Sweet potato",
      "Black beans",
      "Rice",
      "Avocado",
      "Coriander",
    ],
    matchedProducts: [],
    steps: [
      "Prepare the sweet potato and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 27. Chicken, Leek & Mustard Cream Casarecce
  {
    id: "chicken-leek-mustard-cream-casarecce",
    title: "Chicken, Leek & Mustard Cream Casarecce",
    description:
      "A comforting casarecce with chicken, soft leeks and mustard cream.",
    imageUrl: "/images/recipes/chicken-leek-mustard-cream-casarecce.jpg",
    mood: "comforting",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Casarecce Pasta", "Chicken", "Leeks", "Mustard", "Cream"],
    matchedProducts: ["Casarecce Pasta"],
    steps: [
      "Prepare the casarecce pasta and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 28. Roasted Carrot Labneh Toasts with Dukkah
  {
    id: "roasted-carrot-labneh-toasts-dukkah",
    title: "Roasted Carrot Labneh Toasts with Dukkah",
    description:
      "Roasted carrots over thick labneh on toast with herbs and dukkah.",
    imageUrl: "/images/recipes/roasted-carrot-labneh-toasts.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Carrots", "Labneh", "Sourdough", "Dukkah", "Parsley"],
    matchedProducts: [],
    steps: [
      "Prepare the carrots and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 29. Thai Peanut Greens Rice Noodles
  {
    id: "thai-peanut-greens-rice-noodles",
    title: "Thai Peanut Greens Rice Noodles",
    description: "Rice noodles with greens, herbs and a peanut-lime dressing.",
    imageUrl: "/images/recipes/thai-peanut-greens-rice-noodles.jpg",
    mood: "quick",
    eatingStyle: "balanced",
    focusTags: ["low-waste"],
    ingredients: [
      "Rice noodles",
      "Greens",
      "Peanut sauce",
      "Lime",
      "Coriander",
    ],
    matchedProducts: [],
    steps: [
      "Prepare the rice noodles and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 30. Baked Feta Butter Beans with Greens
  {
    id: "baked-feta-butterbeans-greens",
    title: "Baked Feta Butter Beans with Greens",
    description:
      "Baked feta, butter beans, blistered tomatoes and greens served with toast.",
    imageUrl: "/images/recipes/baked-feta-butterbeans-greens.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: ["Feta", "Butter beans", "Greens", "Tomatoes", "Toast"],
    matchedProducts: ["Butter Beans"],
    steps: [
      "Prepare the feta and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 31. Coconut Tomato Chickpea Curry with Rice
  {
    id: "coconut-tomato-chickpea-curry-rice",
    title: "Coconut Tomato Chickpea Curry with Rice",
    description: "A gentle curry with chickpeas, tomatoes, coconut and greens.",
    imageUrl: "/images/recipes/coconut-tomato-chickpea-curry-rice.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "veg-heavy"],
    ingredients: ["Chickpeas", "Tomatoes", "Coconut milk", "Greens", "Rice"],
    matchedProducts: ["Chickpeas", "Premium Whole Tomatoes"],
    steps: [
      "Prepare the chickpeas and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 32. White Bean Parmesan Broth with Greens
  {
    id: "white-bean-parmesan-broth-greens-toasts",
    title: "White Bean Parmesan Broth with Greens",
    description:
      "A brothy white bean bowl with greens, parmesan and crisp toasts.",
    imageUrl: "/images/recipes/white-bean-parmesan-broth-greens.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Cannellini beans", "Greens", "Parmesan", "Garlic", "Toast"],
    matchedProducts: ["Cannellini Beans"],
    steps: [
      "Prepare the cannellini beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 33. Harissa Chickpea Flatbreads with Herbs
  {
    id: "harissa-chickpea-flatbreads-herbs",
    title: "Harissa Chickpea Flatbreads with Herbs",
    description:
      "Warm flatbreads with harissa chickpeas, yoghurt, herbs and cucumber.",
    imageUrl: "/images/recipes/harissa-chickpea-flatbreads-herbs.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: [
      "Chickpeas",
      "Rose harissa",
      "Flatbreads",
      "Yoghurt",
      "Cucumber",
    ],
    matchedProducts: ["Chickpeas", "Rose Harissa"],
    steps: [
      "Prepare the chickpeas and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 34. Green Lentil Coconut Curry Bowls
  {
    id: "green-lentil-coconut-curry-bowls",
    title: "Green Lentil Coconut Curry Bowls",
    description:
      "Green lentils simmered with coconut, spices and seasonal greens.",
    imageUrl: "/images/recipes/green-lentil-coconut-curry-bowls.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: [
      "Green lentils",
      "Coconut milk",
      "Greens",
      "Rice",
      "Coriander",
    ],
    matchedProducts: [],
    steps: [
      "Prepare the green lentils and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 35. Lemon Kale Bucatini with Parmesan
  {
    id: "lemon-kale-bucatini-parmesan",
    title: "Lemon Kale Bucatini with Parmesan",
    description:
      "A simple bright bucatini with kale, lemon, parmesan and black pepper.",
    imageUrl: "/images/recipes/lemon-kale-bucatini-parmesan.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Bucatini", "Kale", "Lemon", "Parmesan", "Garlic"],
    matchedProducts: ["Bucatini"],
    steps: [
      "Prepare the bucatini and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 36. Walnut Herb Farro with Roast Vegetables
  {
    id: "walnut-herb-farro-roast-vegetables",
    title: "Walnut Herb Farro with Roast Vegetables",
    description:
      "A robust grain bowl with roasted vegetables, walnuts and herbs.",
    imageUrl: "/images/recipes/walnut-herb-farro-roast-vegetables.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: ["Farro", "Roast vegetables", "Walnuts", "Parsley", "Lemon"],
    matchedProducts: ["Farro"],
    steps: [
      "Prepare the farro and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 37. Charred Greens with Tahini Yoghurt & Crispy Chickpeas
  {
    id: "charred-greens-tahini-yoghurt-crispy-chickpeas",
    title: "Charred Greens with Tahini Yoghurt & Crispy Chickpeas",
    description:
      "Smoky greens with creamy tahini yoghurt and crunchy chickpeas.",
    imageUrl: "/images/recipes/charred-greens-tahini-yoghurt-chickpeas.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Greens", "Chickpeas", "Tahini", "Yoghurt", "Lemon"],
    matchedProducts: ["Chickpeas"],
    steps: [
      "Prepare the greens and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 38. Roasted Squash & Puy Lentils with Herbs
  {
    id: "roasted-squash-puy-lentils-herbs",
    title: "Roasted Squash & Puy Lentils with Herbs",
    description:
      "Sweet squash with earthy lentils, herbs and a sharp dressing.",
    imageUrl: "/images/recipes/roasted-squash-puy-lentils-herbs.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: ["Squash", "Puy lentils", "Parsley", "Lemon", "Yoghurt"],
    matchedProducts: ["Puy Lentils"],
    steps: [
      "Prepare the squash and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 39. Citrus Herb Halloumi Salad with Couscous
  {
    id: "citrus-herb-halloumi-couscous-salad",
    title: "Citrus Herb Halloumi Salad with Couscous",
    description:
      "Golden halloumi with couscous, citrus, herbs and crisp vegetables.",
    imageUrl: "/images/recipes/citrus-herb-halloumi-couscous-salad.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Halloumi", "Giant couscous", "Orange", "Cucumber", "Mint"],
    matchedProducts: ["Giant Couscous"],
    steps: [
      "Prepare the halloumi and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 40. Creamy Tofu Korma with Greens & Rice
  {
    id: "creamy-tofu-korma-greens-rice",
    title: "Creamy Tofu Korma with Greens & Rice",
    description: "A mild creamy tofu korma with greens and fluffy rice.",
    imageUrl: "/images/recipes/creamy-tofu-korma-greens-rice.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Tofu", "Rice", "Greens", "Korma sauce", "Coriander"],
    matchedProducts: [],
    steps: [
      "Prepare the tofu and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 41. Salmon Traybake with Greens & Mustard Yoghurt
  {
    id: "salmon-traybake-greens-mustard-yoghurt",
    title: "Salmon Traybake with Greens & Mustard Yoghurt",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/salmon-traybake-greens-mustard-yoghurt.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Salmon", "Greens", "Potatoes", "Mustard yoghurt", "Dill"],
    matchedProducts: [],
    steps: [
      "Prepare the salmon and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 42. Herby Butter Bean Skillet with Roast Tomatoes
  {
    id: "herby-butter-bean-skillet-roast-tomatoes",
    title: "Herby Butter Bean Skillet with Roast Tomatoes",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/herby-butter-bean-skillet-roast-tomatoes.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste", "family-friendly"],
    ingredients: ["Butter beans", "Roast tomatoes", "Herbs", "Garlic", "Toast"],
    matchedProducts: ["Butter Beans"],
    steps: [
      "Prepare the butter beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 43. Smoky Tomato Lentil Stew with Herbs
  {
    id: "smoky-tomato-lentil-stew-herbs",
    title: "Smoky Tomato Lentil Stew with Herbs",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/smoky-tomato-lentil-stew-herbs.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: ["Lentils", "Tomatoes", "Paprika", "Parsley", "Garlic"],
    matchedProducts: ["Premium Whole Tomatoes"],
    steps: [
      "Prepare the lentils and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 44. Roast Tomato Bread Soup with Basil
  {
    id: "roast-tomato-bread-soup-basil",
    title: "Roast Tomato Bread Soup with Basil",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/roast-tomato-bread-soup-basil.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Tomatoes", "Bread", "Basil", "Garlic", "Olive oil"],
    matchedProducts: ["Premium Whole Tomatoes"],
    steps: [
      "Prepare the tomatoes and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 45. Courgette Pea Lemon Risotto
  {
    id: "courgette-pea-lemon-risotto",
    title: "Courgette Pea Lemon Risotto",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/courgette-pea-lemon-risotto.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Risotto rice", "Courgette", "Peas", "Lemon", "Mint"],
    matchedProducts: ["Risotto Rice"],
    steps: [
      "Prepare the risotto rice and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 46. Butter Bean & Rosemary Stew
  {
    id: "butter-bean-rosemary-stew",
    title: "Butter Bean & Rosemary Stew",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/butter-bean-rosemary-stew.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste", "family-friendly"],
    ingredients: ["Butter beans", "Rosemary", "Garlic", "Tomatoes", "Greens"],
    matchedProducts: ["Butter Beans"],
    steps: [
      "Prepare the butter beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 47. Green Goddess Potato Salad with Eggs
  {
    id: "green-goddess-potato-salad-eggs",
    title: "Green Goddess Potato Salad with Eggs",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/green-goddess-potato-salad-eggs.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Potatoes", "Eggs", "Parsley", "Yoghurt", "Spring onions"],
    matchedProducts: [],
    steps: [
      "Prepare the potatoes and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 48. Roasted Pepper Chickpea Stew
  {
    id: "roasted-pepper-chickpea-stew",
    title: "Roasted Pepper Chickpea Stew",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/roasted-pepper-chickpea-stew.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Peppers", "Chickpeas", "Tomatoes", "Garlic", "Parsley"],
    matchedProducts: ["Chickpeas", "Premium Whole Tomatoes"],
    steps: [
      "Prepare the peppers and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 49. Carrot Coconut Ginger Soup with Rice
  {
    id: "carrot-coconut-ginger-soup-rice",
    title: "Carrot Coconut Ginger Soup with Rice",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/carrot-coconut-ginger-soup-rice.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Carrots", "Coconut milk", "Ginger", "Rice", "Lime"],
    matchedProducts: [],
    steps: [
      "Prepare the carrots and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 50. Tomato White Bean Bake with Herbs
  {
    id: "tomato-white-bean-bake-herbs",
    title: "Tomato White Bean Bake with Herbs",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/tomato-white-bean-bake-herbs.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["White beans", "Tomatoes", "Parsley", "Garlic", "Olive oil"],
    matchedProducts: ["Cannellini Beans", "Premium Whole Tomatoes"],
    steps: [
      "Prepare the white beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 51. Charred Corn Black Bean Rice Bowls
  {
    id: "charred-corn-black-bean-rice-bowls",
    title: "Charred Corn Black Bean Rice Bowls",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/charred-corn-black-bean-rice-bowls.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Corn", "Black beans", "Rice", "Lime", "Coriander"],
    matchedProducts: [],
    steps: [
      "Prepare the corn and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 52. Baked Aubergine Yoghurt Plates
  {
    id: "baked-aubergine-yoghurt-plates",
    title: "Baked Aubergine Yoghurt Plates",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/baked-aubergine-yoghurt-plates.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Aubergine", "Yoghurt", "Parsley", "Garlic", "Lemon"],
    matchedProducts: [],
    steps: [
      "Prepare the aubergine and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 53. Creamy Mushroom Barley Pot
  {
    id: "creamy-mushroom-barley-pot",
    title: "Creamy Mushroom Barley Pot",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/creamy-mushroom-barley-pot.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Mushrooms", "Barley", "Cream", "Thyme", "Garlic"],
    matchedProducts: [],
    steps: [
      "Prepare the mushrooms and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 54. Brothy Greens Beans & Parmesan
  {
    id: "brothy-greens-beans-parmesan",
    title: "Brothy Greens Beans & Parmesan",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/brothy-greens-beans-parmesan.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Greens", "White beans", "Parmesan", "Garlic", "Herbs"],
    matchedProducts: ["Cannellini Beans"],
    steps: [
      "Prepare the greens and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 55. Roast Squash Coconut Dal
  {
    id: "roast-squash-coconut-dal",
    title: "Roast Squash Coconut Dal",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/roast-squash-coconut-dal.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Squash", "Red lentils", "Coconut milk", "Coriander", "Rice"],
    matchedProducts: [],
    steps: [
      "Prepare the squash and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 56. Herby Potato Green Bean Salad
  {
    id: "herby-potato-green-bean-salad",
    title: "Herby Potato Green Bean Salad",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/herby-potato-green-bean-salad.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Potatoes", "Green beans", "Parsley", "Mustard", "Lemon"],
    matchedProducts: [],
    steps: [
      "Prepare the potatoes and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 57. Soft Polenta with Roast Tomatoes & Greens
  {
    id: "soft-polenta-roast-tomatoes-greens",
    title: "Soft Polenta with Roast Tomatoes & Greens",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/soft-polenta-roast-tomatoes-greens.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Polenta", "Tomatoes", "Greens", "Garlic", "Parmesan"],
    matchedProducts: ["Polenta"],
    steps: [
      "Prepare the polenta and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 58. Broad Bean Herb Ricotta Toasts
  {
    id: "broad-bean-herb-ricotta-toasts",
    title: "Broad Bean Herb Ricotta Toasts",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/broad-bean-herb-ricotta-toasts.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Broad beans", "Ricotta", "Mint", "Lemon", "Sourdough"],
    matchedProducts: [],
    steps: [
      "Prepare the broad beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 59. Runner Bean Tahini Salad with Crispy Chickpeas
  {
    id: "runner-bean-tahini-salad-crispy-chickpeas",
    title: "Runner Bean Tahini Salad with Crispy Chickpeas",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/runner-bean-tahini-salad-crispy-chickpeas.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Runner beans", "Chickpeas", "Tahini", "Yoghurt", "Lemon"],
    matchedProducts: ["Chickpeas"],
    steps: [
      "Prepare the runner beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 60. Asparagus Lemon Parmesan Orzo
  {
    id: "asparagus-lemon-parmesan-orzo",
    title: "Asparagus Lemon Parmesan Orzo",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/asparagus-lemon-parmesan-orzo.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Asparagus", "Orzo", "Lemon", "Parmesan", "Parsley"],
    matchedProducts: ["Orzo"],
    steps: [
      "Prepare the asparagus and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 61. Tenderstem Gochujang Rice Bowls
  {
    id: "tenderstem-gochujang-rice-bowls",
    title: "Tenderstem Gochujang Rice Bowls",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/tenderstem-gochujang-rice-bowls.jpg",
    mood: "quick",
    eatingStyle: "balanced",
    focusTags: ["veg-heavy"],
    ingredients: [
      "Tenderstem broccoli",
      "Rice",
      "Gochujang",
      "Cucumber",
      "Spring onions",
    ],
    matchedProducts: ["Signature Gochujang"],
    steps: [
      "Prepare the tenderstem broccoli and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 62. Spinach Coconut Dal with Lime
  {
    id: "spinach-coconut-dal-lime",
    title: "Spinach Coconut Dal with Lime",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/spinach-coconut-dal-lime.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "family-friendly"],
    ingredients: [
      "Spinach",
      "Red lentils",
      "Coconut milk",
      "Lime",
      "Coriander",
    ],
    matchedProducts: [],
    steps: [
      "Prepare the spinach and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 63. Watercress Herb Potato Salad
  {
    id: "watercress-herb-potato-salad",
    title: "Watercress Herb Potato Salad",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/watercress-herb-potato-salad.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Watercress", "Potatoes", "Parsley", "Chives", "Mustard"],
    matchedProducts: [],
    steps: [
      "Prepare the watercress and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 64. Rocket Pear Walnut Farro
  {
    id: "rocket-pear-walnut-farro",
    title: "Rocket Pear Walnut Farro",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/rocket-pear-walnut-farro.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Rocket", "Pear", "Farro", "Walnuts", "Lemon"],
    matchedProducts: ["Farro"],
    steps: [
      "Prepare the rocket and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 65. Apple Cabbage Mustard Grain Bowls
  {
    id: "apple-cabbage-mustard-grain-bowls",
    title: "Apple Cabbage Mustard Grain Bowls",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/apple-cabbage-mustard-grain-bowls.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Apple", "Cabbage", "Grains", "Mustard", "Parsley"],
    matchedProducts: [],
    steps: [
      "Prepare the apple and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 66. Tenderstem Sesame Noodles with Cashews
  {
    id: "tenderstem-sesame-noodles-cashews",
    title: "Tenderstem Sesame Noodles with Cashews",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/tenderstem-sesame-noodles-cashews.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: [
      "Tenderstem broccoli",
      "Noodles",
      "Sesame",
      "Cashews",
      "Lime",
    ],
    matchedProducts: [],
    steps: [
      "Prepare the tenderstem broccoli and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 67. Broad Bean Mint Lemon Couscous
  {
    id: "broad-bean-mint-lemon-couscous",
    title: "Broad Bean Mint Lemon Couscous",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/broad-bean-mint-lemon-couscous.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Broad beans", "Giant couscous", "Mint", "Lemon", "Feta"],
    matchedProducts: ["Giant Couscous"],
    steps: [
      "Prepare the broad beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 68. Spinach Yoghurt Flatbreads with Herbs
  {
    id: "spinach-yoghurt-flatbreads-herbs",
    title: "Spinach Yoghurt Flatbreads with Herbs",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/spinach-yoghurt-flatbreads-herbs.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Spinach", "Yoghurt", "Flatbreads", "Herbs", "Lemon"],
    matchedProducts: [],
    steps: [
      "Prepare the spinach and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 69. Pear Gorgonzola Walnut Salad
  {
    id: "pear-gorgonzola-walnut-salad",
    title: "Pear Gorgonzola Walnut Salad",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/pear-gorgonzola-walnut-salad.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Pear", "Gorgonzola", "Walnuts", "Leaves", "Honey"],
    matchedProducts: [],
    steps: [
      "Prepare the pear and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 70. Apple Rosemary Lentils with Greens
  {
    id: "apple-rosemary-lentils-greens",
    title: "Apple Rosemary Lentils with Greens",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/apple-rosemary-lentils-greens.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Apple", "Lentils", "Rosemary", "Greens", "Mustard"],
    matchedProducts: [],
    steps: [
      "Prepare the apple and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 71. Watercress Pea Herb Soup
  {
    id: "watercress-pea-herb-soup",
    title: "Watercress Pea Herb Soup",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/watercress-pea-herb-soup.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Watercress", "Peas", "Mint", "Potatoes", "Yoghurt"],
    matchedProducts: [],
    steps: [
      "Prepare the watercress and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 72. Asparagus Dill Potato Salad
  {
    id: "asparagus-dill-potato-salad",
    title: "Asparagus Dill Potato Salad",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/asparagus-dill-potato-salad.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Asparagus", "Potatoes", "Dill", "Yoghurt", "Lemon"],
    matchedProducts: [],
    steps: [
      "Prepare the asparagus and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 73. Broad Bean Mint Labneh Toasts
  {
    id: "broad-bean-mint-labneh-toasts",
    title: "Broad Bean Mint Labneh Toasts",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/broad-bean-mint-labneh-toasts.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Broad beans", "Labneh", "Mint", "Lemon", "Toast"],
    matchedProducts: [],
    steps: [
      "Prepare the broad beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 74. Tenderstem Sesame Ginger Greens
  {
    id: "tenderstem-sesame-ginger-greens",
    title: "Tenderstem Sesame Ginger Greens",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/tenderstem-sesame-ginger-greens.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: [
      "Tenderstem broccoli",
      "Sesame",
      "Ginger",
      "Rice",
      "Spring onions",
    ],
    matchedProducts: [],
    steps: [
      "Prepare the tenderstem broccoli and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 75. Asparagus White Bean Lemon Skillet
  {
    id: "asparagus-white-bean-lemon-skillet",
    title: "Asparagus White Bean Lemon Skillet",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/asparagus-white-bean-lemon-skillet.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Asparagus", "White beans", "Lemon", "Parsley", "Garlic"],
    matchedProducts: ["Cannellini Beans"],
    steps: [
      "Prepare the asparagus and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 76. Runner Beans with Walnut Herb Crumbs
  {
    id: "runner-beans-walnut-herb-crumbs",
    title: "Runner Beans with Walnut Herb Crumbs",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/runner-beans-walnut-herb-crumbs.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy"],
    ingredients: ["Runner beans", "Walnuts", "Parsley", "Lemon", "Yoghurt"],
    matchedProducts: [],
    steps: [
      "Prepare the runner beans and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  // 77. Rocket Pear Blue Cheese Flatbreads
  {
    id: "rocket-pear-blue-cheese-flatbreads",
    title: "Rocket Pear Blue Cheese Flatbreads",
    description:
      "A produce-led planner meal with herbs, sauce and enough substance for a proper weeknight dinner.",
    imageUrl: "/images/recipes/rocket-pear-blue-cheese-flatbreads.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Rocket", "Pear", "Blue cheese", "Flatbreads", "Walnuts"],
    matchedProducts: [],
    steps: [
      "Prepare the rocket and any vegetables.",
      "Cook the base or main element until tender.",
      "Bring everything together with the sauce, herbs and seasoning.",
      "Taste, finish with lemon or olive oil, and serve.",
    ],
  },

  {
    id: "miso-salmon-greens-sesame-rice",
    title: "Miso Salmon with Greens & Sesame Rice",
    description:
      "Miso-glazed salmon with greens, sesame rice and a fresh lime finish.",
    imageUrl: "/images/recipes/miso-salmon-greens-sesame-rice.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Salmon", "Greens", "Rice", "White miso", "Sesame"],
    matchedProducts: ["White Miso"],
    steps: [
      "Cook rice until fluffy.",
      "Brush salmon with white miso, lime and a little oil.",
      "Roast or pan-cook the salmon until just done.",
      "Serve with greens, sesame and rice.",
    ],
  },

  {
    id: "chicken-meatballs-herby-tomato-orzo",
    title: "Chicken Meatballs with Herby Tomato Orzo",
    description:
      "Soft chicken meatballs with tomato orzo, herbs and a parmesan finish.",
    imageUrl: "/images/recipes/chicken-meatballs-herby-tomato-orzo.jpg",
    mood: "comforting",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Chicken mince", "Orzo", "Tomatoes", "Basil", "Parmesan"],
    matchedProducts: ["Orzo", "Premium Whole Tomatoes"],
    steps: [
      "Shape seasoned chicken mince into small meatballs.",
      "Brown the meatballs in a pan.",
      "Add tomatoes, orzo and enough water to cook gently.",
      "Finish with basil, parmesan and black pepper.",
    ],
  },

  {
    id: "crispy-tofu-satay-noodle-bowls",
    title: "Crispy Tofu Satay Noodle Bowls",
    description:
      "Crispy tofu, noodles, crunchy vegetables and a creamy satay-style sauce.",
    imageUrl: "/images/recipes/crispy-tofu-satay-noodle-bowls.jpg",
    mood: "quick",
    eatingStyle: "protein",
    focusTags: ["veg-heavy"],
    ingredients: ["Tofu", "Noodles", "Peanut sauce", "Cucumber", "Coriander"],
    matchedProducts: [],
    steps: [
      "Press and cube tofu, then fry until crisp.",
      "Cook noodles until tender.",
      "Mix peanut sauce with lime, soy and warm water.",
      "Serve tofu and noodles with crunchy vegetables and herbs.",
    ],
  },

  {
    id: "lemon-chicken-white-bean-skillet",
    title: "Lemon Chicken White Bean Skillet",
    description:
      "A rustic one-pan chicken skillet with white beans, lemon, greens and herbs.",
    imageUrl: "/images/recipes/lemon-chicken-white-bean-skillet.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: ["Chicken", "Cannellini beans", "Lemon", "Greens", "Parsley"],
    matchedProducts: ["Cannellini Beans"],
    steps: [
      "Brown chicken pieces in a wide pan.",
      "Add cannellini beans, lemon, garlic and a splash of water or stock.",
      "Simmer until the chicken is cooked through.",
      "Fold through greens and finish with parsley.",
    ],
  },

  {
    id: "soy-ginger-turkey-rice-bowls-greens",
    title: "Soy Ginger Turkey Rice Bowls with Greens",
    description:
      "Savoury turkey rice bowls with ginger, greens, cucumber and spring onions.",
    imageUrl: "/images/recipes/soy-ginger-turkey-rice-bowls-greens.jpg",
    mood: "quick",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Turkey mince", "Rice", "Ginger", "Greens", "Spring onions"],
    matchedProducts: [],
    steps: [
      "Cook rice until fluffy.",
      "Fry turkey mince with ginger, garlic and soy.",
      "Add greens and cook until just wilted.",
      "Serve with rice, cucumber and spring onions.",
    ],
  },

  {
    id: "harissa-cod-chickpeas-roast-peppers",
    title: "Harissa Cod with Chickpeas & Roast Peppers",
    description:
      "Flaky cod with chickpeas, roast peppers, herbs and a warm harissa sauce.",
    imageUrl: "/images/recipes/harissa-cod-chickpeas-roast-peppers.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["veg-heavy"],
    ingredients: [
      "Cod",
      "Chickpeas",
      "Roast peppers",
      "Rose harissa",
      "Parsley",
    ],
    matchedProducts: ["Chickpeas", "Rose Harissa"],
    steps: [
      "Warm chickpeas and roast peppers with rose harissa.",
      "Nestle cod into the pan.",
      "Cook gently until the fish flakes easily.",
      "Finish with parsley, lemon and olive oil.",
    ],
  },

  {
    id: "soft-boiled-eggs-green-tahini-lentils",
    title: "Soft-Boiled Eggs with Green Tahini Lentils",
    description:
      "Jammy eggs over herby lentils with greens and a creamy tahini dressing.",
    imageUrl: "/images/recipes/soft-boiled-eggs-green-tahini-lentils.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: ["Eggs", "Lentils", "Greens", "Tahini", "Parsley"],
    matchedProducts: [],
    steps: [
      "Boil eggs until jammy, then cool and peel.",
      "Warm lentils with olive oil and seasoning.",
      "Fold through greens and herbs.",
      "Serve with tahini dressing and halved eggs.",
    ],
  },

  {
    id: "sticky-miso-chicken-tenderstem-rice",
    title: "Sticky Miso Chicken with Tenderstem & Rice",
    description:
      "Sticky miso chicken with tenderstem broccoli, rice and sesame.",
    imageUrl: "/images/recipes/sticky-miso-chicken-tenderstem-rice.jpg",
    mood: "quick",
    eatingStyle: "protein",
    focusTags: ["family-friendly", "veg-heavy"],
    ingredients: [
      "Chicken",
      "Tenderstem broccoli",
      "Rice",
      "White miso",
      "Sesame",
    ],
    matchedProducts: ["White Miso"],
    steps: [
      "Cook rice until fluffy.",
      "Pan-fry chicken until golden.",
      "Add white miso, soy and a little sweetness to make a sticky glaze.",
      "Serve with tenderstem broccoli, sesame and rice.",
    ],
  },

  {
    id: "creamy-butter-bean-chicken-bake-herbs",
    title: "Creamy Butter Bean Chicken Bake with Herbs",
    description:
      "A comforting chicken and butter bean bake with cream, herbs and greens.",
    imageUrl: "/images/recipes/creamy-butter-bean-chicken-bake-herbs.jpg",
    mood: "comforting",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Chicken", "Butter beans", "Cream", "Greens", "Herbs"],
    matchedProducts: ["Butter Beans"],
    steps: [
      "Brown chicken pieces in a pan or baking dish.",
      "Add butter beans, cream, garlic and herbs.",
      "Bake until bubbling and the chicken is cooked through.",
      "Fold through greens before serving.",
    ],
  },

  {
    id: "salmon-coconut-lime-rice-bowls",
    title: "Salmon Coconut Lime Rice Bowls",
    description:
      "Bright salmon rice bowls with coconut greens, lime and coriander.",
    imageUrl: "/images/recipes/salmon-coconut-lime-rice-bowls.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["veg-heavy"],
    ingredients: ["Salmon", "Rice", "Coconut milk", "Greens", "Lime"],
    matchedProducts: [],
    steps: [
      "Cook rice until fluffy.",
      "Cook salmon until just flaky.",
      "Simmer greens briefly with coconut milk and lime.",
      "Serve salmon over rice with coconut greens and herbs.",
    ],
  },
];
