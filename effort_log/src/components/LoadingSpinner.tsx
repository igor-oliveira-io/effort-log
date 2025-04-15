export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-[300px]">
      <div className="w-10 h-10 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );
}
