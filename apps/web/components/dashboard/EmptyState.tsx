// No empty-state message existed before this refactor. Rendering nothing here
// keeps output identical to the previous behavior (an empty list renders nothing).
export default function EmptyState() {
  return null;
}
