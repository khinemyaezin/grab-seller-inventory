import type { FieldError, FieldErrors } from "react-hook-form";

export function collectFormErrors(
  errors?: FieldErrors,
  parentKey = ""
): Record<string, string> {
  if (!errors || typeof errors !== "object") {
    return {};
  }

  const result: Record<string, string> = {};

  if (Array.isArray(errors)) {
    const arrayMessage = (errors as unknown as { message?: string }).message;
    if (typeof arrayMessage === "string" && arrayMessage && parentKey) {
      result[parentKey] = arrayMessage;
    }
    errors.forEach((item, index) => {
      if (!item) return;
      const childKey = parentKey ? `${parentKey}.${index}` : `${index}`;
      Object.assign(result, collectFormErrors(item, childKey));
    });
  } else {
    for (const [key, value] of Object.entries(errors)) {
      if (!value) continue;

      if (key === "ref" || key === "types") continue;

      if (key === "root") {
        const rootErr = value as FieldError;
        if (
          rootErr &&
          typeof rootErr === "object" &&
          typeof rootErr.message === "string" &&
          rootErr.message
        ) {
          const targetKey = parentKey || "root";
          result[targetKey] = rootErr.message;
        }
        continue;
      }

      const childKey = parentKey ? `${parentKey}.${key}` : key;

      if (typeof value === "object") {
        const fieldError = value as FieldError;
        if (typeof fieldError.message === "string" && fieldError.message) {
          result[childKey] = fieldError.message;
        }

        const nested = collectFormErrors(value as FieldErrors, childKey);
        Object.assign(result, nested);
      }
    }
  }

  return result;
}
