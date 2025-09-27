import { AlertCircle } from 'lucide-react';

const Error = () => {
    return (
        <div className="flex flex-col items-center gap-3 text-red-500 dark:text-red-400">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
                <AlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center">
                <p className="font-medium">Error loading income data</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please try again later</p>
            </div>
        </div>
    );
};

export default Error;