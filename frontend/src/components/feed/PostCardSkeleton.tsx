import Skeleton from "../Skeleton";

const PostCardSkeleton = () => {
  return (
    <div className="card" aria-hidden="true">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-4 flex gap-3 border-t border-gray-300 pt-3 dark:border-slate-800">
        <Skeleton className="h-7 w-12 rounded-md" />
        <Skeleton className="h-7 w-12 rounded-md" />
      </div>
    </div>
  );
};

export default PostCardSkeleton;
