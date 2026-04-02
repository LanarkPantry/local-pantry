import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import RecipeShopPanel from "../../components/RecipeShopPanel";
import { recipes } from "../recipes-data";

type RecipeDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipeDetailPage({
  params,
}: RecipeDetailPageProps) {
  const { slug } = await params;

  const recipe = recipes.find((entry) => entry.slug === slug);

  if (!recipe) {
    notFound();
  }

  const relatedRecipes = recipes
    .filter((entry) => entry.slug !== recipe.slug)
    .slice(0, 3);

  return (
    <main className="min-h-screen bg-[#f4efe9] text-[#243328]">
      <section className="border-b border-[#e6ddd2] px-4 pb-10 pt-10 sm:px-6 md:px-10 md:pb-14 md:pt-14">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/recipes"
            className="text-sm text-[#5f675c] underline underline-offset-4 transition hover:text-[#243328]"
          >
            ← Back to recipes
          </Link>

          <div className="mt-6 max-w-3xl">
            <p className="text-sm uppercase tracking-[0.16em] text-[#6b776c]">
              {recipe.pantryLabel}
            </p>

            <h1 className="mt-3 font-serif text-4xl leading-tight md:text-6xl">
              {recipe.title}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#5f675c] md:text-lg">
              {recipe.intro}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1 text-sm text-[#5f675c]">
                {recipe.time}
              </span>

              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#ddd4c8] bg-white px-3 py-1 text-sm text-[#5f675c]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 md:px-10 md:py-14">
        <div className="mx-auto grid max-w-7xl items-start gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="min-w-0">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[28px] border border-[#ddd4c8] bg-[#ede5da]">
              <Image
                src={recipe.image}
                alt={recipe.alt}
                fill
                sizes="(max-width: 1023px) 100vw, 60vw"
                className="object-cover"
                loading="eager"
              />
            </div>

            <div className="mt-6 rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-6 md:p-8">
              <h2 className="font-serif text-3xl">How to make it</h2>
              <p className="mt-4 text-base leading-8 text-[#5f675c]">
                {recipe.body}
              </p>

              <div className="mt-8 rounded-2xl border border-[#ddd4c8] bg-white p-5">
                <p className="text-sm font-medium text-[#243328]">
                  A flexible way to build it out
                </p>
                <p className="mt-2 text-sm leading-7 text-[#5f675c]">
                  Use the pantry item as the anchor, then add one or two of the
                  suggested extras if you want to make it more substantial.
                </p>
              </div>
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-8">
            <div className="rounded-[28px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 md:p-6">
              <RecipeShopPanel recipe={recipe} />
            </div>
          </aside>
        </div>
      </section>

      <section className="border-t border-[#e6ddd2] px-4 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#6b776c]">
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
                className="block rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] p-5 transition hover:shadow-[0_12px_30px_rgba(36,51,40,0.06)]"
              >
                <p className="text-sm uppercase tracking-[0.14em] text-[#6b776c]">
                  {entry.time}
                </p>
                <h3 className="mt-2 font-serif text-2xl">{entry.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5f675c]">
                  {entry.intro}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
