import Image from "next/image";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: number;
}

const Avatar = ({ src, name, size = 40 }: AvatarProps) => {
  return (
    <Image
      className="shrink-0 rounded-full object-cover ring-2 ring-blue-600 dark:ring-1 dark:ring-slate-700"
      width={size}
      height={size}
      src={src || "/avatars/avatar1.jpg"}
      alt={`${name ?? "User"}'s avatar`}
    />
  );
};

export default Avatar;
