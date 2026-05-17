import { plannerProductMap } from "./planner-product-map";
import { allShopItems } from "../shop/shop-data";

export function getPlannerBasketSuggestions(text: string[]) {
  const matchedNames = new Set<string>();

  text.forEach((entry) => {
    const lower = entry.toLowerCase();

    Object.entries(plannerProductMap).forEach(([keyword, products]) => {
      if (lower.includes(keyword)) {
        products.forEach((product) => matchedNames.add(product));
      }
    });
  });

  return allShopItems.filter((item) => matchedNames.has(item.name));
}
