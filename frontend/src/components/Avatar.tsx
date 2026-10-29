import { useState } from "react";
import Image from "next/image";
import Skeleton from "./Skeleton";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
}

const Avatar = ({ src, name, size = 40 }: AvatarProps) => {
  const [isLoaded, setIsLoaded] = useState(false);

  if (!src) {
    return (
      <div style={{ width: size, height: size }} className="shrink-0">
        <Skeleton className="h-full w-full rounded-full" />
      </div>
    );
  }

  return (
    <Image
      className={`shrink-0 rounded-full object-cover ring-2 ring-blue-600 dark:ring-1 dark:ring-slate-700 ${
        isLoaded ? "" : "animate-pulse bg-gray-300 dark:bg-slate-800"
      }`}
      width={size}
      height={size}
      src={src}
      alt={`${name ?? "User"}'s avatar`}
      onLoad={() => setIsLoaded(true)}
    />
  );
};

export default Avatar;
