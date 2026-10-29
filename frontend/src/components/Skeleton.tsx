const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse rounded bg-gray-300 dark:bg-slate-800 ${className}`} />
  );
};

export default Skeleton;
