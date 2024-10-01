import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

type Pagination = {
  startCursor: string | null;
  endCursor: string | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalCount: number;
};
export type PaginationProps = {
  pagination: Pagination;
  fetchRepositories: (next: "next" | "previous") => void;
};

export default function Pagination({
  pagination: { hasNextPage, hasPreviousPage, totalCount },
  fetchRepositories,
}: PaginationProps) {
  const buildPaginationNumber = (total: number) => {
    const pages = Math.ceil(total / 10);
    const pagination = [];
    // if the total number of pages is greater than 20 then show first 5 pages, last 5 pages and ...
    if (pages > 20) {
      pagination.push(
        1,
        2,
        3,
        4,
        5,
        "...",
        pages - 4,
        pages - 3,
        pages - 2,
        pages - 1,
        pages
      );
    } else {
      for (let i = 1; i <= pages; i++) {
        pagination.push(i);
      }
    }

    return (
      <div className="flex gap-2">
        {pagination.map((page, index) => (
          <Button key={index} variant={"outline"} size={"icon"}>
            {page}
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex gap-2 items-center justify-center py-5">
      {hasPreviousPage && (
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => fetchRepositories("previous")}
        >
          <ArrowLeft />
        </Button>
      )}
      {buildPaginationNumber(totalCount)}
      {hasNextPage && (
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={() => fetchRepositories("next")}
        >
          <ArrowRight />
        </Button>
      )}
    </div>
  );
}
