import React, { useRef, useEffect, ReactNode } from 'react';

interface InfiniteScrollProps {
  fetchNextPage: Function;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  children: ReactNode;
}

export default function InfiniteScroller({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  children,
}: InfiniteScrollProps) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }, options);

    const target = observerRef && observerRef.current;

    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div>
      {children}
      {hasNextPage && <div style={{ height: 50 }} ref={observerRef}></div>}
    </div>
  );
}
