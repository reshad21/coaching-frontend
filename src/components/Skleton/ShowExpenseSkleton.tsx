const ShowExpenseSkleton = () => {
  return (
    <div className="w-full h-[450px] animate-pulse space-y-4">
      <div className="h-6 bg-gray-300 rounded w-1/3"></div>
      <div className="grid grid-cols-6 gap-4 h-full">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-end space-y-2"
          >
            <div className="w-10 bg-gray-300 rounded h-[60%]"></div>
            <div className="w-10 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowExpenseSkleton;
