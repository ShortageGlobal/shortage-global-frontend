import styles from './how-it-works.module.scss';
import { useState, useCallback } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import classNames from 'classnames';
import Image from 'next/image';

const steps = [
  {
    title: (
      <span>
        Step 1 &#x2013; Nonprofit organization posts what&apos;s required
      </span>
    ),
    text: (
      <span>
        Each participating nonprofit organization has a unique page with a list
        of requested items on the Shortage platform
      </span>
    ),
    img: '/images/how-it-works/step_1.svg',
  },
  {
    title: <span>Step 2 &#x2013; The website visitors decide how to help</span>,
    text: (
      <span>
        Donors check the requested list of items on the site and select what
        they would like to buy/send to the nonprofit(s) of their choice
      </span>
    ),
    img: '/images/how-it-works/step_2.svg',
  },
  {
    title: <span>Step 3 &#x2013; Shortage routes the donations</span>,
    text: (
      <span>
        Our moderators manage and send the donations directly to the nonprofit’s
        office/warehouse
      </span>
    ),
    img: '/images/how-it-works/step_3.svg',
  },
  {
    title: <span>Step 4 &#x2013; The nonprofit reports on delivery</span>,
    text: (
      <span>
        The nonprofit receives the donation and uploads a photo of the delivery
        for the donor to share on their personal social media
      </span>
    ),
    img: '/images/how-it-works/step_4.svg',
  },
  {
    title: <span>Step 5 &#x2013; Donors get tax deduction</span>,
    text: (
      <span>
        The platform generates a tax deductible receipt and sends it to the
        donor&apos;s email inbox
      </span>
    ),
    img: '/images/how-it-works/step_5.svg',
  },
];

export function HowItWorks() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleOnSelect = useCallback((newIndex) => {
    setActiveIndex(newIndex);
  }, []);

  const handleKeyDown = useCallback((e, newIndex) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(newIndex);
    }
  }, []);

  return (
    <div className={styles.howItWorks}>
      <ul className={styles.indicators}>
        {steps.map((step, index) => {
          return (
            <li
              key={step.img}
              role="button"
              tabIndex={0}
              className={classNames({ [styles.active]: activeIndex === index })}
              onClick={() => handleOnSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              Step {index + 1}
            </li>
          );
        })}
      </ul>

      <Carousel
        controls={false}
        indicators={false}
        activeIndex={activeIndex}
        onSelect={handleOnSelect}
      >
        {steps.map((step) => {
          return (
            <Carousel.Item key={step.img}>
              <div className={styles.carouselItem}>
                <div className={styles.title}>{step.title}</div>
                <div className={styles.text}>{step.text}</div>
                <div className={styles.imageContainer}>
                  <Image
                    alt=""
                    className={styles.image}
                    src={step.img}
                    fill
                    priority
                  />
                </div>
              </div>
            </Carousel.Item>
          );
        })}
      </Carousel>
    </div>
  );
}
