import styles from './category-selector.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { useMemo } from 'react';
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
  const categoriesDetails = useMemo(() => {
    return (PRODUCT_CATEGORY_LIST as Category[])
      .filter(
        (category) =>
          categories.includes(category) || category === PRODUCT_CATEGORY_ALL_KEY
      )
      .map((category) => PRODUCT_CATEGORY_DETAILS[category]);
  }, [categories, currentCategory]);

  return (
    <div className={styles.categorySelector}>
      <h5 className={styles.subHeader}>Select a category</h5>
      <ul className={styles.categoryList}>
        {categoriesDetails.map((categoryDetails) => {
          const isActive = categoryDetails.key === currentCategory;
          return (
            <li key={categoryDetails.name}>
              <Link
                href={{
                  query: { category: categoryDetails.queryFilter },
                }}
              >
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
                      className={classNames({ [styles.hidden]: isActive })}
                      src={categoryDetails.img}
                      layout="fill"
                    />
                    <Image
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
