// src/components/UserSearch.tsx
import useUpdateSearchParam from "@/hooks/use-updateSearchParam";
import { useLazyQuery } from "@apollo/client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { SEARCH_USERS } from "../../Graphql/Queries/SearchUsers";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { User } from "../Users/UserList";

const UserSearch = ({
  setUsers,
  setLoading,
  reset,
}: {
  setUsers: (users: User[] | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}) => {
  const updateSearchParam = useUpdateSearchParam();
  const [query, setQuery] = useState("");
  const [searchUsers, { data, loading }] = useLazyQuery(SEARCH_USERS);
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const search = searchParams.get("search");
    if (search) {
      setQuery(search);
      searchUsers({
        variables: {
          query: search,
          first: 10,
        },
      });
    }

    if (data) {
      setUsers(data.search.nodes);
    }

    setLoading(loading);
  }, [data, loading, searchUsers, setLoading, setUsers]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    reset();

    searchUsers({
      variables: {
        query,
        first: 10,
      },
    });

    updateSearchParam("search", query);

    if (query === "") {
      setUsers(null);
    }
  };

  return (
    <div className="flex flex-col w-[767px] mx-auto">
      <div className="flex justify-center items-center mt-10 mb-10">
        <form onSubmit={handleSearch}>
          <div className="flex gap-2 items-center">
            <Input
              type="text"
              className="text-md min-w-[300px]"
              placeholder="Search users"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            <Button type="submit" size={"sm"} className="gap-2">
              <Search size={16} />
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSearch;
