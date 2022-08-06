import styles from './category-selector.module.scss';
import Link from 'next/link';
import { useMemo } from 'react';
import {
  PRODUCT_CATEGORY_LIST,
  PRODUCT_CATEGORY_DETAILS,
  PRODUCT_CATEGORY_ALL,
} from 'app/constants';
import type { Category } from 'app/api/types';

type CategorySelectorProps = {
  categories: Category[];
  currentCategory?: Category;
};

export function CategorySelector({
  categories,
  currentCategory,
}: CategorySelectorProps) {
  const categoriesLinks = useMemo(() => {
    return [
      PRODUCT_CATEGORY_ALL,
      ...(PRODUCT_CATEGORY_LIST as Category[])
        .filter((category) => categories.includes(category))
        .map((category) => PRODUCT_CATEGORY_DETAILS[category]),
    ].map((categoryDetails) => {
      return {
        ...categoryDetails,
        categoryQuery: categoryDetails.category,
        isActive: categoryDetails.category === currentCategory,
      };
    });
  }, [categories, currentCategory]);

  return (
    <div className={styles.categorySelector}>
      <h5 className={styles.subHeader}>Select category</h5>
      <ul>
        {categoriesLinks?.map((categoryLink) => {
          return (
            <li key={categoryLink.name}>
              <Link
                href={{ query: { category: categoryLink.categoryQuery } }}
                scroll={false}
                replace
              >
                <a>
                  {categoryLink.name} {categoryLink.isActive ? '<<<' : ''}
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
