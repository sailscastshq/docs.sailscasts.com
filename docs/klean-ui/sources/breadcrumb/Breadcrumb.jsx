import { Link } from "@inertiajs/react";
import { Fragment, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const LINK_CLASSES =
  "inline-flex min-h-11 min-w-0 max-w-48 cursor-pointer items-center rounded-sm px-1 text-gray-500 no-underline transition-colors hover:text-gray-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-950 dark:text-gray-400 dark:hover:text-white dark:focus-visible:outline-white";
const LABEL_CLASSES =
  "inline-flex min-h-11 min-w-0 max-w-48 items-center px-1 text-gray-500 dark:text-gray-400";
const CURRENT_CLASSES =
  "inline-flex min-h-11 min-w-0 max-w-64 items-center px-1 font-medium text-gray-950 dark:text-white";
const SEPARATOR_CLASSES =
  "size-3.5 shrink-0 text-gray-400 dark:text-gray-600";

function Separator() {
  return (
    <svg
      data-slot="separator"
      aria-hidden="true"
      className={SEPARATOR_CLASSES}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="m6 3.5 4.5 4.5L6 12.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const Breadcrumb = forwardRef(function Breadcrumb(
  {
    items = [],
    className,
    "aria-label": ariaLabel = "Breadcrumb",
    "data-slot": _dataSlot,
    ...navProps
  },
  forwardedRef,
) {
  if (!items.length) return null;

  const lastIndex = items.length - 1;
  const collapses = items.length > 3;

  function itemClass(index) {
    return twMerge(
      "flex min-w-0 shrink-0 items-center gap-1.5",
      collapses && index > 0 && index < lastIndex - 1
        ? "hidden @lg:flex"
        : undefined,
      index === lastIndex ? "shrink" : undefined,
    );
  }

  return (
    <nav
      {...navProps}
      ref={forwardedRef}
      data-slot="breadcrumb"
      aria-label={ariaLabel}
      className={twMerge("@container min-w-0", className)}
    >
      <ol
        data-slot="list"
        className="flex min-w-0 items-center gap-1.5 overflow-hidden text-sm"
      >
        {items.map((item, index) => (
          <Fragment key={`${index}-${item.label}`}>
            {collapses && index === lastIndex - 1 ? (
              <li
                data-slot="ellipsis"
                className="flex shrink-0 items-center gap-1.5 @lg:hidden"
              >
                <Separator />
                <span className="inline-flex min-h-11 items-center px-1 text-gray-400 dark:text-gray-500">
                  <span aria-hidden="true">…</span>
                  <span className="sr-only">Collapsed breadcrumb items</span>
                </span>
              </li>
            ) : null}

            <li
              data-slot="item"
              data-index={index}
              data-state={index === lastIndex ? "current" : undefined}
              className={itemClass(index)}
            >
              {index > 0 ? <Separator /> : null}

              {index === lastIndex ? (
                <span
                  data-slot="current"
                  aria-current="page"
                  title={item.title}
                  className={CURRENT_CLASSES}
                >
                  <span className="truncate">{item.label}</span>
                </span>
              ) : item.href ? (
                <Link
                  href={item.href}
                  data-slot="link"
                  title={item.title}
                  className={LINK_CLASSES}
                >
                  <span className="truncate">{item.label}</span>
                </Link>
              ) : (
                <span
                  data-slot="label"
                  title={item.title}
                  className={LABEL_CLASSES}
                >
                  <span className="truncate">{item.label}</span>
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  );
});

export default Breadcrumb;
