import styles from './image-upload-input.module.scss';
import ImageUploading from 'react-images-uploading';
import classNames from 'classnames';
import { Button } from 'react-bootstrap';
import { Trash2, Upload } from 'react-feather';
import { ImageUpload } from 'components/icons';
import type {
  ImageListType,
  ImageUploadingPropsType,
} from 'react-images-uploading';

type ImageUploadInputProps = {
  value: ImageListType;
  onChange: ImageUploadingPropsType['onChange'];
  isInvalid?: boolean;
};

export function ImageUploadInput({
  value,
  onChange,
  isInvalid,
}: ImageUploadInputProps) {
  return (
    <ImageUploading value={value} onChange={onChange}>
      {({
        imageList,
        onImageUpload,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => {
        const hasImage = imageList?.length > 0;
        return (
          <div
            className={classNames(styles.imageUploadInput, {
              'is-invalid': isInvalid,
            })}
          >
            <div
              role="button"
              className={classNames(styles.dropArea, {
                [styles.dragging]: isDragging,
                [styles.filled]: hasImage,
              })}
              onClick={onImageUpload}
              {...dragProps}
            >
              {!hasImage ? (
                <ImageUpload size={46} className={styles.glyph} />
              ) : null}

              {hasImage ? (
                <img
                  alt=""
                  src={imageList[0].dataURL}
                  className={styles.image}
                />
              ) : null}
            </div>

            {!hasImage ? (
              <Button
                variant="outline-dark"
                onClick={onImageUpload}
                className={styles.control}
              >
                <Upload />
                <span>Upload image</span>
              </Button>
            ) : null}

            {hasImage ? (
              <>
                <Button
                  variant="outline-dark"
                  onClick={() => onImageUpdate(0)}
                  className={styles.control}
                >
                  Update
                </Button>
                <Button
                  variant="outline-dark"
                  onClick={() => onImageRemove(0)}
                  className={styles.control}
                >
                  <Trash2 size="1rem" />
                  <span>Remove</span>
                </Button>
              </>
            ) : null}
          </div>
        );
      }}
    </ImageUploading>
  );
}
