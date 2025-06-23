
import React, { useState, useRef, useLayoutEffect, cloneElement } from 'react';

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>;
const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" /></svg>;
const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>;

export type NavItem = {
  id: string | number;
  icon: React.ReactElement;
  label?: string;
  onClick?: () => void;
  href?: string;
};

const defaultNavItems: NavItem[] = [
  { id: 'default-home', icon: <DefaultHomeIcon />, label: 'Home' },
  { id: 'default-explore', icon: <DefaultCompassIcon />, label: 'Explore' },
  { id: 'default-notifications', icon: <DefaultBellIcon />, label: 'Notifications' },
];

type VerticalLimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
  showLabels?: boolean;
};

/**
 * A vertical navigation bar with a "limelight" effect that highlights the active item.
 */
export const VerticalLimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  onTabChange,
  className,
  limelightClassName,
  iconContainerClassName,
  iconClassName,
  showLabels = true,
}: VerticalLimelightNavProps) => {
  const [activeIndex, setActiveIndex] = useState(defaultActiveIndex);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    
    if (limelight && activeItem) {
      const newTop = activeItem.offsetTop + activeItem.offsetHeight / 2 - limelight.offsetHeight / 2;
      limelight.style.top = `${newTop}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, items]);

  if (items.length === 0) {
    return null; 
  }

  const handleItemClick = (index: number, item: NavItem) => {
    setActiveIndex(index);
    onTabChange?.(index);
    item.onClick?.();
  };

  return (
    <nav className={`relative flex flex-col gap-1 py-2 ${className}`}>
      {items.map((item, index) => {
        const { id, icon, label, href } = item;
        const isActive = activeIndex === index;
        
        const content = (
          <>
            {cloneElement(icon, {
              className: `w-5 h-5 shrink-0 transition-all duration-200 ${
                isActive ? 'text-blue-700' : 'text-neutral-700 dark:text-neutral-200'
              } ${icon.props.className || ''} ${iconClassName || ''}`,
            })}
            {showLabels && label && (
              <span className={`text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                isActive ? 'text-blue-700' : 'text-neutral-700 dark:text-neutral-200'
              }`}>
                {label}
              </span>
            )}
          </>
        );

        const baseClasses = `relative z-20 flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition-all duration-200 ${iconContainerClassName}`;

        if (href) {
          return (
            <a
              key={id}
              ref={el => (navItemRefs.current[index] = el)}
              href={href}
              className={baseClasses}
              onClick={() => handleItemClick(index, item)}
              aria-label={label}
            >
              {content}
            </a>
          );
        }

        return (
          <div
            key={id}
            ref={el => (navItemRefs.current[index] = el)}
            className={baseClasses}
            onClick={() => handleItemClick(index, item)}
            aria-label={label}
          >
            {content}
          </div>
        );
      })}

      <div 
        ref={limelightRef}
        className={`absolute left-0 z-10 w-1 h-8 rounded-full bg-blue-600 shadow-[5px_0_15px_rgba(29,78,216,0.3)] ${
          isReady ? 'transition-[top] duration-400 ease-in-out' : ''
        } ${limelightClassName}`}
        style={{ top: '-999px' }}
      >
        <div className="absolute left-[4px] top-[-30%] w-12 h-[160%] [clip-path:polygon(0_5%,100%_25%,100%_75%,0_95%)] bg-gradient-to-r from-blue-600/20 to-transparent pointer-events-none" />
      </div>
    </nav>
  );
};

export { VerticalLimelightNav as LimelightNav };
