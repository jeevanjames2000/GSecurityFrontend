import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  clearState,
  searchState,
  fetchDataBySearchQuery,
  fetchProfile,
} from "../store/slices/homeSlice";
const useSearch = () => {
  const dispatch = useDispatch();
  const { isLoading, cardData, cardType, searchStore, profile } = useSelector(
    (state) => state.home
  );
  const search = useSelector((state) => state.home.searchStore);
  const setSearch = (value) => {
    dispatch(searchState(value));
  };
  const [isSearchTriggered, setIsSearchTriggered] = useState(false);
  const handleSearch = async () => {
    dispatch(clearState());
    setIsSearchTriggered(true);
    dispatch(searchState(search));
    const searchPrefix = search.toLowerCase().charAt(0);
    if (searchPrefix === "vm" || searchPrefix === "gp") {
      await dispatch(fetchDataBySearchQuery(search));
    } else {
      await dispatch(fetchProfile(search));
    }
    dispatch(fetchDataBySearchQuery(search));
  };
  const handleRefresh = () => {
    dispatch(fetchDataBySearchQuery(searchStore));
  };
  const handleClear = () => {
    setSearch("");
    dispatch(searchState());
    setIsSearchTriggered(false);
  };
  return {
    search,
    setSearch,
    isSearchTriggered,
    handleSearch,
    handleClear,
    handleRefresh,
    isLoading,
    cardData,
    cardType,
    profile,
  };
};
export default useSearch;
