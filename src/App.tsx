import { ApolloProvider } from "@apollo/client";
import { useState } from "react";
import "./App.css";
import OpenIssues from "./components/OpenedIssues/OpenIssues";
import RepositoryList, {
  Repository,
} from "./components/Repository/Respository";
import { Toaster } from "./components/ui/toaster";
import UserList, { User } from "./components/Users/UserList";
import UserSearch from "./components/UserSearch/UserSearch";
import useUpdateSearchParam from "./hooks/use-updateSearchParam";
import client from "./lib/apolloClient";

function App() {
  const [users, setUsers] = useState<User[] | null>(null);
  const updateSearchParam = useUpdateSearchParam();
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedLogin, setSelectedLogin] = useState<string>("");
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);

  const reset = () => {
    setSelectedLogin("");
    setSelectedRepo(null);
    updateSearchParam("login", "");
  };

  return (
    <>
      <ApolloProvider client={client}>
        <Toaster />
        <div className="h-screen w-full">
          <UserSearch
            setUsers={setUsers}
            setLoading={setLoading}
            reset={reset}
          />

          {!selectedRepo ? (
            <>
              <UserList
                users={users}
                setSelectedLogin={setSelectedLogin}
                loading={loading}
              />
              {selectedLogin && (
                <RepositoryList
                  login={selectedLogin}
                  setSelectedRepo={setSelectedRepo}
                />
              )}
            </>
          ) : (
            <>
              <OpenIssues
                owner={selectedLogin}
                repository={selectedRepo}
                resetSelectedRepo={() => {
                  setSelectedRepo(null);
                }}
              />
            </>
          )}
        </div>
      </ApolloProvider>
    </>
  );
}

export default App;
