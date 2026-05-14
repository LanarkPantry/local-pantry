import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import RecipeShopPanel from "../../components/RecipeShopPanel";
import { recipes } from "../recipes-data";

type RecipeDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function getRelatedRecipes(currentSlug: string, category: string) {
  const sameCategory = recipes.filter(
    (recipe) => recipe.slug !== currentSlug && recipe.category === category,
  );

  const otherRecipes = recipes.filter(
    (recipe) => recipe.slug !== currentSlug && recipe.category !== category,
  );

  return [...sameCategory, ...otherRecipes].slice(0, 3);
}

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { slug } = await params;

  const recipe = recipes.find((entry) => entry.slug === slug);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = getRelatedRecipes(recipe.slug, recipe.category);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[#e6ddd2] px-4 pb-8 pt-8 sm:px-6 md:px-10 md:pb-12 md:pt-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/recipes"
              className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
            >
              ← Back to recipes
            </Link>

            <nav className="flex flex-wrap items-center gap-4 text-sm text-[#5f675c]">
              <Link href="/shop" className="transition hover:text-[#243328]">
                Shop
              </Link>
              <Link href="/planner" className="transition hover:text-[#243328]">
                Planner
              </Link>
              <Link href="/basket" className="transition hover:text-[#243328]">
                Basket
              </Link>
            </nav>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-end">
            <div className="max-w-3xl">
              <p className="text-xs uppercase tracking-[0.2em] text-[#6b776c]">
                {recipe.pantryLabel}
              </p>

              <h1 className="mt-3 font-serif text-4xl leading-[1.02] tracking-tight md:text-6xl">
                {recipe.title}
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f675c] md:text-lg">
                {recipe.intro}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-sm text-[#5f675c]">
                  {recipe.time}
                </span>

                {recipe.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-[#ddd4c8] bg-white/80 px-3 py-1.5 text-sm text-[#5f675c]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-[30px] border border-[#ddd4c8] bg-[#ede5da] shadow-[0_18px_48px_rgba(36,51,40,0.1)]">
              <Image
                src={recipe.image}
                alt={recipe.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 48vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <article className="min-w-0 space-y-6">
            <div className="rounded-[28px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.86)] p-6 shadow-[0_10px_24px_rgba(36,51,40,0.04)] md:p-8">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                How to make it
              </p>

              <h2 className="mt-2 font-serif text-3xl md:text-4xl">
                A simple way to cook it
              </h2>

              <p className="mt-5 text-base leading-8 text-[#5f675c]">
                {recipe.body}
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Start with the anchor
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Let {recipe.product.name} lead the flavour, then keep the rest
                  simple.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Add something substantial
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Beans, grains, pasta, potatoes or greens can turn it into a
                  proper meal.
                </p>
              </div>

              <div className="rounded-[24px] border border-[#ddd4c8] bg-[rgba(255,255,255,0.72)] p-5">
                <p className="text-sm font-medium text-[#243328]">
                  Finish with contrast
                </p>
                <p className="mt-2 text-sm leading-6 text-[#5f675c]">
                  Herbs, lemon, yoghurt, nuts or olive oil make the plate feel
                  more complete.
                </p>
              </div>
            </div>
          </article>

          <aside className="min-w-0 lg:sticky lg:top-8">
            <div className="rounded-[28px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.9)] p-5 shadow-[0_10px_24px_rgba(36,51,40,0.05)] md:p-6">
              <RecipeShopPanel recipe={recipe} />
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#6b776c]">
                More ideas
              </p>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                You might also like
              </h2>
            </div>

            <Link
              href="/recipes"
              className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
            >
              Browse all recipes
            </Link>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedRecipes.map((entry) => (
              <Link
                key={entry.slug}
                href={`/recipes/${entry.slug}`}
                className="group overflow-hidden rounded-[26px] border border-[#ddd4c8] bg-[rgba(247,242,235,0.88)] transition hover:shadow-[0_14px_34px_rgba(36,51,40,0.08)]"
              >
                <div className="relative aspect-[4/3] bg-[#ede5da]">
                  <Image
                    src={entry.image}
                    alt={entry.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-[#6b776c]">
                    {entry.time}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl leading-tight">
                    {entry.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                    {entry.intro}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
