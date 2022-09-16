import styles from './search.module.scss';
import { useRef, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { Search } from 'react-feather';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectSearch, setSearchQuery } from 'app/store/slices/search';

export function SearchProducts() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector(selectSearch);

  const [isInputFocused, setIsInputFocused] = useState(false);
  const inputElement = useRef(null);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleFormClick = useCallback(() => {
    inputElement.current.focus();
  }, []);

  const handleInputFocus = useCallback(() => {
    setIsInputFocused(true);
  }, []);

  const handleInputBlur = useCallback(() => {
    setIsInputFocused(false);
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
      { pathname: router.pathname, query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router, searchQuery]);

  return (
    <form
      onSubmit={handleFormSubmit}
      onClick={handleFormClick}
      className={classNames(styles.searchForm, {
        [styles.active]: isInputFocused || searchQuery?.length > 0,
        [styles.focused]: isInputFocused,
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
