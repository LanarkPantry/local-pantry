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
      "Cook the bucatini until properly al dente, saving a mug of pasta water before draining.",
      "Char the courgette hard in a hot pan so the edges catch and the middle softens.",
      "Loosen the pesto with a splash of pasta water, then toss through the bucatini and courgette until glossy.",
      "Finish with lemon zest, black pepper and parmesan.",
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
      "Cook the giant couscous until tender, then dress it with olive oil and lemon while warm.",
      "Warm the butter beans with rose harissa, a splash of water and the roasted peppers until the sauce turns glossy.",
      "Fold the couscous through the beans so it catches the harissa dressing.",
      "Finish with parsley, yoghurt and a little extra lemon.",
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
    matchedProducts: ["Farro", "Vegetable Stock"],
    steps: [
      "Cook the farro until chewy but tender, then drain well.",
      "Fry the mushrooms in a hot pan until deeply browned and concentrated.",
      "Stir in garlic, vegetable stock, and a splash of water to make a savoury glaze.",
      "Fold through the greens until just wilted, then spoon over the farro.",
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
      "Soften garlic in olive oil until fragrant but not browned.",
      "Add tomatoes, chickpeas and orzo with enough water or stock to cook gently.",
      "Simmer until the orzo is tender and the sauce looks glossy rather than wet.",
      "Finish with basil, black pepper and a final drizzle of olive oil.",
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
      "Cook the rice until fluffy and season lightly while warm.",
      "Char the broccoli in a hot pan or roasting tray until the tips catch.",
      "Toss the broccoli with gochujang, lime and a little sweetness until sticky.",
      "Serve over rice with cucumber, spring onions and sesame if using.",
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
      "Roast the cauliflower with oil, salt and thyme until golden at the edges.",
      "Warm the puy lentils with garlic, olive oil and a splash of stock or water.",
      "Cook the polenta slowly until soft, creamy and spoonable.",
      "Spoon the lentils and cauliflower over the polenta and finish with pepper.",
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
      "Cook the aubergine in olive oil until soft, golden and collapsing.",
      "Add garlic and tomatoes, then simmer until the sauce thickens.",
      "Fold through the cannellini beans and warm gently so they stay whole.",
      "Finish with parsley and serve with bread, rice or couscous.",
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
      "Cook the farro until chewy, then dress it while warm with lemon, oil and salt.",
      "Slice the beetroot and toss it through the grains so the colour bleeds slightly.",
      "Fold through parsley and walnuts for freshness and crunch.",
      "Finish with extra lemon and goat’s cheese if liked.",
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
      "Soften the base of the risotto gently before stirring in the rice.",
      "Add hot stock gradually, stirring until the rice turns creamy.",
      "Add the green beans near the end so they stay bright.",
      "Finish off the heat with lemon zest, parmesan, mint and black pepper.",
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
      "Cook the sliced potatoes until tender and lightly golden.",
      "Soften the peppers and onion in the same pan until sweet.",
      "Pour in seasoned eggs and cook gently until the edges begin to set.",
      "Finish under the grill, then scatter with parsley before serving.",
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
      "Boil the potatoes until tender, then lightly crush them on a tray.",
      "Roast the crushed potatoes until crisp at the edges.",
      "Add salmon and green beans for the final stretch so the fish stays soft.",
      "Finish with lemon, dill and a spoon of yoghurt if liked.",
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
      "Cook the rice until fluffy and keep warm.",
      "Pan-fry the chicken until golden and cooked through.",
      "Toss the chicken with gochujang, lime and a little sweetness until sticky.",
      "Serve with cucumber, spring onions and sesame over the rice.",
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
      "Cook the noodles until just tender, then rinse or toss lightly so they do not clump.",
      "Char the broccoli until smoky at the edges but still green.",
      "Stir cashew butter or blended cashews with lime, soy and warm water into a loose sauce.",
      "Toss everything together and finish with coriander and extra lime.",
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
      "Press and cube the tofu, then fry until crisp and golden.",
      "Cook the rice until fluffy and season lightly.",
      "Mix peanut sauce with lime, soy and warm water until spoonable.",
      "Serve tofu over rice with cucumber, carrots and plenty of sauce.",
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
      "Cook the casarecce until al dente, saving some pasta water.",
      "Blend roasted peppers with soaked cashews, garlic and seasoning until silky.",
      "Warm the sauce gently and loosen it with pasta water.",
      "Toss through the pasta and finish with basil and black pepper.",
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
      "Cook the giant couscous until tender, then dress with lemon and olive oil.",
      "Season the chicken and pan-fry until golden and cooked through.",
      "Char the courgette or seasonal vegetables in the same pan.",
      "Slice the chicken over the couscous and finish with parsley and lemon.",
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
      "Boil the potatoes until tender, then toss with olive oil and herbs.",
      "Cook the salmon gently until just flaky.",
      "Crush the peas with mint, lemon, salt and a little olive oil.",
      "Serve the salmon with herby potatoes and the bright crushed peas.",
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
      "Roast fennel and tomatoes until soft, sweet and slightly jammy.",
      "Toast the sourdough until crisp enough to hold the topping.",
      "Pile the roasted vegetables over the toast while still warm.",
      "Tear over burrata and finish with basil, olive oil and black pepper.",
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
      "Halve the peppers and roast until beginning to soften.",
      "Mix cooked rice with spinach, ricotta, herbs and seasoning.",
      "Fill the peppers generously and bake until the tops turn golden.",
      "Serve with extra herbs and a simple green salad.",
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
      "Cook the rice until fluffy and keep warm.",
      "Pan-fry the chicken until golden on the outside.",
      "Add soy, ginger and a little sweetness to make a glossy glaze.",
      "Serve with quickly wilted greens and a sharp squeeze of lime.",
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
      "Warm garlic gently in olive oil until fragrant.",
      "Add butter beans, cream and a splash of water, then simmer until glossy.",
      "Fold through the greens until just wilted.",
      "Finish with parmesan, herbs and black pepper.",
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
      "Cook the orzo until tender, then drain and dress with lemon.",
      "Char the courgette hard so the edges brown and soften.",
      "Whip or mash feta with lemon and olive oil until creamy.",
      "Serve the orzo with courgette, mint and spoonfuls of whipped feta.",
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
      "Cook the rice until fluffy.",
      "Fry the tofu until crisp and golden on the edges.",
      "Simmer the greens briefly with coconut milk, lime and seasoning.",
      "Serve the tofu over rice with coconut greens and extra lime.",
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
      "Roast tomatoes with garlic, olive oil and salt until they collapse.",
      "Pan-fry or bake the gnocchi until golden and crisp-edged.",
      "Toss the gnocchi through the roasted tomato juices.",
      "Finish with torn burrata, basil and black pepper.",
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
      "Cook the giant couscous until tender, then dress with lemon and olive oil.",
      "Pan-fry the halloumi until deeply golden on both sides.",
      "Toss cucumber and mint through the couscous for freshness.",
      "Drizzle the halloumi with hot honey and serve over the herby couscous.",
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
      "Roast sweet potato with smoky spices until soft and caramelised.",
      "Warm the black beans with lime, garlic and seasoning.",
      "Cook the rice until fluffy.",
      "Serve with avocado yoghurt, coriander and extra lime.",
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
      "Cook the casarecce until al dente, saving a splash of pasta water.",
      "Soften the leeks slowly until sweet and silky.",
      "Add cooked chicken, mustard and cream, then loosen with pasta water.",
      "Toss through the pasta and finish with black pepper.",
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
      "Roast the carrots until tender, browned and sweet at the edges.",
      "Toast the sourdough until crisp.",
      "Spread thick labneh over the toast.",
      "Top with carrots, parsley, dukkah and a drizzle of olive oil.",
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
      "Cook the rice noodles until tender, then rinse lightly so they stay separate.",
      "Wilt the greens quickly in a hot pan.",
      "Mix peanut sauce with lime and warm water until loose and glossy.",
      "Toss noodles and greens with the sauce, then finish with coriander.",
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
      "Bake feta with tomatoes, olive oil and black pepper until soft and blistered.",
      "Add butter beans and return to the oven until bubbling.",
      "Fold through greens while everything is still hot.",
      "Serve with toast for scooping up the sauce.",
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
      "Cook the rice until fluffy.",
      "Simmer tomatoes, chickpeas and coconut milk until the sauce thickens.",
      "Fold through greens near the end so they stay bright.",
      "Finish with coriander and lime before serving over rice.",
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
      "Warm garlic in olive oil until fragrant.",
      "Add cannellini beans and stock or water, then simmer until the broth tastes rounded.",
      "Fold through greens at the end so they keep their colour.",
      "Finish with parmesan, black pepper and crisp toasts.",
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
      "Warm chickpeas with rose harissa and olive oil until glossy.",
      "Toast or warm the flatbreads until soft with crisp edges.",
      "Spoon over yoghurt, cucumber and the warm chickpeas.",
      "Finish with herbs, lemon and a little extra harissa.",
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
      "Simmer the green lentils until tender.",
      "Add coconut milk and gentle spices, then cook until creamy.",
      "Fold through the greens near the end.",
      "Serve with rice, coriander and lime.",
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
      "Cook the bucatini until al dente, saving pasta water.",
      "Soften garlic and kale in olive oil until the kale darkens and relaxes.",
      "Toss pasta with kale, lemon and enough pasta water to coat.",
      "Finish with parmesan, black pepper and extra lemon zest.",
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
      "Roast the vegetables until golden and caramelised at the edges.",
      "Cook the farro until chewy but tender.",
      "Toss the warm farro with herbs, lemon and olive oil.",
      "Fold through the roast vegetables and finish with walnuts.",
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
      "Roast or fry the chickpeas until crisp and deeply golden.",
      "Char the greens in a hot pan until smoky at the edges.",
      "Mix tahini, yoghurt, lemon and salt into a creamy sauce.",
      "Spoon the sauce under the greens and scatter chickpeas over the top.",
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
      "Roast the squash until soft, sweet and caramelised.",
      "Warm the puy lentils with olive oil, lemon and seasoning.",
      "Toss lentils with parsley while still warm.",
      "Serve with squash and yoghurt if liked.",
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
      "Cook the giant couscous until tender, then dress with citrus juice.",
      "Pan-fry the halloumi until golden and crisp-edged.",
      "Fold cucumber, mint and orange through the couscous.",
      "Top with halloumi and extra citrus dressing.",
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
      "Cook the rice until fluffy.",
      "Fry tofu until lightly golden on the edges.",
      "Warm the korma sauce with greens until the leaves soften.",
      "Serve tofu and sauce over rice with coriander.",
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
      "Roast the potatoes first until golden and crisp at the edges.",
      "Add salmon and greens for the final stretch so the fish stays flaky.",
      "Mix yoghurt, mustard, lemon and dill into a sharp spooning sauce.",
      "Serve everything from the tray with the sauce on the side.",
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
      "Roast or blister the tomatoes until they turn soft and jammy.",
      "Warm butter beans in a skillet with garlic, olive oil and herbs.",
      "Fold the tomatoes through the beans so their juices become the sauce.",
      "Serve with toast and extra parsley.",
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
      "Soften garlic and onion slowly until sweet.",
      "Add smoked paprika and tomatoes, then let the sauce darken slightly.",
      "Simmer lentils until tender and the stew thickens naturally.",
      "Finish with parsley, olive oil and a squeeze of lemon.",
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
      "Roast the tomatoes and garlic until collapsed and sweet.",
      "Blend or crush with stock and torn bread until thick and rustic.",
      "Simmer gently until the bread softens into the soup.",
      "Finish with basil, parmesan if liked and olive oil.",
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
      "Soften the risotto base gently before stirring in the rice.",
      "Add hot stock gradually until the rice turns creamy.",
      "Stir in courgette and peas near the end so they stay green.",
      "Finish with lemon zest, mint and parmesan if using.",
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
      "Cook garlic and rosemary gently in olive oil until fragrant.",
      "Add tomatoes and butter beans, then simmer until thick and soft.",
      "Fold through greens near the end so they wilt into the stew.",
      "Serve with toast and a final drizzle of olive oil.",
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
      "Boil the potatoes until tender, then dress while still warm.",
      "Soft-boil the eggs, cool slightly and halve.",
      "Blend yoghurt, herbs, lemon and spring onions into a green dressing.",
      "Toss potatoes through the dressing and top with eggs.",
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
      "Roast the peppers until soft and slightly charred.",
      "Simmer tomatoes and garlic until the sauce thickens.",
      "Add chickpeas and roasted peppers, then warm through gently.",
      "Finish with parsley, lemon and olive oil.",
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
      "Cook carrots and ginger until the carrots are fully soft.",
      "Blend with coconut milk until silky and bright.",
      "Cook rice separately until fluffy.",
      "Serve the soup with rice, lime and coriander.",
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
      "Combine white beans, tomatoes, garlic and olive oil in a baking dish.",
      "Bake until bubbling at the edges and slightly thickened.",
      "Let it sit briefly so the sauce settles around the beans.",
      "Finish with parsley and serve with toast.",
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
      "Char the corn in a hot pan until smoky and sweet.",
      "Warm black beans with lime, garlic and seasoning.",
      "Cook the rice until fluffy.",
      "Build the bowls with coriander, yoghurt and extra lime.",
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
      "Bake the aubergine until soft, smoky and collapsing.",
      "Mix yoghurt with lemon, garlic and salt.",
      "Spread the yoghurt over plates and top with warm aubergine.",
      "Finish with parsley, olive oil and any crunchy seeds or nuts.",
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
      "Cook mushrooms in a hot pan until deeply browned.",
      "Simmer barley in stock until chewy and tender.",
      "Stir in cream, thyme and garlic until the pot turns glossy.",
      "Finish with black pepper and herbs.",
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
      "Warm garlic and herbs in olive oil to start the broth.",
      "Add beans and stock, then simmer until the flavour rounds out.",
      "Fold through greens right at the end.",
      "Finish with parmesan, black pepper and toast.",
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
      "Roast squash until golden and sweet at the edges.",
      "Simmer red lentils until soft and creamy.",
      "Stir in coconut milk and fold through the roasted squash.",
      "Finish with coriander, lime and chilli oil if liked.",
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
      "Boil potatoes until tender, then halve while warm.",
      "Cook green beans briefly so they keep some snap.",
      "Whisk mustard, lemon, olive oil and herbs into a sharp dressing.",
      "Toss everything together while warm so the potatoes absorb the flavour.",
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
      "Roast tomatoes until jammy and slightly collapsed.",
      "Cook polenta slowly until creamy and spoonable.",
      "Wilt the greens with garlic and olive oil.",
      "Spoon tomatoes and greens over the polenta and finish with parmesan.",
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
      "Blanch the broad beans briefly, then season with lemon and herbs.",
      "Toast the sourdough until crisp and golden.",
      "Spread ricotta generously over the toast.",
      "Pile on broad beans and finish with mint, olive oil and black pepper.",
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
      "Roast chickpeas until crisp and golden.",
      "Cook runner beans until tender but still bright.",
      "Mix tahini, yoghurt, lemon and water into a creamy dressing.",
      "Toss the beans with dressing and finish with chickpeas.",
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
      "Cook the orzo until tender, saving a little cooking water.",
      "Sauté asparagus quickly so it stays green and snappy.",
      "Toss orzo with lemon, parmesan and enough water to make it glossy.",
      "Fold through asparagus and finish with parsley.",
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
      "Cook the rice until fluffy.",
      "Char tenderstem broccoli until the stems soften and tips catch.",
      "Toss with gochujang, lime and a little sweetness until sticky.",
      "Serve with cucumber, spring onions and sesame.",
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
      "Simmer red lentils until soft and creamy.",
      "Stir in coconut milk and cook until silky.",
      "Fold through spinach at the end so it stays bright.",
      "Finish with lime, coriander and chilli if liked.",
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
      "Boil potatoes until tender, then dress while warm.",
      "Roughly chop watercress and herbs.",
      "Whisk mustard, lemon and olive oil into a bright dressing.",
      "Fold everything together gently and serve with extra herbs.",
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
      "Cook the farro until chewy, then cool slightly.",
      "Dress the farro with lemon, olive oil and salt while still warm.",
      "Fold through rocket, pear slices and walnuts just before serving.",
      "Finish with black pepper and cheese if liked.",
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
      "Cook the grains until tender and dress while warm.",
      "Shred cabbage finely and toss with mustard, lemon and salt.",
      "Fold in apple slices and herbs for crunch.",
      "Serve as bowls with extra dressing spooned over.",
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
      "Cook noodles until tender, then toss lightly so they do not clump.",
      "Char or steam tenderstem until bright and just tender.",
      "Mix sesame, lime and soy into a loose dressing.",
      "Toss together and finish with cashews and spring onions.",
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
      "Cook giant couscous until tender, then dress with lemon and olive oil.",
      "Blanch broad beans briefly and season with salt.",
      "Fold beans, mint and feta through the couscous.",
      "Finish with extra lemon zest and black pepper.",
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
      "Warm the flatbreads until soft with lightly crisped edges.",
      "Wilt spinach quickly, then mix with yoghurt, lemon and herbs.",
      "Spoon the spinach yoghurt over the flatbreads.",
      "Finish with olive oil, black pepper and extra herbs.",
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
      "Slice the pear just before serving so it stays fresh.",
      "Toss leaves with a sharp honey-mustard dressing.",
      "Layer pear, gorgonzola and walnuts through the salad.",
      "Finish with black pepper and a final drizzle of dressing.",
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
      "Warm lentils with rosemary, olive oil and a little mustard.",
      "Wilt greens briefly so they stay vibrant.",
      "Fold in crisp apple slices for sweetness and crunch.",
      "Finish with lemon and extra rosemary.",
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
      "Cook potatoes and peas until tender.",
      "Add watercress and herbs at the end so the soup stays green.",
      "Blend until smooth and season with lemon.",
      "Finish with yoghurt, peas and olive oil.",
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
      "Boil potatoes until tender, then halve while warm.",
      "Cook asparagus briefly so it stays bright with a little bite.",
      "Mix yoghurt, dill, lemon and salt into a creamy dressing.",
      "Toss gently and finish with extra dill.",
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
      "Blanch broad beans briefly and toss with mint, lemon and olive oil.",
      "Toast the bread until crisp and sturdy.",
      "Spread thick labneh over the toast.",
      "Pile on broad beans and finish with black pepper.",
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
      "Char tenderstem and greens quickly in a hot pan.",
      "Warm ginger, sesame and soy into a glossy dressing.",
      "Toss the greens through the dressing while still hot.",
      "Serve with rice, spring onions and sesame seeds.",
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
      "Sauté asparagus quickly so it stays green and snappy.",
      "Warm white beans with garlic, lemon and olive oil.",
      "Fold the asparagus through the beans until glossy.",
      "Finish with parsley, black pepper and extra lemon.",
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
      "Cook runner beans until tender but still bright.",
      "Toast walnuts with crumbs, garlic and herbs until fragrant.",
      "Toss the beans with lemon and yoghurt or olive oil.",
      "Scatter the walnut herb crumbs over the top just before serving.",
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
      "Warm flatbreads until soft with crisp edges.",
      "Layer on pear slices and blue cheese, then heat briefly until the cheese softens.",
      "Top with rocket after baking so it stays peppery and fresh.",
      "Finish with walnuts, honey and black pepper.",
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
      "Cook the rice until fluffy, then fold through sesame seeds and a little salt.",
      "Brush the salmon with white miso, lime and a small splash of oil until glossy.",
      "Roast or pan-cook the salmon until just flaky, keeping the centre soft.",
      "Wilt the greens quickly and serve everything with lime and spring onions.",
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
      "Season chicken mince and shape into small meatballs.",
      "Brown the meatballs in olive oil until golden on the outside.",
      "Add tomatoes, orzo and enough water or stock to simmer gently.",
      "Finish with basil, parmesan and black pepper once the orzo is tender.",
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
      "Press and cube the tofu, then fry until crisp and deeply golden.",
      "Cook the noodles until tender and toss lightly to prevent sticking.",
      "Mix peanut sauce with lime, soy and warm water until creamy.",
      "Serve with crunchy vegetables, coriander and plenty of satay sauce.",
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
      "Brown chicken pieces in a wide pan until golden.",
      "Add cannellini beans, garlic, lemon and a splash of stock or water.",
      "Simmer until the chicken is cooked through and the beans are glossy.",
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
      "Cook the rice until fluffy and keep warm.",
      "Fry turkey mince with ginger, garlic and soy until savoury and browned.",
      "Add greens and cook just until wilted.",
      "Serve with rice, cucumber, spring onions and sesame.",
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
      "Warm chickpeas and roast peppers with rose harissa and olive oil.",
      "Nestle the cod into the pan and spoon some sauce over the top.",
      "Cook gently until the fish flakes easily.",
      "Finish with parsley, lemon and a drizzle of olive oil.",
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
      "Boil the eggs until jammy, then cool, peel and halve.",
      "Warm lentils with olive oil, lemon and seasoning.",
      "Fold through greens and herbs until just wilted.",
      "Serve with green tahini dressing and the halved eggs.",
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
      "Cook the rice until fluffy.",
      "Pan-fry the chicken until golden and almost cooked through.",
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
      "Add butter beans, cream, garlic and herbs around the chicken.",
      "Bake until bubbling and the chicken is cooked through.",
      "Fold through greens and finish with black pepper.",
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
      "Cook the rice until fluffy.",
      "Cook the salmon until just flaky and still soft in the centre.",
      "Simmer greens briefly with coconut milk and lime.",
      "Serve the salmon over rice with coconut greens and coriander.",
    ],
  },

  // 88. Chicken, Pesto Potatoes & Green Beans
  {
    id: "chicken-pesto-potatoes-green-beans",
    title: "Chicken, Pesto Potatoes & Green Beans",
    description:
      "Golden chicken with pesto-dressed potatoes and crisp green beans.",
    imageUrl: "/images/recipes/chicken-pesto-potatoes-green-beans.jpg",
    mood: "balanced",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: [
      "Chicken",
      "Potatoes",
      "Green beans",
      "Sorrel & Walnut Pesto",
      "Lemon",
    ],
    matchedProducts: ["Sorrel & Walnut Pesto"],
    steps: [
      "Roast or pan-fry the chicken until golden and cooked through.",
      "Boil the potatoes until tender, then crush lightly while still warm.",
      "Toss the potatoes with sorrel and walnut pesto so they turn glossy.",
      "Serve with green beans, lemon and a final spoon of pesto.",
    ],
  },

  // 89. Pesto Pea Orzo with Greens
  {
    id: "pesto-pea-orzo-greens",
    title: "Pesto Pea Orzo with Greens",
    description:
      "A quick green orzo with peas, leafy greens and fresh sorrel pesto.",
    imageUrl: "/images/recipes/pesto-pea-orzo-greens.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: ["Orzo", "Peas", "Greens", "Sorrel & Walnut Pesto", "Lemon"],
    matchedProducts: ["Orzo", "Sorrel & Walnut Pesto"],
    steps: [
      "Cook the orzo until tender, saving a little cooking water.",
      "Add peas and greens near the end so they stay bright.",
      "Stir through sorrel and walnut pesto with a splash of cooking water.",
      "Finish with lemon, black pepper and extra herbs.",
    ],
  },

  // 90. Roasted Courgettes with Pesto Butter Beans
  {
    id: "roasted-courgettes-pesto-butter-beans",
    title: "Roasted Courgettes with Pesto Butter Beans",
    description:
      "Roasted courgettes over creamy butter beans folded with green pesto.",
    imageUrl: "/images/recipes/roasted-courgettes-pesto-butter-beans.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: [
      "Courgettes",
      "Butter beans",
      "Sorrel & Walnut Pesto",
      "Lemon",
      "Parsley",
    ],
    matchedProducts: ["Butter Beans", "Sorrel & Walnut Pesto"],
    steps: [
      "Roast courgettes until golden at the edges and soft in the middle.",
      "Warm butter beans gently with a splash of stock or water.",
      "Fold through sorrel and walnut pesto so the beans stay creamy.",
      "Top with courgettes, parsley, lemon and black pepper.",
    ],
  },

  // 91. Green Grain Bowl with Farro & Pesto
  {
    id: "green-grain-bowl-farro-pesto",
    title: "Green Grain Bowl with Farro & Pesto",
    description:
      "A fresh farro bowl with greens, herbs and a generous spoon of pesto.",
    imageUrl: "/images/recipes/green-grain-bowl-farro-pesto.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "low-waste"],
    ingredients: [
      "Farro",
      "Greens",
      "Sorrel & Walnut Pesto",
      "Courgette",
      "Lemon",
    ],
    matchedProducts: ["Farro", "Sorrel & Walnut Pesto"],
    steps: [
      "Cook the farro until chewy, then dress it while warm.",
      "Char or roast the vegetables until lightly browned.",
      "Fold greens and herbs through the warm grains.",
      "Finish with sorrel and walnut pesto, lemon and black pepper.",
    ],
  },

  // 92. Pesto Chickpeas & Roast Tomatoes on Toast
  {
    id: "pesto-chickpeas-roast-tomatoes-toast",
    title: "Pesto Chickpeas & Roast Tomatoes on Toast",
    description:
      "Warm chickpeas, jammy tomatoes and green pesto piled onto toast.",
    imageUrl: "/images/recipes/pesto-chickpeas-roast-tomatoes-toast.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: [
      "Chickpeas",
      "Roast tomatoes",
      "Toast",
      "Sorrel & Walnut Pesto",
      "Basil",
    ],
    matchedProducts: [
      "Chickpeas",
      "Premium Whole Tomatoes",
      "Sorrel & Walnut Pesto",
    ],
    steps: [
      "Roast tomatoes until soft and jammy.",
      "Warm chickpeas gently with a splash of stock or tomato juices.",
      "Toast the bread until crisp enough to hold the topping.",
      "Spoon chickpeas and tomatoes over the toast and finish with pesto.",
    ],
  },

  // 93. Harissa Chicken Couscous Traybake
  {
    id: "harissa-chicken-couscous-traybake",
    title: "Harissa Chicken Couscous Traybake",
    description:
      "Harissa chicken roasted with vegetables and served over giant couscous.",
    imageUrl: "/images/recipes/harissa-chicken-couscous-traybake.jpg",
    mood: "comforting",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: [
      "Chicken",
      "Giant couscous",
      "Rose harissa",
      "Peppers",
      "Courgette",
    ],
    matchedProducts: ["Rose Harissa", "Giant Couscous", "Vegetable Stock"],
    steps: [
      "Rub the chicken with rose harissa, oil and a little salt.",
      "Roast with peppers, onions and seasonal vegetables until golden.",
      "Cook the giant couscous in vegetable stock until tender.",
      "Serve the chicken and vegetables over the couscous with herbs and lemon.",
    ],
  },

  // 94. Harissa Lentil & Walnut Salad
  {
    id: "harissa-lentil-walnut-salad",
    title: "Harissa Lentil & Walnut Salad",
    description:
      "Puy lentils with walnuts, herbs and a warm rose harissa dressing.",
    imageUrl: "/images/recipes/harissa-lentil-walnut-salad.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: [
      "Puy lentils",
      "Walnuts",
      "Rose harissa",
      "Parsley",
      "Red onion",
    ],
    matchedProducts: ["Rose Harissa", "Puy Lentils", "Walnuts"],
    steps: [
      "Cook the puy lentils until tender but still structured.",
      "Whisk rose harissa with lemon, olive oil and a little sweetness.",
      "Toss the warm lentils through the dressing so they absorb flavour.",
      "Finish with walnuts, herbs and red onion.",
    ],
  },

  // 95. Harissa White Beans & Roast Tomatoes
  {
    id: "harissa-white-beans-roast-tomatoes",
    title: "Harissa White Beans & Roast Tomatoes",
    description:
      "Creamy white beans with roast tomatoes, greens and rose harissa.",
    imageUrl: "/images/recipes/harissa-white-beans-roast-tomatoes.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: [
      "White beans",
      "Tomatoes",
      "Rose harissa",
      "Greens",
      "Parsley",
    ],
    matchedProducts: [
      "Rose Harissa",
      "Cannellini Beans",
      "Premium Whole Tomatoes",
    ],
    steps: [
      "Roast tomatoes until they collapse and turn jammy.",
      "Warm white beans gently with rose harissa and a splash of stock.",
      "Fold through greens until just wilted.",
      "Serve with herbs, black pepper and toast if liked.",
    ],
  },

  // 96. Harissa Sweet Potato Farro Bowl
  {
    id: "harissa-sweet-potato-farro-bowl",
    title: "Harissa Sweet Potato Farro Bowl",
    description:
      "Roasted sweet potato, chewy farro and greens with rose harissa dressing.",
    imageUrl: "/images/recipes/harissa-sweet-potato-farro-bowl.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "family-friendly"],
    ingredients: [
      "Sweet potato",
      "Farro",
      "Rose harissa",
      "Greens",
      "Chickpeas",
    ],
    matchedProducts: ["Rose Harissa", "Farro", "Vegetable Stock"],
    steps: [
      "Roast sweet potato with rose harissa until tender and caramelised.",
      "Cook farro in vegetable stock until chewy.",
      "Fold greens through the warm grains.",
      "Top with the sweet potato and extra harissa dressing.",
    ],
  },

  // 97. Harissa Butter Beans with Greens
  {
    id: "harissa-butter-beans-greens",
    title: "Harissa Butter Beans with Greens",
    description:
      "Creamy butter beans and greens in a warm rose harissa tomato sauce.",
    imageUrl: "/images/recipes/harissa-butter-beans-greens.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: [
      "Butter beans",
      "Greens",
      "Rose harissa",
      "Tomatoes",
      "Parsley",
    ],
    matchedProducts: ["Rose Harissa", "Butter Beans", "Vegetable Stock"],
    steps: [
      "Soften garlic or onion gently in olive oil.",
      "Add butter beans, rose harissa and a splash of stock.",
      "Fold through greens until glossy and wilted.",
      "Finish with parsley, lemon and black pepper.",
    ],
  },

  // 98. Sticky Gochujang Chicken Rice Bowl
  {
    id: "sticky-gochujang-chicken-rice-bowl",
    title: "Sticky Gochujang Chicken Rice Bowl",
    description: "Sticky gochujang chicken over rice with cucumber and greens.",
    imageUrl: "/images/recipes/sticky-gochujang-chicken-rice-bowl.jpg",
    mood: "quick",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: ["Chicken", "Rice", "Gochujang", "Cucumber", "Greens"],
    matchedProducts: ["Signature Gochujang", "Vegetable Stock"],
    steps: [
      "Cook the rice until fluffy and keep warm.",
      "Pan-fry chicken until golden and cooked through.",
      "Toss the chicken with gochujang until glossy and sticky.",
      "Serve over rice with cucumber, greens and spring onions.",
    ],
  },

  // 99. Gochujang Cashew Noodle Salad
  {
    id: "gochujang-cashew-noodle-salad",
    title: "Gochujang Cashew Noodle Salad",
    description:
      "Noodles tossed with gochujang dressing, vegetables and toasted cashews.",
    imageUrl: "/images/recipes/gochujang-cashew-noodle-salad.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "veg-heavy"],
    ingredients: ["Noodles", "Gochujang", "Cashews", "Greens", "Red pepper"],
    matchedProducts: ["Signature Gochujang", "Cashews"],
    steps: [
      "Cook the noodles until just tender, then rinse or toss so they stay loose.",
      "Mix gochujang with lime, soy and a little warm water into a dressing.",
      "Toss noodles with greens, peppers and herbs.",
      "Finish with toasted cashews and spring onions.",
    ],
  },

  // 100. Gochujang Chickpeas & Roast Broccoli
  {
    id: "gochujang-chickpeas-roast-broccoli",
    title: "Gochujang Chickpeas & Roast Broccoli",
    description: "Sticky gochujang chickpeas roasted with charred broccoli.",
    imageUrl: "/images/recipes/gochujang-chickpeas-roast-broccoli.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "family-friendly"],
    ingredients: [
      "Chickpeas",
      "Broccoli",
      "Gochujang",
      "Spring onions",
      "Sesame",
    ],
    matchedProducts: ["Signature Gochujang", "Chickpeas"],
    steps: [
      "Roast broccoli until the tips char and the stems soften.",
      "Toss chickpeas with gochujang until evenly coated.",
      "Return everything to the tray until sticky and glossy.",
      "Finish with spring onions, sesame and lime.",
    ],
  },

  // 101. Gochujang Tomato Beans
  {
    id: "gochujang-tomato-beans",
    title: "Gochujang Tomato Beans",
    description:
      "Tomato-rich white beans with gochujang warmth and wilted greens.",
    imageUrl: "/images/recipes/gochujang-tomato-beans.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste", "family-friendly"],
    ingredients: [
      "White beans",
      "Tomatoes",
      "Gochujang",
      "Greens",
      "Spring onions",
    ],
    matchedProducts: [
      "Signature Gochujang",
      "Cannellini Beans",
      "Premium Whole Tomatoes",
    ],
    steps: [
      "Simmer tomatoes with garlic until the sauce thickens.",
      "Stir in gochujang until the sauce turns glossy.",
      "Fold through white beans and warm gently.",
      "Add greens at the end and finish with spring onions.",
    ],
  },

  // 102. Gochujang Butter Beans & Greens
  {
    id: "gochujang-butter-beans-greens",
    title: "Gochujang Butter Beans & Greens",
    description:
      "Plump butter beans and greens coated in a sticky gochujang glaze.",
    imageUrl: "/images/recipes/gochujang-butter-beans-greens.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: [
      "Butter beans",
      "Greens",
      "Gochujang",
      "Spring onions",
      "Sesame",
    ],
    matchedProducts: ["Signature Gochujang", "Butter Beans"],
    steps: [
      "Warm butter beans gently so they stay whole.",
      "Stir gochujang with a splash of stock or water into a glossy sauce.",
      "Fold through greens until just wilted.",
      "Finish with spring onions, sesame and a little lime.",
    ],
  },

  // 103. Mushroom & Herb Risotto
  {
    id: "mushroom-herb-risotto",
    title: "Mushroom & Herb Risotto",
    description:
      "A creamy risotto with deeply browned mushrooms, herbs and black pepper.",
    imageUrl: "/images/recipes/mushroom-herb-risotto.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: [
      "Risotto rice",
      "Mushrooms",
      "Vegetable Stock",
      "Thyme",
      "Parmesan",
    ],
    matchedProducts: ["Risotto Rice", "Vegetable Stock"],
    steps: [
      "Brown the mushrooms hard in a hot pan until concentrated and savoury.",
      "Soften the risotto base gently, then stir in the rice.",
      "Add hot vegetable stock gradually until the rice turns creamy.",
      "Fold through mushrooms, herbs and parmesan before serving.",
    ],
  },

  // 104. Pea & Lemon Risotto
  {
    id: "pea-lemon-risotto",
    title: "Pea & Lemon Risotto",
    description: "A bright green risotto with peas, lemon and leafy greens.",
    imageUrl: "/images/recipes/pea-lemon-risotto.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: ["Risotto rice", "Peas", "Lemon", "Greens", "Parmesan"],
    matchedProducts: ["Risotto Rice", "Vegetable Stock"],
    steps: [
      "Soften the risotto base gently, then add the rice.",
      "Add hot vegetable stock gradually, stirring until creamy.",
      "Add peas and greens near the end so they stay bright.",
      "Finish with lemon zest, herbs and parmesan.",
    ],
  },

  // 105. Roast Tomato Risotto
  {
    id: "roast-tomato-risotto",
    title: "Roast Tomato Risotto",
    description: "Creamy risotto with roast tomatoes, basil and black pepper.",
    imageUrl: "/images/recipes/roast-tomato-risotto.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: [
      "Risotto rice",
      "Tomatoes",
      "Vegetable Stock",
      "Basil",
      "Parmesan",
    ],
    matchedProducts: [
      "Risotto Rice",
      "Premium Whole Tomatoes",
      "Vegetable Stock",
    ],
    steps: [
      "Roast tomatoes until soft, sweet and slightly blistered.",
      "Start the risotto base gently, then stir in the rice.",
      "Add hot vegetable stock gradually until the rice turns creamy.",
      "Fold through the roast tomatoes and finish with basil.",
    ],
  },

  // 106. Chicken & Greens Risotto
  {
    id: "chicken-greens-risotto",
    title: "Chicken & Greens Risotto",
    description: "Creamy risotto with golden chicken, greens and parmesan.",
    imageUrl: "/images/recipes/chicken-greens-risotto.jpg",
    mood: "comforting",
    eatingStyle: "protein",
    focusTags: ["family-friendly"],
    ingredients: [
      "Chicken",
      "Risotto rice",
      "Greens",
      "Vegetable Stock",
      "Parmesan",
    ],
    matchedProducts: ["Risotto Rice", "Vegetable Stock"],
    steps: [
      "Pan-fry chicken until golden and cooked through, then slice or shred.",
      "Cook the risotto slowly with hot vegetable stock until creamy.",
      "Fold through greens near the end so they wilt into the rice.",
      "Top with chicken, parmesan and black pepper.",
    ],
  },

  // 107. Creamy Polenta with Roast Tomatoes
  {
    id: "creamy-polenta-roast-tomatoes",
    title: "Creamy Polenta with Roast Tomatoes",
    description:
      "Soft golden polenta topped with jammy roast tomatoes and herbs.",
    imageUrl: "/images/recipes/creamy-polenta-roast-tomatoes.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["family-friendly"],
    ingredients: [
      "Polenta",
      "Tomatoes",
      "Vegetable Stock",
      "Basil",
      "Parmesan",
    ],
    matchedProducts: ["Polenta", "Premium Whole Tomatoes", "Vegetable Stock"],
    steps: [
      "Roast tomatoes until blistered, soft and sweet.",
      "Cook polenta slowly with vegetable stock until creamy and spoonable.",
      "Season the polenta well so it tastes rounded.",
      "Top with roast tomatoes, herbs and black pepper.",
    ],
  },

  // 108. Polenta with White Beans & Greens
  {
    id: "polenta-white-beans-greens",
    title: "Polenta with White Beans & Greens",
    description: "Creamy polenta topped with white beans, greens and parmesan.",
    imageUrl: "/images/recipes/polenta-white-beans-greens.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste", "family-friendly"],
    ingredients: [
      "Polenta",
      "White beans",
      "Greens",
      "Vegetable Stock",
      "Parmesan",
    ],
    matchedProducts: ["Polenta", "Cannellini Beans", "Vegetable Stock"],
    steps: [
      "Cook polenta with vegetable stock until soft and creamy.",
      "Warm white beans gently with garlic and a splash of stock.",
      "Fold greens through the beans until just wilted.",
      "Spoon the beans over the polenta and finish with black pepper.",
    ],
  },

  // 109. Crispy Polenta & Harissa Vegetables
  {
    id: "crispy-polenta-harissa-vegetables",
    title: "Crispy Polenta & Harissa Vegetables",
    description:
      "Crispy golden polenta with roasted vegetables and rose harissa.",
    imageUrl: "/images/recipes/crispy-polenta-harissa-vegetables.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["veg-heavy", "family-friendly"],
    ingredients: [
      "Polenta",
      "Rose harissa",
      "Roast vegetables",
      "Peppers",
      "Courgette",
    ],
    matchedProducts: ["Polenta", "Rose Harissa"],
    steps: [
      "Cook polenta, cool until firm, then cut into pieces.",
      "Pan-fry or roast the polenta until crisp and golden.",
      "Roast vegetables with rose harissa until tender and glossy.",
      "Serve the vegetables over the crispy polenta with herbs.",
    ],
  },

  // 110. Mushroom Polenta Bowl
  {
    id: "mushroom-polenta-bowl",
    title: "Mushroom Polenta Bowl",
    description:
      "Creamy polenta topped with savoury mushrooms, greens and herbs.",
    imageUrl: "/images/recipes/mushroom-polenta-bowl.jpg",
    mood: "comforting",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Polenta", "Mushrooms", "Greens", "Vegetable Stock", "Thyme"],
    matchedProducts: ["Polenta", "Vegetable Stock"],
    steps: [
      "Cook polenta slowly with vegetable stock until creamy.",
      "Brown mushrooms deeply in a hot pan with thyme and garlic.",
      "Wilt greens briefly into the mushrooms.",
      "Spoon mushrooms and greens over the polenta with black pepper.",
    ],
  },

  // 111. Apple, Walnut & Farro Salad
  {
    id: "apple-walnut-farro-salad",
    title: "Apple, Walnut & Farro Salad",
    description:
      "A fresh farro salad with apple, walnuts, herbs and sharp dressing.",
    imageUrl: "/images/recipes/apple-walnut-farro-salad.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Apple", "Farro", "Walnuts", "Rocket", "Parsley"],
    matchedProducts: ["Farro", "Walnuts"],
    steps: [
      "Cook the farro until chewy, then dress while still warm.",
      "Slice the apple just before serving so it stays crisp.",
      "Fold apple, herbs and rocket through the farro.",
      "Finish with walnuts, lemon and black pepper.",
    ],
  },

  // 112. Pear, Hazelnut & Rocket Salad
  {
    id: "pear-hazelnut-rocket-salad",
    title: "Pear, Hazelnut & Rocket Salad",
    description:
      "A fresh rocket salad with pear, toasted hazelnuts and simple dressing.",
    imageUrl: "/images/recipes/pear-hazelnut-rocket-salad.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Pear", "Hazelnuts", "Rocket", "Lemon", "Olive oil"],
    matchedProducts: ["Hazelnuts"],
    steps: [
      "Toast hazelnuts until fragrant, then roughly chop.",
      "Slice the pear just before serving.",
      "Toss rocket with lemon, olive oil and black pepper.",
      "Layer through pear and hazelnuts and serve straight away.",
    ],
  },

  // 113. Roast Beetroot, Apple & Puy Lentils
  {
    id: "beetroot-apple-puy-lentils",
    title: "Roast Beetroot, Apple & Puy Lentils",
    description:
      "Earthy beetroot, crisp apple and puy lentils in a sharp herb dressing.",
    imageUrl: "/images/recipes/beetroot-apple-puy-lentils.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste"],
    ingredients: ["Beetroot", "Apple", "Puy lentils", "Parsley", "Mustard"],
    matchedProducts: ["Puy Lentils"],
    steps: [
      "Roast beetroot until tender, then cut into chunks.",
      "Cook puy lentils until tender but still holding their shape.",
      "Dress the warm lentils with mustard, lemon and olive oil.",
      "Fold through beetroot, apple and parsley before serving.",
    ],
  },

  // 114. Warm Apple, Farro & Herb Bowl
  {
    id: "warm-apple-farro-herb-bowl",
    title: "Warm Apple, Farro & Herb Bowl",
    description: "A warm autumnal farro bowl with apples, walnuts and herbs.",
    imageUrl: "/images/recipes/warm-apple-farro-herb-bowl.jpg",
    mood: "balanced",
    eatingStyle: "veg",
    focusTags: ["low-waste", "family-friendly"],
    ingredients: ["Apple", "Farro", "Walnuts", "Parsley", "Sage"],
    matchedProducts: ["Farro"],
    steps: [
      "Cook the farro until chewy and dress it while warm.",
      "Warm apple slices gently with herbs until just softened.",
      "Fold apples and herbs through the farro.",
      "Finish with walnuts, black pepper and a little lemon.",
    ],
  },

  // 115. Harissa Red Lentil & Tomato Soup
  {
    id: "harissa-lentil-tomato-soup",
    title: "Harissa Red Lentil & Tomato Soup",
    description:
      "A warming tomato and red lentil soup with rose harissa, soft herbs and a bright lemon finish.",
    imageUrl: "/images/recipes/harissa-lentil-tomato-soup.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: [
      "Red lentils",
      "Tomatoes",
      "Rose harissa",
      "Onion",
      "Vegetable Stock",
      "Lemon",
    ],
    matchedProducts: [
      "Rose Harissa Paste",
      "Mutti Polpa Tomatoes",
      "Vegetable Stock",
    ],
    steps: [
      "Soften onion and garlic gently in olive oil until sweet.",
      "Stir in rose harissa, red lentils, tomatoes and vegetable stock.",
      "Simmer until the lentils collapse and the soup thickens.",
      "Finish with lemon, parsley and a spoon of yoghurt if liked.",
    ],
  },

  // 116. Creamy Butter Bean, Lemon & Greens Soup
  {
    id: "butterbean-lemon-greens-soup",
    title: "Creamy Butter Bean, Lemon & Greens Soup",
    description:
      "A creamy butter bean soup with leafy greens, lemon zest and a soft garlic base.",
    imageUrl: "/images/recipes/butterbean-lemon-greens-soup.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "veg-heavy"],
    ingredients: [
      "Butter beans",
      "Greens",
      "Lemon",
      "Garlic",
      "Vegetable Stock",
    ],
    matchedProducts: ["Bold Bean Co Queen Butter Beans", "Vegetable Stock"],
    steps: [
      "Soften onion and garlic in olive oil until mellow.",
      "Add butter beans and vegetable stock, then simmer until creamy.",
      "Mash or blend a small ladleful back into the pan to thicken the soup.",
      "Fold through greens and finish with lemon zest, black pepper and olive oil.",
    ],
  },

  // 117. Tomato, Chickpea & Orzo Soup
  {
    id: "tomato-chickpea-orzo-soup",
    title: "Tomato, Chickpea & Orzo Soup",
    description:
      "A hearty tomato soup with chickpeas, orzo, greens and herbs for an easy one-pot dinner.",
    imageUrl: "/images/recipes/tomato-chickpea-orzo-soup.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "low-waste"],
    ingredients: [
      "Orzo",
      "Chickpeas",
      "Tomatoes",
      "Greens",
      "Garlic",
      "Vegetable Stock",
    ],
    matchedProducts: [
      "Orzo Pasta",
      "Bold Bean Co Queen Chickpeas",
      "Mutti Polpa Tomatoes",
      "Vegetable Stock",
    ],
    steps: [
      "Soften garlic in olive oil until fragrant.",
      "Add tomatoes, chickpeas, orzo and vegetable stock.",
      "Simmer gently until the orzo is tender and the soup has thickened slightly.",
      "Fold through greens and finish with parsley, black pepper and olive oil.",
    ],
  },

  // 118. White Bean, Kale & Garlic Broth
  {
    id: "whitebean-kale-garlic-soup",
    title: "White Bean, Kale & Garlic Broth",
    description:
      "A simple garlicky broth with white beans, kale, olive oil and plenty of black pepper.",
    imageUrl: "/images/recipes/whitebean-kale-garlic-soup.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["low-waste", "veg-heavy"],
    ingredients: ["White beans", "Kale", "Garlic", "Lemon", "Vegetable Stock"],
    matchedProducts: ["Bold Bean Co Queen White Beans", "Vegetable Stock"],
    steps: [
      "Soften onion and sliced garlic gently in olive oil until sweet and fragrant.",
      "Add white beans and vegetable stock, then simmer until rounded.",
      "Stir through kale until tender but still green.",
      "Finish with black pepper, lemon and a final drizzle of olive oil.",
    ],
  },

  // 119. Pea, Lemon & Risotto Rice Soup
  {
    id: "pea-lemon-risotto-soup",
    title: "Pea, Lemon & Risotto Rice Soup",
    description:
      "A bright green pea soup with risotto rice, lemon, herbs and a silky stock base.",
    imageUrl: "/images/recipes/pea-lemon-risotto-soup.jpg",
    mood: "quick",
    eatingStyle: "veg",
    focusTags: ["family-friendly", "veg-heavy"],
    ingredients: ["Peas", "Risotto rice", "Lemon", "Mint", "Vegetable Stock"],
    matchedProducts: ["risotto rice", "Vegetable Stock"],
    steps: [
      "Soften onion gently in olive oil, then stir in risotto rice and vegetable stock.",
      "Simmer until the rice is tender and the soup has thickened slightly.",
      "Add peas for the final few minutes so they stay sweet and green.",
      "Finish with lemon zest, herbs and black pepper.",
    ],
  },
];
