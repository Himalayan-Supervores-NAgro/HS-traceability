interface ReferenceFooterProps {
  gtin?: string | null;
  internalRef?: string | null;
}

export function ReferenceFooter({ gtin, internalRef }: ReferenceFooterProps) {
  if (!gtin && !internalRef) return null;

  return (
    <div className="mt-8 border-t border-line pt-4">
      <p className="text-center font-mono text-[11px] text-ink/30">
        {gtin ? `GTIN ${gtin}` : `Ref ${internalRef}`}
      </p>
    </div>
  );
}