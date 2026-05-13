export function TagBadge({ type }: { type: string }) {
  if (type === 'must') {
    return (
      <span className="inline-flex items-center justify-center rounded px-2 py-0.5 text-[11px] font-medium leading-[14px] bg-success text-white ml-2 align-middle">
        Must-have
      </span>
    );
  }
  if (type === 'deal-breaker') {
    return (
      <span className="inline-flex items-center justify-center rounded px-2 py-0.5 text-[11px] font-medium leading-[14px] bg-danger text-white ml-2 align-middle">
        Deal-breaker
      </span>
    );
  }
  return null;
}
