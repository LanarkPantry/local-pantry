import Link from "next/link";
import Image from "next/image";
import type { Recipe } from "../recipes/recipes-data";

type RecipeCardProps = {
  recipe: Recipe;
};

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link href={`/recipes/${recipe.slug}`} className="group block">
      <div className="overflow-hidden rounded-[18px] border border-[#ddd4c8] bg-[#f7f2eb] transition hover:shadow-[0_10px_24px_rgba(36,51,40,0.06)]">
        {/* Image */}
        <div className="relative aspect-[4/2.6] w-full overflow-hidden bg-[#ede5da]">
          <Image
            src={recipe.image}
            alt={recipe.alt}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1199px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
        </div>

        {/* Content */}
        <div className="p-4 md:p-5">
          {/* Label */}
          <p className="text-[10px] uppercase tracking-[0.14em] text-[#6b776c]">
            {recipe.pantryLabel}
          </p>

          {/* Title */}
          <h2 className="mt-2 font-serif text-xl leading-tight md:text-2xl">
            {recipe.title}
          </h2>

          {/* Intro */}
          <p className="mt-2 text-sm leading-6 text-[#5f675c] line-clamp-2">
            {recipe.intro}
          </p>

          {/* Meta */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-[#ddd4c8] bg-white px-2.5 py-1 text-xs text-[#5f675c]">
              {recipe.time}
            </span>

            {recipe.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#ddd4c8] bg-white px-2.5 py-1 text-xs text-[#5f675c]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-4 text-sm font-medium text-[#243328] underline underline-offset-4">
            View recipe →
          </div>
        </div>
      </div>
    </Link>
  );
}
