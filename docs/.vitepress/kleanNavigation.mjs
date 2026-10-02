// Shared by the Klean sidebar and searchable component directory.
export const componentGroups = [
  {
    title: 'Essentials',
    items: [
      {
        name: 'Button',
        slug: 'button',
        description: 'Actions and links with native semantics.'
      },
      {
        name: 'Icons',
        slug: 'icons',
        description: 'Source-owned SVG icons on a calm 24px grid.'
      },
      {
        name: 'Avatar',
        slug: 'avatar',
        description: 'Identity images with resilient fallbacks.'
      },
      {
        name: 'Badge',
        slug: 'badge',
        description: 'Compact labels, counts, and status.'
      },
      {
        name: 'Flag',
        slug: 'flag',
        description: 'Local flag images with accessible country names.'
      },
      {
        name: 'Card',
        slug: 'card',
        description: 'A simple surface for related content.'
      },
      {
        name: 'Separator',
        slug: 'separator',
        description: 'A semantic boundary between sections.'
      }
    ]
  },
  {
    title: 'Forms',
    items: [
      {
        name: 'Input',
        slug: 'input',
        description: 'Native inputs with framework-native binding.'
      },
      {
        name: 'Textarea',
        slug: 'textarea',
        description: 'Multiline text that grows with its content.'
      },
      {
        name: 'Checkbox',
        slug: 'checkbox',
        description: 'Boolean, multiple, and indeterminate choices.'
      },
      {
        name: 'Radio',
        slug: 'radio',
        description: 'One choice from a visible set of options.'
      },
      {
        name: 'Switch',
        slug: 'switch',
        description: 'A setting that takes effect immediately.'
      },
      {
        name: 'Select',
        slug: 'select',
        description: 'Choose one value from a fixed list.'
      },
      {
        name: 'Combobox',
        slug: 'combobox',
        description: 'Search and choose from a long list.'
      },
      {
        name: 'Tags Input',
        slug: 'tags-input',
        description: 'Add and remove a collection of values.'
      },
      {
        name: 'Slider',
        slug: 'slider',
        description: 'Choose a number or a two-handle range.'
      },
      {
        name: 'FileUpload',
        slug: 'file-upload',
        description: 'Select files with honest validation and previews.'
      },
      {
        name: 'RichText',
        slug: 'rich-text',
        description: 'Edit formatted HTML or Markdown.'
      }
    ]
  },
  {
    title: 'Navigation',
    items: [
      {
        name: 'Breadcrumb',
        slug: 'breadcrumb',
        description: 'A clear path through your application.'
      },
      {
        name: 'Tabs',
        slug: 'tabs',
        description: 'Related panels with accessible keyboard navigation.'
      },
      {
        name: 'Sidebar',
        slug: 'sidebar',
        description: 'A remembered home for application navigation.'
      },
      {
        name: 'Pagination',
        slug: 'pagination',
        description: 'Shareable navigation through server-rendered results.'
      },
      {
        name: 'Command',
        slug: 'command',
        description: 'Searchable actions and destinations.'
      }
    ]
  },
  {
    title: 'Overlays',
    items: [
      {
        name: 'Dialog',
        slug: 'dialog',
        description: 'Focused tasks in a native modal.'
      },
      {
        name: 'Sheet',
        slug: 'sheet',
        description: 'An off-canvas dialog for focused workflows.'
      },
      {
        name: 'Popover',
        slug: 'popover',
        description: 'Non-modal content anchored to a trigger.'
      },
      {
        name: 'Menu',
        slug: 'menu',
        description: 'Keyboard-friendly actions and destinations.'
      },
      {
        name: 'Tooltip',
        slug: 'tooltip',
        description: 'Short, supplementary context on hover or focus.'
      }
    ]
  },
  {
    title: 'Dates and time',
    items: [
      {
        name: 'Calendar',
        slug: 'calendar',
        description: 'An accessible, locale-aware date-only calendar.'
      },
      {
        name: 'Date Picker',
        slug: 'date-picker',
        description: 'Type or pick a single date.'
      },
      {
        name: 'Date Range Picker',
        slug: 'date-range-picker',
        description: 'Choose a related start and end date.'
      },
      {
        name: 'Schedule Picker',
        slug: 'schedule-picker',
        description: 'Choose a date and time in a visible timezone.'
      }
    ]
  },
  {
    title: 'Data display',
    items: [
      {
        name: 'Table',
        slug: 'table',
        description: 'A native table with application-owned markup.'
      },
      {
        name: 'DataTable',
        slug: 'data-table',
        description: 'Server-driven data, selection, and query state.'
      },
      {
        name: 'Row Actions',
        slug: 'row-actions',
        description: 'Actions for an individual record.'
      },
      {
        name: 'Bulk Actions',
        slug: 'bulk-actions',
        description: 'Actions for selected records.'
      },
      {
        name: 'Filter Bar',
        slug: 'filter-bar',
        description: 'Draft and committed filters with shareable URLs.'
      },
      {
        name: 'Sparkline',
        slug: 'sparkline',
        description: 'A compact trend beside an exact value.'
      },
      {
        name: 'Line Chart',
        slug: 'line-chart',
        description: 'A readable trend with exact accessible values.'
      }
    ]
  },
  {
    title: 'Feedback',
    items: [
      {
        name: 'Alert',
        slug: 'alert',
        description: 'Contextual notices with explicit announcement semantics.'
      },
      {
        name: 'Toast',
        slug: 'toast',
        description: 'Notifications with actions and truthful updates.'
      },
      {
        name: 'Spinner',
        slug: 'spinner',
        description: 'A decorative mark for work in progress.'
      },
      {
        name: 'Empty State',
        slug: 'empty-state',
        description: 'Explain an empty result and offer a next step.'
      },
      {
        name: 'Loading State',
        slug: 'loading-state',
        description: 'Communicate that content is on its way.'
      },
      {
        name: 'Error State',
        slug: 'error-state',
        description: 'Explain a failure and make recovery clear.'
      },
      {
        name: 'Slide',
        slug: 'slide',
        description: 'Confirm an action with an optional pointer slide.'
      }
    ]
  }
]

export const components = componentGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, category: group.title }))
)

export function filterComponents(query = '', category = 'All components') {
  const search = query.trim().toLowerCase()
  return components.filter(
    (item) =>
      (category === 'All components' || item.category === category) &&
      `${item.name} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(search)
  )
}
