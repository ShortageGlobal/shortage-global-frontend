import styles from './category-selector.module.scss';
import { useMemo, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  PRODUCT_CATEGORY_LIST,
  PRODUCT_CATEGORY_DETAILS,
  PRODUCT_CATEGORY_ALL_KEY,
} from 'app/constants';
import type { Category } from 'app/api/types';

type CategorySelectorProps = {
  categories: Category[];
  currentCategory?: Category;
  onCategoryChange: (category: Category) => void;
};

export function CategorySelector({
  categories,
  currentCategory,
  onCategoryChange,
}: CategorySelectorProps) {
  const router = useRouter();

  // filter out unavailable categories
  const categoriesDetails = useMemo(() => {
    return (PRODUCT_CATEGORY_LIST as Category[])
      .filter(
        (category) =>
          categories.includes(category) || category === PRODUCT_CATEGORY_ALL_KEY
      )
      .map((category) => PRODUCT_CATEGORY_DETAILS[category]);
  }, [categories, currentCategory]);

  // change "category" query parameter when category changes
  useEffect(() => {
    if (
      router.query.category === currentCategory ||
      (!router.query.category && currentCategory === PRODUCT_CATEGORY_ALL_KEY)
    ) {
      return;
    }

    const categoryDetails = PRODUCT_CATEGORY_DETAILS[currentCategory];

    // change "category" query parameter
    const queryParams = { ...router.query };
    if (currentCategory !== PRODUCT_CATEGORY_ALL_KEY) {
      queryParams.category = categoryDetails.queryFilter;
    } else {
      delete queryParams.category;
    }

    router.replace(
      { query: queryParams },
      undefined,
      { shallow: true } // do not run getServerSideProps
    );
  }, [router, currentCategory]);

  return (
    <div className={styles.categorySelector}>
      <h5 className={styles.subHeader}>Select a category</h5>
      <ul className={styles.categoryList}>
        {categoriesDetails.map((categoryDetails) => {
          const isActive = categoryDetails.key === currentCategory;

          // define "category" query parameter
          const query = { ...router.query };
          if (categoryDetails.queryFilter) {
            query.category = categoryDetails.queryFilter;
          } else {
            delete query.category;
          }

          return (
            <li key={categoryDetails.name}>
              <Link href={{ query }}>
                <a
                  className={classNames(styles.categoryLink, {
                    [styles.active]: isActive,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    onCategoryChange(categoryDetails.key as Category);
                  }}
                >
                  <span className={styles.categoryLinkImage}>
                    <Image
                      alt=""
                      className={classNames({ [styles.hidden]: isActive })}
                      src={categoryDetails.img}
                      layout="fill"
                    />
                    <Image
                      alt=""
                      className={classNames({ [styles.hidden]: !isActive })}
                      src={categoryDetails.imgActive}
                      layout="fill"
                    />
                  </span>
                  {categoryDetails.name}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
