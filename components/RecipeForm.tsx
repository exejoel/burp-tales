"use client";

import { useActionState } from "react";
import IngredientEditor from "@/components/IngredientEditors";
import type { RecipeFormState } from "@/app/recipes/actions";

// Same shape and format as the database: ingredients is one
// newline-separated string, so both pages can pass data straight through.
export type RecipeFormValues = {
  title: string;
  ingredients: string;
  steps: string;
  sourceUrl: string;
  imageUrl: string;
};

const emptyValues: RecipeFormValues = {
  title: "",
  ingredients: "",
  steps: "",
  sourceUrl: "",
  imageUrl: "",
};

const initialState: RecipeFormState = {};

type RecipeFormProps = {
  action: (
    prevState: RecipeFormState,
    formData: FormData
  ) => Promise<RecipeFormState>;
  // Read only when the form first mounts. To load different values,
  // the parent changes this component's `key` (same pattern as the editor).
  initialValues?: RecipeFormValues;
  submitLabel: string;
  pendingLabel: string;
};

function splitIngredients(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function RecipeForm({
  action,
  initialValues = emptyValues,
  submitLabel,
  pendingLabel,
}: RecipeFormProps) {
  // state: whatever the action last returned ({} until the first submit).
  // formAction: goes on <form action>, so React passes `state` in as prevState.
  // isPending: true while the action runs, so no separate useFormStatus button.
  const [state, formAction, isPending] = useActionState(action, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={formAction} noValidate className="space-y-8">
      <input type="hidden" name="sourceUrl" value={initialValues.sourceUrl} />
      <input type="hidden" name="imageUrl" value={initialValues.imageUrl} />

      {state.formError && (
        <p role="alert" className="rounded-md border border-danger p-3 text-sm text-danger">
          {state.formError}
        </p>
      )}

      <div>
        <label htmlFor="title" className="label">
          Title
        </label>
        {/* After a form action finishes, React 19 resets uncontrolled fields
            to their defaultValue. Using the submitted value as the default
            means an error doesn't wipe out what the user typed. */}
        <input
          id="title"
          name="title"
          defaultValue={state.values?.title ?? initialValues.title}
          aria-invalid={errors.title ? true : undefined}
          aria-describedby={errors.title ? "title-error" : undefined}
          className="field font-display text-2xl"
        />
        {errors.title && (
          <p id="title-error" className="field-error">
            {errors.title}
          </p>
        )}
      </div>

      {/* The editor keeps its own state, so the reset doesn't touch it. */}
      <div>
        <IngredientEditor
          initialIngredients={splitIngredients(initialValues.ingredients)}
        />
        {errors.ingredients && (
          <p role="alert" className="field-error">
            {errors.ingredients}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="steps" className="label">
          Steps
        </label>
        <textarea
          id="steps"
          name="steps"
          rows={8}
          defaultValue={state.values?.steps ?? initialValues.steps}
          placeholder="One step per line"
          aria-invalid={errors.steps ? true : undefined}
          aria-describedby={errors.steps ? "steps-error" : undefined}
          className="field leading-relaxed"
        />
        {errors.steps && (
          <p id="steps-error" className="field-error">
            {errors.steps}
          </p>
        )}
      </div>

      <div className="border-t border-rule pt-6">
        <button type="submit" disabled={isPending} className="btn-primary">
          {isPending ? pendingLabel : submitLabel}
        </button>
      </div>
    </form>
  );
}
