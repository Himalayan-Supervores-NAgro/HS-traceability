interface ProducerNoteProps {
  producerName: string;
  farmName: string;
  quote?: string | null;
}

export function ProducerNote({ producerName, farmName, quote }: ProducerNoteProps) {
  const line = quote?.trim() || `Grown with care at ${farmName}.`;
  return (
    <div className="relative mt-4 rounded-md border border-line bg-pine-50/40 px-4 py-3">
      <span className="absolute -left-1 -top-3 font-display text-4xl text-marigold-500/50">
        &ldquo;
      </span>
      <p className="font-display text-sm italic leading-relaxed text-ink/80">{line}</p>
      <p className="mt-2 text-xs text-sage">
        — {producerName}, {farmName}
      </p>
    </div>
  );
}