import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "../recipes/recipes-data";

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-[#ddd4c8] bg-[#f7f2eb] transition hover:shadow-[0_12px_30px_rgba(36,51,40,0.06)]">
      <Link href={`/recipes/${recipe.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#ede5da]">
          <Image
            src={recipe.image}
            alt={recipe.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
            className="object-cover transition duration-300 hover:scale-[1.02]"
          />
        </div>

        <div className="p-6 md:p-7">
          <p className="text-xs uppercase tracking-[0.16em] text-[#6b776c]">
            {recipe.pantryLabel}
          </p>

          <h2 className="mt-3 font-serif text-3xl leading-tight">
            {recipe.title}
          </h2>

          <p className="mt-3 text-base leading-7 text-[#445247]">
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

          <div className="mt-6 inline-flex rounded-full bg-[#2f4635] px-5 py-3 text-sm font-medium text-white">
            View recipe
          </div>
        </div>
      </Link>
    </article>
  );
}
