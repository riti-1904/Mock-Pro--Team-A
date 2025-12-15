import worldlineLogo from "figma:asset/1d306153bd547b87e420dd553c1ce1c21ef98e84.png";

export function WorldlineLogo({ className = "h-8" }: { className?: string }) {
  return (
    <img 
      src={worldlineLogo} 
      alt="Worldline" 
      className={className}
    />
  );
}