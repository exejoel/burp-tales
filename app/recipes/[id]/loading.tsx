// Next wraps this folder's page in <Suspense> and uses this as the
// fallback. It's the nearest loading.tsx for /recipes/[id]/edit too.
const block = "bg-gray-400/20 rounded-md animate-pulse motion-reduce:animate-none";

export default function RecipeDetailLoading() {
  return (
    <main className="max-w-2xl mx-auto p-8" role="status">
      <span className="sr-only">Loading recipe</span>
      <div className={`${block} h-4 w-28`} />
      <div className={`${block} h-8 w-2/3 mt-3 mb-6`} />

      <div className={`${block} h-5 w-24 mb-3`} />
      <div className="space-y-2 mb-6">
        <div className={`${block} h-4 w-40`} />
        <div className={`${block} h-4 w-32`} />
        <div className={`${block} h-4 w-36`} />
      </div>

      <div className={`${block} h-5 w-16 mb-3`} />
      <div className="space-y-2">
        <div className={`${block} h-4 w-full`} />
        <div className={`${block} h-4 w-5/6`} />
      </div>
    </main>
  );
}
