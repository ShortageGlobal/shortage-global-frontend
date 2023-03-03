import styles from './html-editor.module.scss';
import { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import classNames from 'classnames';
import { uploadImage } from 'core/api';

export function HtmlEditor({
  value,
  onChange,
  props = {},
  initProps = {},
  isValid = false,
  isInvalid = false,
  readOnly = false,
}) {
  const [initialValue, setInitialValue] = useState(value);

  // we use initialValue instead of value to prevent editor content from rerendering
  useEffect(() => {
    if (initialValue === null && value !== null) {
      setInitialValue(value);
    }
  }, [value, initialValue]);

  return (
    <div
      className={classNames(styles.editor, {
        'is-valid': isValid,
        'is-invalid': isInvalid,
        [styles.isValid]: isValid,
        [styles.isInvalid]: isInvalid,
      })}
    >
      <Editor
        initialValue={initialValue}
        onEditorChange={onChange}
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        disabled={readOnly}
        init={{
          promotion: false,
          menubar: false,
          branding: false,
          statusbar: true, // must be true if we want to resize
          resize: true,
          min_height: 300,
          height: 400,
          plugins: ['image', 'lists', 'link', 'anchor'],
          toolbar: `
            blocks fontsize | 
            link image | 
            bold italic bullist numlist | 
            forecolor backcolor |
            alignleft aligncenter alignright |
            removeformat
          `,
          link_target_list: false,
          link_default_target: '_blank',
          font_size_formats: '0.75rem 1rem 1.1rem 1.5rem 2rem',
          font_family_formats: 'Jost',

          // customize appearance
          skin_url: '/tinymce_skin/ui/shortage/',
          content_css:
            '/tinymce_skin/content/shortage/content.min.css?' +
            new Date().getTime(),

          // image uploading
          images_upload_handler: imagesUploadHandler,

          // override settings
          ...initProps,
        }}
        {...props}
      />
    </div>
  );
}

function imagesUploadHandler(blobInfo) {
  return uploadImage({
    file: new File([blobInfo.blob()], blobInfo.filename()),
  });
}
