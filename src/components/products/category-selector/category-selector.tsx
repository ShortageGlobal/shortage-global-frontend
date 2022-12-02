import styles from './category-selector.module.scss';
import { useMemo, useEffect } from 'react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  AllCategory,
  VitalGoods,
  Healthcare,
  Education,
  BabyCare,
  SaveAnimals,
  HouseholdItems,
  Food,
  Toys,
} from 'components/icons';
import {
  PRODUCT_CATEGORY_KEY,
  PRODUCT_CATEGORY_ALL_KEY,
  PRODUCT_CATEGORY_LIST,
} from 'core/constants';
import type { Category } from 'core/api/types';

const PRODUCT_CATEGORY_DETAILS = Object.freeze({
  [PRODUCT_CATEGORY_ALL_KEY]: {
    key: PRODUCT_CATEGORY_ALL_KEY,
    queryFilter: '',
    name: 'All',
    GlyphComponent: AllCategory,
  },
  [PRODUCT_CATEGORY_KEY.VITAL_GOODS]: {
    key: PRODUCT_CATEGORY_KEY.VITAL_GOODS,
    queryFilter: PRODUCT_CATEGORY_KEY.VITAL_GOODS,
    name: 'Vital Goods',
    GlyphComponent: VitalGoods,
  },
  [PRODUCT_CATEGORY_KEY.HEALTHCARE]: {
    key: PRODUCT_CATEGORY_KEY.HEALTHCARE,
    queryFilter: PRODUCT_CATEGORY_KEY.HEALTHCARE,
    name: 'Healthcare',
    GlyphComponent: Healthcare,
  },
  [PRODUCT_CATEGORY_KEY.EDUCATION]: {
    key: PRODUCT_CATEGORY_KEY.EDUCATION,
    queryFilter: PRODUCT_CATEGORY_KEY.EDUCATION,
    name: 'Education',
    GlyphComponent: Education,
  },
  [PRODUCT_CATEGORY_KEY.BABY_CARE]: {
    key: PRODUCT_CATEGORY_KEY.BABY_CARE,
    queryFilter: PRODUCT_CATEGORY_KEY.BABY_CARE,
    name: 'Baby Care',
    GlyphComponent: BabyCare,
  },
  [PRODUCT_CATEGORY_KEY.SAVE_ANIMALS]: {
    key: PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
    queryFilter: PRODUCT_CATEGORY_KEY.SAVE_ANIMALS,
    name: 'Save Animals',
    GlyphComponent: SaveAnimals,
  },
  [PRODUCT_CATEGORY_KEY.HOUSEHOLD_ITEMS]: {
    key: PRODUCT_CATEGORY_KEY.HOUSEHOLD_ITEMS,
    queryFilter: PRODUCT_CATEGORY_KEY.HOUSEHOLD_ITEMS,
    name: 'Household Items',
    GlyphComponent: HouseholdItems,
  },
  [PRODUCT_CATEGORY_KEY.FOOD]: {
    key: PRODUCT_CATEGORY_KEY.FOOD,
    queryFilter: PRODUCT_CATEGORY_KEY.FOOD,
    name: 'Food',
    GlyphComponent: Food,
  },
  [PRODUCT_CATEGORY_KEY.TOYS]: {
    key: PRODUCT_CATEGORY_KEY.TOYS,
    queryFilter: PRODUCT_CATEGORY_KEY.TOYS,
    name: 'Toys',
    GlyphComponent: Toys,
  },
});

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
  const availableCategories = useMemo(() => {
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

    const currentCategoryDetails = PRODUCT_CATEGORY_DETAILS[currentCategory];

    // change "category" query parameter
    const queryParams = { ...router.query };
    if (currentCategory !== PRODUCT_CATEGORY_ALL_KEY) {
      queryParams.category = currentCategoryDetails.queryFilter;
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
        {availableCategories.map((categoryDetails) => {
          const isActive = categoryDetails.key === currentCategory;

          // define "category" query parameter
          const query = { ...router.query };
          if (categoryDetails.queryFilter) {
            query.category = categoryDetails.queryFilter;
          } else {
            delete query.category;
          }

          const Glyph = categoryDetails.GlyphComponent;

          return (
            <li key={categoryDetails.name}>
              <Link href={{ query }} legacyBehavior>
                <a
                  className={classNames(styles.categoryLink, {
                    [styles.active]: isActive,
                  })}
                  onClick={(e) => {
                    e.preventDefault();
                    onCategoryChange(categoryDetails.key as Category);
                  }}
                >
                  <Glyph size="4rem" />
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
