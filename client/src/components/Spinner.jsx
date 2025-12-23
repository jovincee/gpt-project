export function Spinner() {
  return (
    <div className="relative w-12 h-12">
      <div
        className="
        w-12 h-12
        rounded-full
        border-4
        border-gray-300 dark:border-gray-700
        border-t-blue-500
        animate-spin
        "
      />
    </div>
  );
}