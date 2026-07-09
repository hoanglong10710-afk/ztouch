import type { Page } from "@playwright/test";

// Clicks "Lưu thay đổi" and waits for the resulting alert() dialog before
// returning, so callers can rely on the Server Action's write having actually
// completed (a bare `.click()` resolves once the click event dispatches, not
// once the awaited Server Action inside the handler finishes).
export async function saveAndConfirm(page: Page): Promise<void> {
  const [dialog] = await Promise.all([
    page.waitForEvent("dialog"),
    page.getByRole("button", { name: /Lưu thay đổi/ }).click(),
  ]);
  await dialog.accept();
}
