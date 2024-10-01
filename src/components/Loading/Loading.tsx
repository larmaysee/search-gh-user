import { Loader } from "lucide-react";
export default function Loading() {
  return (
    <div className="flex justify-center items-center h-[100px] gap-2">
      <Loader className="animate-spin" />
      <p>Loading...</p>
    </div>
  );
}
