import { useCallback } from "react";

const useUpdateSearchParam = () => {
  const updateSearchParam = useCallback((param: string, value: string) => {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    if (value) {
      searchParams.set(param, value); // Add or update the param
    } else {
      searchParams.delete(param); // Remove param if value is empty (optional)
    }

    // Update the URL in the browser without reloading the page
    url.search = searchParams.toString();
    window.history.replaceState(null, "", url.toString());
  }, []);

  return updateSearchParam;
};

export default useUpdateSearchParam;
