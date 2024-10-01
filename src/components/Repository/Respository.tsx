// src/components/RepositoryList.tsx
import { useQuery } from "@apollo/client";
import { useCallback, useEffect, useState } from "react";
import { GET_REPOSITORIES } from "../../Graphql/Queries/GetRepositories";
import Loading from "../Loading/Loading";
import NotFound from "../NotFound/NotFound";
import Pagination from "../Pagination/Pagination";

export type Repository = {
  id: string;
  name: string;
  description: string;
  stargazerCount: number;
  watchers: { totalCount: number };
  primaryLanguage: { name: string };
  updatedAt: string;
  url: string;
};

type RepositoryObj = {
  cursor: string;
  node: Repository;
};

type RepositoryListProps = {
  login: string;
  setSelectedRepo: (repository: Repository) => void;
};

const RepositoryList = ({ login, setSelectedRepo }: RepositoryListProps) => {
  const [repositories, setRepositories] = useState<RepositoryObj[]>([]);
  const [pagination, setPagination] = useState({
    totalCount: 0,
    startCursor: null as string | null,
    endCursor: null as string | null,
    hasPreviousPage: false,
    hasNextPage: false,
  });

  useEffect(() => {
    if (login) {
      setPagination((prev) => ({
        ...prev,
      }));
    }
  }, [login]);

  const { loading, fetchMore } = useQuery(GET_REPOSITORIES, {
    skip: !login,
    variables: { login, first: 10, after: null },
    onCompleted: (data) => {
      const { edges, pageInfo, totalCount } = data.user.repositories;

      setRepositories(edges);

      setPagination({
        totalCount: totalCount,
        startCursor: pageInfo.startCursor,
        endCursor: pageInfo.endCursor,
        hasPreviousPage: pageInfo.hasPreviousPage,
        hasNextPage: pageInfo.hasNextPage,
      });
    },
  });

  const handleFetchMore = useCallback(
    (direction: "next" | "previous") => {
      const cursor =
        direction === "next" ? pagination.endCursor : pagination.startCursor;

      console.log("cursor", cursor);

      fetchMore({
        variables: {
          login,
          first: direction === "next" ? 10 : null,
          last: direction === "previous" ? 10 : null,
          after: direction === "next" ? cursor : null,
          before: direction === "previous" ? cursor : null,
        },
      }).then((fetchMoreResult) => {
        const { edges, pageInfo, totalCount } =
          fetchMoreResult.data.user.repositories;

        setRepositories(edges);
        setPagination({
          totalCount: totalCount,
          startCursor: pageInfo.startCursor,
          endCursor: pageInfo.endCursor,
          hasPreviousPage: pageInfo.hasPreviousPage,
          hasNextPage: pageInfo.hasNextPage,
        });
      });
    },
    [fetchMore, login, pagination.endCursor, pagination.startCursor]
  );

  // const fetchRepositories = (next?: string) => {
  //   fetchMore({
  //     variables: {
  //       login,
  //       first: 10,
  //       last: undefined,
  //       after: next,
  //       before: undefined,
  //     },
  //   }).then((fetchMoreResult) => {
  //     console.log("fetchMoreResult", fetchMoreResult);
  //     const { edges, pageInfo } = fetchMoreResult.data.user.repositories;

  //     setRepositories(edges);
  //     setEndCursor(pageInfo.endCursor);
  //     setStartCursor(pageInfo.startCursor);
  //     setHasNextPage(pageInfo.hasNextPage);
  //     setHasPrevious(pageInfo.hasPreviousPage);

  //     updateSearchParam("after", pageInfo.endCursor);
  //     updateSearchParam("before", "");
  //   });
  // };

  // const fetchPreviousRepositories = (previous: string) => {
  //   console.log("previous", previous);

  //   fetchMore({
  //     variables: {
  //       login,
  //       last: 10,
  //       first: undefined,
  //       after: undefined,
  //       before: previous,
  //     },
  //   }).then((fetchMoreResult) => {
  //     console.log("fetchMoreResult", fetchMoreResult);
  //     const { edges, pageInfo } = fetchMoreResult.data.user.repositories;

  //     setRepositories(edges);
  //     setEndCursor(pageInfo.endCursor);
  //     setStartCursor(pageInfo.startCursor);
  //     setHasNextPage(pageInfo.hasNextPage);
  //     setHasPrevious(pageInfo.hasPreviousPage);

  //     updateSearchParam("before", pageInfo.startCursor);
  //     updateSearchParam("after", "");
  //   });
  // };

  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
  };

  if (loading) return <Loading />;

  return (
    <div className="w-[767px] mx-auto flex flex-col gap-2">
      <h2 className="text-lg font-bold">Repositories</h2>

      {repositories.length === 0 && (
        <NotFound
          title="No repositories found"
          description={"Try searching for another user"}
        />
      )}

      {repositories.length > 0 && (
        <div className="flex flex-col gap-2">
          <ul className="flex flex-col gap-2">
            {repositories.map((repo: RepositoryObj) => (
              <li
                className="flex flex-col p-2 border rounded-lg border-gray-200"
                key={repo.node.id}
              >
                <a onClick={() => handleSelectRepo(repo.node)}>
                  <div className="flex justify-between">
                    <p className="font-bold">{repo.node.name}</p>
                    <span>
                      {repo.node.stargazerCount} Starred /{" "}
                      {repo.node.watchers.totalCount} Watching
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ul>

          <Pagination
            pagination={pagination}
            fetchRepositories={handleFetchMore}
          />
        </div>
      )}
    </div>
  );
};

export default RepositoryList;
