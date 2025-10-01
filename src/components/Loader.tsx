import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

const Loader = ({ size = 'md', text }: LoaderProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-accent`} />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default Loader;
