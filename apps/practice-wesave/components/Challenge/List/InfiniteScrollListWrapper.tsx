import { useState, useEffect, useRef, ReactNode } from 'react';

interface InfiniteScrollListWrapperProps {
  children: ReactNode;
  fetchMoreData: Function;
  hasMore: boolean;
}

export default function InfiniteScrollListWrapper({
  children,
  fetchMoreData,
  hasMore,
}: InfiniteScrollListWrapperProps) {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });

    if (observerRef?.current) observer.observe(observerRef?.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (isIntersecting && hasMore) {
      fetchMoreData();
    }
  }, [isIntersecting, hasMore, fetchMoreData]);

  return (
    <>
      {children}
      <div ref={observerRef} />
    </>
  );
}
