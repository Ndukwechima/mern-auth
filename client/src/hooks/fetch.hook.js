import axios from "axios";
import { useEffect, useState } from "react";
import { getUsername } from "../helper/helper";

axios.defaults.baseURL = process.env.REACT_APP_SERVER_DOMAIN;

/** custom hook */
export default function useFetch(query) {
  const [getData, setData] = useState({
    isLoading: false,
    apiData: undefined,
    status: null,
    serverError: null,
  });

  useEffect(() => {
    if (!query) return;

    const fetchData = async () => {
      try {
        setData((prev) => ({ ...prev, isLoading: true }));
        const { username } = !query ? await getUsername() : "";

        const { data, status } = !query
          ? await axios.get(`/api/user/${username}`)
          : await axios.get(`/api/${query}`);

        // Log the full response to check the data and status
        console.log("Response:", { data, status });

        if (status === 200 || status === 201) {
          setData({
            isLoading: false,
            apiData: data, // Directly update the apiData here
            status: status,
            serverError: null,
          });
        }
      } catch (error) {
        console.error(
          "Error fetching API:",
          error.response ? error.response.data : error.message
        );
        setData({
          isLoading: false,
          apiData: undefined,
          status: null,
          serverError: error.message,
        });
      }
    };

    fetchData();
  }, [query]);

  return [getData, setData];
}
