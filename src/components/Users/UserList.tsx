import useUpdateSearchParam from "@/hooks/use-updateSearchParam";
import { useEffect, useState } from "react";
import Loading from "../Loading/Loading";
import NotFound from "../NotFound/NotFound";

export type User = {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
};

type UserListProps = {
  users: User[] | null;
  loading: boolean;
  setSelectedLogin: (login: string) => void;
};

export default function UserList({
  users,
  setSelectedLogin,
  loading,
}: UserListProps) {
  const [activeUser, setActiveUser] = useState("");
  const updateSearchParam = useUpdateSearchParam();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const login = searchParams.get("login");
    if (login) {
      setActiveUser(login);
      setSelectedLogin(login);
    }
  }, [setSelectedLogin]);

  const handleUserClick = (login: string) => {
    setActiveUser(login);
    setSelectedLogin(login);
    updateSearchParam("login", login);
  };

  if (loading) return <Loading />;

  return (
    <>
      <div className="flex flex-col gap-2 mx-auto w-[767px]">
        {users == null && (
          <NotFound title="Search for a user" description="Try searching" />
        )}

        {users && users.length === 0 && (
          <NotFound title="No users found" description="Try another search" />
        )}

        {users && users.length > 0 && (
          <>
            <h3 className="font-bold text-lg">Users</h3>
            <div className="overflow-x-auto min-w-full pb-4">
              <div className="flex flex-wrap gap-2 ">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={
                      "flex flex-col items-center rounded-lg w-[100px] gap-2 p-2" +
                      (activeUser === user.login ? " shadow-lg border" : "")
                    }
                    onClick={() => handleUserClick(user.login)}
                  >
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="rounded-lg"
                    />
                    <div className="flex flex-col items-center">
                      <h1 className="font-normal text-sm">{user.name}</h1>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
