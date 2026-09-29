// Next wraps this folder's page in <Suspense> and uses this as the
// fallback. It's the nearest loading.tsx for /recipes/[id]/edit too.
export default function RecipeDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 py-14" role="status">
      <span className="sr-only">Loading recipe</span>
      <div className="skeleton h-4 w-24" />

      <div className="mt-10 mb-12 flex flex-col items-center gap-6">
        <div className="skeleton h-12 w-2/3" />
        <div className="flex gap-2">
          <div className="skeleton h-8 w-16 rounded-full" />
          <div className="skeleton h-8 w-20 rounded-full" />
        </div>
      </div>

      <div className="skeleton h-6 w-32 mb-4" />
      <div className="space-y-3 mb-12">
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-full" />
      </div>

      <div className="skeleton h-6 w-20 mb-4" />
      <div className="space-y-3">
        <div className="skeleton h-5 w-full" />
        <div className="skeleton h-5 w-5/6" />
      </div>
    </main>
  );
}
