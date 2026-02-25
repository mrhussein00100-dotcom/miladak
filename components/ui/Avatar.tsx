import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

const sizeStyles = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  default: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

export function Avatar({ 
  src, 
  alt = 'Avatar', 
  fallback,
  size = 'default',
  status,
  className 
}: AvatarProps) {
  const initials = fallback?.slice(0, 2).toUpperCase() || '؟';

  return (
    <div className={cn('relative inline-block', className)}>
      <div className={cn(
        'rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center',
        sizeStyles[size]
      )}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-white font-medium">{initials}</span>
        )}
      </div>
      {status && (
        <span className={cn(
          'absolute bottom-0 left-0 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900',
          statusColors[status]
        )} />
      )}
    </div>
  );
}
