import Image from "next/image";

interface ResponsiveImageProps {
  desktop: string;
  mobile?: string;
  alt: string;
  className?: string;
}

export default function ResponsiveImage({ desktop, mobile, alt, className = "" }: ResponsiveImageProps) {
  return (
    <picture className={className}>
      {mobile && (
        <source media="(max-width: 1023px)" srcSet={mobile} />
      )}
      <Image src={desktop} alt={alt} fill className="object-cover object-top" priority />
    </picture>
  );
}
