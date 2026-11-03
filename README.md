# @watchtowerobservability/activity-angular

Typed Angular (17+) standalone component for the Watchtower hosted activity log: a thin layer (under 2 KB gzipped, checked by `npm run size`) over the `<wt-activity>` web component of `@watchtowerobservability/activity-web`, which does the rendering, theming, export and verification. Shipped in Angular's partial-compilation format, so the app's build links it like any Angular library.

```sh
npm i @watchtowerobservability/activity-angular @watchtowerobservability/activity-web
```

```ts
import { Component } from '@angular/core';
import { WtActivityComponent, type ActivityEvent } from '@watchtowerobservability/activity-angular';

@Component({
  selector: 'app-audit',
  standalone: true,
  imports: [WtActivityComponent],
  template: `
    <wt-activity #log="wtActivity" [session]="token" baseUrl="https://YOUR_WATCHTOWER_HOST" theme="system" live verify
      (activityOpen)="onOpen($event)" (activityError)="$event.status === 401 && refresh()"></wt-activity>
    <button (click)="log.reload()">Reload</button>`,
})
export class AuditComponent {
  token = ''; // from your backend: POST /api/activity-session
  onOpen(e: ActivityEvent) { console.log('opened', e.action); }
  refresh() { /* mint a new token */ }
}
```

Your backend mints `token` with a server SDK (`createViewerSession`). It is sent only as `Authorization: Bearer`, never in a URL. Never put a secret key in the browser.

| Input | Attribute | |
|---|---|---|
| `session` (required) | `session` | viewer session token; a new value reloads the feed |
| `baseUrl` | `base-url` | your Watchtower API URL (default: the page origin) |
| `theme` | `theme` | `light`, `dark` or `system` |
| `accent`, `density`, `locale` | same | `density`: `compact` or `comfortable` |
| `live`, `verify` | same | booleans (a bare attribute counts as true) |
| `pageSize`, `extrasUrl`, `sealKey` | `page-size`, `extras-url`, `seal-key` | |

Outputs: `activityOpen` (the `ActivityEvent` the viewer opened), `activityLoad` (`{count, hasMore}`) and `activityError` (`{message, status?}`), from the element's `wt-activity-open`, `wt-activity-load` and `wt-activity-error` DOM events. `#ref="wtActivity"` exposes `reload()`.

License: Apache-2.0
