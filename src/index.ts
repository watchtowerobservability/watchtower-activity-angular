// Angular wrapper of <wt-activity>: a standalone component whose host is the element itself, so no
// CUSTOM_ELEMENTS_SCHEMA is needed. It ships in Angular's partial-compilation format (what ng-packagr emits:
// ɵɵngDeclare* calls that the app's linker compiles), so it works in AOT and JIT apps from Angular 17 on.
import '@watchtowerobservability/activity-web';
import * as i0 from '@angular/core';
import { ElementRef, EventEmitter, type OnChanges, type OnDestroy } from '@angular/core';
import {
  applyProps, EVENTS, type ActivityErrorDetail, type ActivityEvent, type ActivityLoadDetail, type ActivityLogProps, type WtActivityElement,
} from './props';

export * from './props';

/**
 * `<wt-activity [session]="token" live (activityOpen)="onOpen($event)"></wt-activity>` with `imports: [WtActivityComponent]`.
 * Outputs: `activityOpen` (the event the viewer opened), `activityLoad`, `activityError`. `#log="wtActivity"` gives `log.reload()`.
 */
export class WtActivityComponent implements OnChanges, OnDestroy {
  session = '';
  baseUrl?: string;
  theme?: ActivityLogProps['theme'];
  accent?: string;
  density?: ActivityLogProps['density'];
  locale?: string;
  live?: boolean;
  verify?: boolean;
  pageSize?: number;
  extrasUrl?: string;
  sealKey?: string;
  readonly activityOpen = new EventEmitter<ActivityEvent>();
  readonly activityLoad = new EventEmitter<ActivityLoadDetail>();
  readonly activityError = new EventEmitter<ActivityErrorDetail>();
  private readonly el: WtActivityElement;
  private readonly listeners: [string, (e: Event) => void][];

  constructor(ref: ElementRef<HTMLElement>) {
    this.el = ref.nativeElement as WtActivityElement;
    this.listeners = [
      [EVENTS.open, (e) => this.activityOpen.emit((e as CustomEvent<{ event: ActivityEvent }>).detail.event)],
      [EVENTS.load, (e) => this.activityLoad.emit((e as CustomEvent<ActivityLoadDetail>).detail)],
      [EVENTS.error, (e) => this.activityError.emit((e as CustomEvent<ActivityErrorDetail>).detail)],
    ];
    for (const [n, f] of this.listeners) this.el.addEventListener(n, f);
  }

  ngOnChanges(): void {
    // booleans arrive as '' from a bare attribute (`live`): present means on
    applyProps(this.el, { ...this, live: on(this.live), verify: on(this.verify) });
  }

  ngOnDestroy(): void {
    for (const [n, f] of this.listeners) this.el.removeEventListener(n, f);
  }

  /** Refetch the feed. */
  reload(): Promise<void> {
    return this.el.reload();
  }

  static ɵfac: i0.ɵɵFactoryDeclaration<WtActivityComponent, never> = i0.ɵɵngDeclareFactory({
    minVersion: '12.0.0', version: '17.3.0', ngImport: i0, type: WtActivityComponent,
    deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Component,
  } as never) as never;

  // the type arguments are literal on purpose: the Angular compiler reads them from the .d.ts syntactically
  static ɵcmp: i0.ɵɵComponentDeclaration<WtActivityComponent, 'wt-activity', ['wtActivity'], {
    'session': { 'alias': 'session'; 'required': true }; 'baseUrl': { 'alias': 'baseUrl'; 'required': false };
    'theme': { 'alias': 'theme'; 'required': false }; 'accent': { 'alias': 'accent'; 'required': false };
    'density': { 'alias': 'density'; 'required': false }; 'locale': { 'alias': 'locale'; 'required': false };
    'live': { 'alias': 'live'; 'required': false }; 'verify': { 'alias': 'verify'; 'required': false };
    'pageSize': { 'alias': 'pageSize'; 'required': false }; 'extrasUrl': { 'alias': 'extrasUrl'; 'required': false };
    'sealKey': { 'alias': 'sealKey'; 'required': false };
  }, { 'activityOpen': 'activityOpen'; 'activityLoad': 'activityLoad'; 'activityError': 'activityError' }, never, never, true, never> =
    i0.ɵɵngDeclareComponent({
      minVersion: '14.0.0', version: '17.3.0', type: WtActivityComponent, isStandalone: true, selector: 'wt-activity',
      inputs: {
        session: 'session', baseUrl: 'baseUrl', theme: 'theme', accent: 'accent', density: 'density', locale: 'locale',
        live: 'live', verify: 'verify', pageSize: 'pageSize', extrasUrl: 'extrasUrl', sealKey: 'sealKey',
      },
      outputs: { activityOpen: 'activityOpen', activityLoad: 'activityLoad', activityError: 'activityError' },
      exportAs: ['wtActivity'], usesOnChanges: true, ngImport: i0, template: '', isInline: true,
      changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None,
    } as never) as never;
}

function on(v: unknown): boolean {
  return v === true || v === '' || v === 'true';
}
