interface ReferenceFooterProps {
  gtin?: string | null;
}

export function ReferenceFooter({ gtin }: ReferenceFooterProps) {
  if (!gtin) return null;

  return (
    <div className="mt-8 border-t border-line pt-4">
      <p className="text-center font-mono text-[11px] text-ink/30">GTIN {gtin}</p>
    </div>
  );
}