const LoadingSpinner = () => {
  return (
    <div className="flex justify-center py-6">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent dark:border-emerald-400 dark:border-t-transparent" />
    </div>
  );
};

export default LoadingSpinner;
