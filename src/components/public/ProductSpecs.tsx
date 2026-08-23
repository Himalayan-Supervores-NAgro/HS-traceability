import { Tag, Boxes } from "lucide-react";

interface ProductSpecsProps {
  category: string;
  weight?: string | null;
  packagingType?: string | null;
  sellingUnit?: string | null;
}

function buildPackagingSentence(
  weight?: string | null,
  packagingType?: string | null
): string | null {
  if (weight && packagingType) {
    return `Packed in ${packagingType.toLowerCase()} of ${weight}`;
  }
  if (packagingType) return `Packed in ${packagingType.toLowerCase()}`;
  if (weight) return `${weight} per pack`;
  return null;
}

export function ProductSpecs({
  category,
  weight,
  packagingType,
  sellingUnit,
}: ProductSpecsProps) {
  const sentence = buildPackagingSentence(weight, packagingType);

  return (
    <div className="mt-5">
      <div className="flex flex-wrap gap-2">
        <span className="badge bg-pine-50 text-pine-700">
          <Tag className="h-3 w-3" /> {category}
        </span>
        {sellingUnit && (
          <span className="badge bg-pine-50 text-pine-700">
            <Boxes className="h-3 w-3" /> {sellingUnit}
          </span>
        )}
      </div>
      {sentence && <p className="mt-2 text-sm text-ink/70">{sentence}</p>}
    </div>
  );
}