import { Loader2 } from "lucide-react";
const Loading = () => {
    return (
        <div className="flex flex-col items-center gap-3 text-gray-500 dark:text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-[#ff4c30]" />
            <p className="text-sm font-medium">Loading data...</p>
        </div>
    );
};

export default Loading;