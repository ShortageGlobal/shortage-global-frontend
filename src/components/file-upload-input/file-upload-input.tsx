import styles from './file-upload-input.module.scss';
import animationStyles from 'styles/animations.module.scss';
import { useRef, useState, useCallback } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Loader } from 'react-feather';

type FileUploadInputProps = {
  label?: string;
  id?: string;
  accept?: string;
  onSave?: (file: File) => void;
  onChange?: (file: File) => void;
  isLoading?: boolean;
  isDisabled?: boolean;
};

export function FileUploadInput({
  label,
  id = '',
  accept = '',
  onSave,
  onChange = () => {},
  isLoading,
  isDisabled,
}: FileUploadInputProps) {
  const fileInput = useRef<HTMLInputElement>();

  const [file, setFile] = useState<File>(null);

  const handleFileChange = useCallback(() => {
    const newFile = fileInput?.current?.files?.[0];
    setFile(newFile);
    onChange(newFile);
  }, []);

  const handleFileClear = useCallback(() => {
    fileInput.current.value = '';
    setFile(null);
    onChange(null);
  }, []);

  const handleFileSave = useCallback(() => {
    onSave(file);
    handleFileClear();
  }, [file, handleFileClear]);

  return (
    <div className={styles.fileUploadInput}>
      <Form.Group controlId={id}>
        {label ? <Form.Label>{label}</Form.Label> : null}
        <Form.Control
          ref={fileInput}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={isDisabled}
        />
      </Form.Group>

      <div className={styles.controls}>
        {onSave ? (
          <Button
            variant="outline-primary"
            onClick={handleFileSave}
            disabled={!file || isDisabled}
          >
            {isLoading ? (
              <Loader
                role="status"
                aria-hidden="true"
                className={animationStyles.rotate}
              />
            ) : null}
            <span>Save</span>
          </Button>
        ) : null}

        <Button
          variant="outline-dark"
          onClick={handleFileClear}
          disabled={!file || isDisabled}
        >
          <span>Clear</span>
        </Button>
      </div>
    </div>
  );
}
