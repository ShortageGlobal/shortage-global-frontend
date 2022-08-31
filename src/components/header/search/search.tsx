import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Form } from 'react-bootstrap';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectSearch, setSearchQuery } from 'app/store/slices/search';

export function SearchProducts() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { searchQuery } = useAppSelector(selectSearch);

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleSearchQueryChange = useCallback((e) => {
    const newSearchQuery = e.target.value;
    dispatch(setSearchQuery(newSearchQuery));
  }, []);

  // change "search" query parameter when search value changes
  useEffect(() => {
    console.log('set search query');

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
    <Form onSubmit={handleFormSubmit}>
      <Form.Control
        type="search"
        placeholder="Search"
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
    </Form>
  );
}
