"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCart } from "../cart-context";
import type { Recipe, RecipeProduct } from "../recipes/recipes-data";

type RecipeShopPanelProps = {
  recipe: Recipe;
};

export default function RecipeShopPanel({ recipe }: RecipeShopPanelProps) {
  const { groupedCart, addToCart, addManyToCart, removeOneFromCart } =
    useCart();

  const quantityByName = useMemo(() => {
    return groupedCart.reduce<Record<string, number>>((acc, entry) => {
      acc[entry.item.name] = entry.quantity;
      return acc;
    }, {});
  }, [groupedCart]);

  const getQuantity = (itemName: string) => quantityByName[itemName] ?? 0;

  const addRecipeProductToCart = (product: RecipeProduct) => {
    addToCart({
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const addRecipeBundleToCart = () => {
    const bundleItems = [recipe.product, ...recipe.companionItems];

    addManyToCart(
      bundleItems.map((item) => ({
        name: item.name,
        price: item.price,
        image: item.image,
      })),
    );
  };

  const bundleItems = [recipe.product, ...recipe.companionItems];
  const bundleItemCountInCart = bundleItems.filter(
    (item) => getQuantity(item.name) > 0,
  ).length;

  const allBundleItemsAlreadyAdded =
    bundleItemCountInCart === bundleItems.length && bundleItems.length > 0;

  const quantity = getQuantity(recipe.product.name);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-[#ddd4c8] bg-white p-5">
        <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
          Pantry item used here
        </p>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-base font-medium text-[#243328]">
              {recipe.product.name}
            </p>
            <p className="mt-1 text-sm text-[#5f675c]">
              £{recipe.product.price.toFixed(2)}
            </p>
          </div>

          <Link
            href={recipe.shopAnchor}
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            View in shop
          </Link>
        </div>

        <div className="mt-4 flex flex-col gap-3">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={() => addRecipeProductToCart(recipe.product)}
              className="inline-flex items-center justify-center self-start rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              Add {recipe.product.name}
            </button>
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <div className="inline-flex items-center self-start rounded-full border border-[#d8d0c4] bg-white">
                <button
                  type="button"
                  onClick={() => removeOneFromCart(recipe.product.name)}
                  aria-label={`Decrease quantity of ${recipe.product.name}`}
                  className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  −
                </button>

                <span className="min-w-[2.2rem] text-center text-sm font-medium text-[#243328]">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => addRecipeProductToCart(recipe.product)}
                  aria-label={`Increase quantity of ${recipe.product.name}`}
                  className="px-4 py-2 text-lg text-[#243328] transition hover:bg-[#f4efe9]"
                >
                  +
                </button>
              </div>

              <span className="text-sm text-[#5f675c]">
                Already in your basket
              </span>
            </div>
          )}

          {quantity > 0 && (
            <Link
              href="/basket"
              className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
            >
              Review in basket
            </Link>
          )}
        </div>
      </div>

      {recipe.companionItems.length > 0 && (
        <div className="rounded-2xl border border-[#ddd4c8] bg-[#f3ede4] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
            Works well with
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {bundleItems.map((item) => {
              const quantityInCart = getQuantity(item.name);

              return (
                <span
                  key={item.name}
                  className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1 text-sm text-[#5f675c]"
                >
                  {item.name}
                  {quantityInCart > 0 ? ` (${quantityInCart} in basket)` : ""}
                </span>
              );
            })}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <button
              type="button"
              onClick={addRecipeBundleToCart}
              className="inline-flex items-center justify-center self-start rounded-full border border-[#d6cec2] bg-white px-5 py-3 text-sm font-medium text-[#243328] transition hover:bg-[#faf7f2]"
            >
              Add all ingredients
            </button>

            {allBundleItemsAlreadyAdded ? (
              <p className="text-sm leading-6 text-[#5f675c]">
                You already have each of these in your basket.
              </p>
            ) : bundleItemCountInCart > 0 ? (
              <p className="text-sm leading-6 text-[#5f675c]">
                You already have {bundleItemCountInCart} of {bundleItems.length}{" "}
                suggested item
                {bundleItems.length === 1 ? "" : "s"} in your basket.
              </p>
            ) : (
              <p className="text-sm leading-6 text-[#5f675c]">
                A simple bundle if you want to build the meal out a little.
              </p>
            )}
          </div>
        </div>
      )}

      <div>
        <Link
          href={recipe.shopAnchor}
          className="inline-flex rounded-full border border-[#d6cec2] bg-white px-4 py-2 text-sm text-[#243328] shadow-sm transition hover:bg-[#faf7f2]"
        >
          {recipe.shopLabel}
        </Link>
      </div>
    </div>
  );
}
