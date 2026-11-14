import { NEW_HOST_LABEL, NEW_ORIGIN } from '../../services/appAddress.ts';

/**
 * A sentence that names the new address, with the address itself a real link
 * to it (in a new tab; nothing is asked of it before the tap). Every sentence
 * passed here carries "fermatina.com" literally, in every language (the
 * `moved` and `movedEntry` words — movedNotice.test.tsx checks them); a
 * sentence without it is shown as it is.
 */
export function AddressLink({ text, testId }: { text: string; testId?: string }) {
  const at = text.indexOf(NEW_HOST_LABEL);
  if (at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <a href={NEW_ORIGIN} target="_blank" rel="noopener noreferrer" className="address-link" data-testid={testId}>
        {NEW_HOST_LABEL}
      </a>
      {text.slice(at + NEW_HOST_LABEL.length)}
    </>
  );
}
