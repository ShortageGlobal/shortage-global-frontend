import styles from './pagination.module.scss';
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { ChevronLeft, ChevronRight } from 'react-feather';
import { PAGE_SIZES } from 'core/constants';

type PaginationProps = {
  className?: string;
  pageSize: number;
  pageNumber: number;
  totalCount: number;
  onPageSizeChange: (pageSize: number) => void;
  onPageNumberChange: (pageNumber: number) => void;
};

export function Pagination({
  className,
  pageSize,
  pageNumber,
  totalCount,
  onPageSizeChange,
  onPageNumberChange,
}: PaginationProps) {
  const handlePrevPageClick = useCallback(() => {
    onPageNumberChange(pageNumber - 1);
  }, [pageNumber, onPageNumberChange]);

  const handleNextPageClick = useCallback(() => {
    onPageNumberChange(pageNumber + 1);
  }, [pageNumber, onPageNumberChange]);

  const handlePageSizeChange = useCallback(
    (newPageSize) => {
      onPageSizeChange(newPageSize);
      onPageNumberChange(0);
    },
    [onPageSizeChange, onPageNumberChange]
  );

  const isPrevDisabled = useMemo(() => {
    return pageNumber === 0;
  }, [pageNumber]);

  const isNextDisabled = useMemo(() => {
    return pageSize * (pageNumber + 1) >= totalCount;
  }, [pageSize, pageNumber, totalCount]);

  const paginationMessage = useMemo(() => {
    const from = pageNumber * pageSize + 1;
    const to = Math.min((pageNumber + 1) * pageSize, totalCount);
    return `${from} – ${to} of ${totalCount}`;
  }, [pageSize, pageNumber, totalCount]);

  const pageSizes = useMemo(() => {
    const result = PAGE_SIZES.filter((size) => size <= totalCount);
    if (!result.includes(totalCount)) {
      result.push(totalCount);
    }
    return result;
  }, [totalCount]);

  return (
    <div className={classNames(styles.pagination, className)}>
      <Button
        variant=""
        className={styles.paginationArrowBtn}
        onClick={handlePrevPageClick}
        disabled={isPrevDisabled}
        aria-label="Previous page"
      >
        <ChevronLeft aria-hidden />
      </Button>

      <DropdownButton title={paginationMessage} variant="" align="end">
        {pageSizes.map((size) => {
          return (
            <Dropdown.Item
              key={size}
              disabled={size === pageSize}
              onClick={() => handlePageSizeChange(size)}
            >
              {size}
            </Dropdown.Item>
          );
        })}
      </DropdownButton>

      <Button
        variant=""
        className={styles.paginationArrowBtn}
        onClick={handleNextPageClick}
        disabled={isNextDisabled}
        aria-label="Next page"
      >
        <ChevronRight aria-hidden />
      </Button>
    </div>
  );
}
