import { useRef, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Button, OverlayTrigger, Popover } from 'react-bootstrap';
import { HelpCircle } from 'react-feather';

type FormControlExampleProps = {
  example: string;
  triggerClassname?: string;
  onApply?: (example: string) => void;
};

export function FormControlExample({
  example,
  triggerClassname,
  onApply,
}: FormControlExampleProps) {
  const triggerRef = useRef<HTMLSpanElement>();
  const popoverRef = useRef<HTMLDivElement>();
  const [show, setShow] = useState(false);

  const handleApplyClick = useCallback(() => {
    onApply(example);
    setShow(false);
  }, [example, onApply]);

  useEffect(() => {
    if (!show) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        triggerRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setShow(false);
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show]);

  return (
    <OverlayTrigger
      delay={0}
      show={show}
      overlay={
        <Popover>
          <div ref={popoverRef}>
            <Popover.Header>Example</Popover.Header>
            <Popover.Body>
              <div>{example}</div>

              {onApply ? (
                <div className="mt-3">
                  <Button
                    size="sm"
                    variant="outline-dark"
                    onClick={handleApplyClick}
                  >
                    Apply
                  </Button>
                </div>
              ) : null}
            </Popover.Body>
          </div>
        </Popover>
      }
    >
      <span
        ref={triggerRef}
        role="button"
        className={classNames(
          'd-inline-flex align-items-baseline text-decoration-underline',
          triggerClassname
        )}
        onClick={(e) => {
          e.preventDefault();
          setShow(!show);
        }}
      >
        <HelpCircle size="1rem" className="align-self-center" />
        <span className="ms-1">Example</span>
      </span>
    </OverlayTrigger>
  );
}
