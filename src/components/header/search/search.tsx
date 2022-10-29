import styles from './search.module.scss';
import { useRef, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { Search } from 'react-feather';
import { useAppDispatch, useAppSelector } from 'core/hooks';
import {
  selectSearch,
  setSearchQuery,
  setIsSearchInputFocused,
} from 'core/store/slices/search';
import { REQUESTED_GOODS_CONTAINER_ID } from 'core/constants';

export function SearchProducts() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchQuery, isSearchInputFocused } = useAppSelector(selectSearch);

  const inputElement = useRef(null);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFormClick = useCallback(() => {
    inputElement.current.focus();
  }, []);

  const handleInputFocus = useCallback(() => {
    dispatch(setIsSearchInputFocused(true));
    document.getElementById(REQUESTED_GOODS_CONTAINER_ID)?.scrollIntoView();
  }, []);

  const handleInputBlur = useCallback(() => {
    dispatch(setIsSearchInputFocused(false));
  }, []);

  const handleSearchQueryChange = useCallback((e) => {
    const newSearchQuery = e.target.value;
    dispatch(setSearchQuery(newSearchQuery));
  }, []);

  // change "search" query parameter when search value changes
  useEffect(() => {
    if (
      router.query.search === searchQuery ||
      (!router.query.search && !searchQuery)
    ) {
      return;
    }

    // change "search" query parameter
    const queryParams = { ...router.query };
    if (searchQuery) {
      queryParams.search = searchQuery;
    } else {
      delete queryParams.search;
    }

    router.replace(
      { query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router, searchQuery]);

  return (
    <form
      onSubmit={handleFormSubmit}
      onClick={handleFormClick}
      className={classNames(styles.searchForm, {
        [styles.active]: isSearchInputFocused || searchQuery?.length > 0,
        [styles.focused]: isSearchInputFocused,
      })}
    >
      <Search className={styles.glyph} />

      <input
        ref={inputElement}
        type="text"
        placeholder="Search"
        className={styles.input}
        value={searchQuery}
        onChange={handleSearchQueryChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />

      <span className={styles.placeholder}>Search</span>
    </form>
  );
}
