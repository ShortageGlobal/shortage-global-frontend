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
  readOnly?: boolean;
};

export function ImageUploadInput({
  value,
  onChange,
  isInvalid = false,
  readOnly = false,
}: ImageUploadInputProps) {
  return (
    <ImageUploading
      value={value}
      onChange={onChange}
      acceptType={['png', 'jpg', 'webp', 'jpeg']}
    >
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
              [styles.readOnly]: readOnly,
            })}
          >
            <div
              role={readOnly ? '' : 'button'}
              className={classNames(styles.dropArea, {
                [styles.dragging]: isDragging,
                [styles.filled]: hasImage,
              })}
              onClick={readOnly ? () => {} : onImageUpload}
              {...dragProps}
            >
              {!hasImage ? (
                <ImageUpload
                  size={46}
                  className={classNames(styles.glyph, {
                    [styles.readOnly]: readOnly,
                  })}
                />
              ) : null}

              {hasImage ? (
                <img
                  alt=""
                  src={imageList[0].dataURL}
                  className={styles.image}
                />
              ) : null}
            </div>

            {!hasImage && !readOnly ? (
              <Button
                variant="outline-dark"
                onClick={onImageUpload}
                className={styles.control}
              >
                <Upload />
                <span>Upload image</span>
              </Button>
            ) : null}

            {hasImage && !readOnly ? (
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
