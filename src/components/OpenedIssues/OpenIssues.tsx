// src/components/OpenIssues.tsx
import { GET_ISSUES } from "@/Graphql/Queries/GetIssues";
import { timeAgo } from "@/lib/utils";
import { useQuery } from "@apollo/client";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AddIssueDialog } from "../AddIssue/AddIssue";
import Loading from "../Loading/Loading";
import NotFound from "../NotFound/NotFound";
import Pagination from "../Pagination/Pagination";
import { Repository } from "../Repository/Respository";
import { Button } from "../ui/button";

type Issue = {
  id: string;
  title: string;
  body: string;
  state: string;
  createdAt: string;
  updatedAt: string;
  author: {
    login: string;
  };
};

type IssueProps = {
  owner: string;
  repository: Repository;
  resetSelectedRepo?: () => void;
};

const OpenIssues = ({ owner, repository, resetSelectedRepo }: IssueProps) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    startCursor: null as string | null,
    endCursor: null as string | null,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  useEffect(() => {
    if (owner && repository) {
      setPagination((prev) => ({
        ...prev,
      }));
    }
  }, [owner, repository]);

  const { loading, fetchMore, refetch } = useQuery(GET_ISSUES, {
    variables: {
      owner,
      name: repository.name,
      first: 10,
      state: ["OPEN"],
    },
    onCompleted: (data) => {
      const { nodes, pageInfo, totalCount } = data.repository.issues;
      setIssues(nodes);
      setPagination({
        totalCount: totalCount,
        startCursor: pageInfo.startCursor,
        endCursor: pageInfo.endCursor,
        hasPreviousPage: pageInfo.hasPreviousPage,
        hasNextPage: pageInfo.hasNextPage,
      });
    },
  });

  const handleFetchIssue = useCallback(
    (next: "next" | "previous") => {
      fetchMore({
        variables: {
          owner,
          name: repository.name,
          first: 10,
          last: 10,
          after: next === "next" ? pagination.endCursor : undefined,
          before: next === "previous" ? pagination.startCursor : undefined,
          state: ["OPEN"],
        },
      }).then((fetchMoreResult) => {
        const { nodes, pageInfo, totalCount } =
          fetchMoreResult.data.repository.issues;
        setIssues(nodes);
        setPagination({
          totalCount: totalCount,
          startCursor: pageInfo.startCursor,
          endCursor: pageInfo.endCursor,
          hasPreviousPage: pageInfo.hasPreviousPage,
          hasNextPage: pageInfo.hasNextPage,
        });
      });
    },
    [
      fetchMore,
      owner,
      repository.name,
      pagination.endCursor,
      pagination.startCursor,
    ]
  );

  const refetchIssues = async () => {
    const { data } = await refetch();
    const { nodes, pageInfo, totalCount } = data.repository.issues;
    setIssues(nodes);
    setPagination({
      totalCount: totalCount,
      startCursor: pageInfo.startCursor,
      endCursor: pageInfo.endCursor,
      hasPreviousPage: pageInfo.hasPreviousPage,
      hasNextPage: pageInfo.hasNextPage,
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="w-[767px] mx-auto flex flex-col gap-8">
      <div className="rounded-md flex justify-between items-center">
        <div className="flex gap-3 items-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-lg"
            onClick={resetSelectedRepo}
          >
            <ArrowLeft size={16} />
          </Button>
          <h3 className="text-lg font-bold">{repository.name}</h3>
        </div>

        <p className="text-sm">
          {repository.stargazerCount} Starred / {repository.watchers.totalCount}{" "}
          Watching
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Open Issues</h3>
          <AddIssueDialog
            repositoryId={repository.id}
            refetchIssue={refetchIssues}
          />
        </div>

        {issues.length > 0 ? (
          <>
            <div className="flex flex-col gap-2">
              <ul className="flex flex-col gap-2">
                {issues.map((issue) => (
                  <li
                    key={issue.id}
                    className="px-4 py-2 border rounded-lg border-gray-200 flex items-center justify-between"
                  >
                    <div className="flex flex-col justify-between">
                      <p className="font-bold">{issue.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {issue.body}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 justify-between">
                      <span className="text-sm">
                        {timeAgo(new Date(issue.createdAt)) + " by "}
                      </span>
                      <span className="text-sm font-bold">
                        {issue.author.login}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <Pagination
                pagination={pagination}
                fetchRepositories={handleFetchIssue}
              />
            </div>
          </>
        ) : (
          <>
            <NotFound title="No open issues" description="No issues found" />
          </>
        )}
      </div>
    </div>
  );
};

export default OpenIssues;
