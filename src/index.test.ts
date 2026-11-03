import '@angular/compiler'; // JIT: compiles the partial declarations the way an app's linker would
import { ElementRef } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { EVENTS, WtActivityComponent, type ActivityEvent } from './index';

function make() {
  const el = document.createElement('wt-activity') as HTMLElement & { reloads: number };
  return { el, c: new WtActivityComponent(new ElementRef(el)) };
}

describe('WtActivityComponent (angular)', () => {
  it('is a standalone component on the element itself', () => {
    const def = (WtActivityComponent as unknown as { ɵcmp: { selectors: unknown; standalone: boolean; inputs: Record<string, unknown>; outputs: Record<string, string> } }).ɵcmp;
    expect(def.selectors).toEqual([['wt-activity']]);
    expect(def.standalone).toBe(true);
    expect(Object.keys(def.inputs)).toContain('session');
    expect(Object.values(def.outputs)).toEqual(['activityOpen', 'activityLoad', 'activityError']);
  });

  it('maps inputs to attributes on change, bare boolean attributes included', () => {
    const { el, c } = make();
    Object.assign(c, { session: 'tok1', baseUrl: 'https://api.example', live: '', pageSize: 100 });
    c.ngOnChanges();
    expect(el.getAttribute('session')).toBe('tok1');
    expect(el.getAttribute('base-url')).toBe('https://api.example');
    expect(el.getAttribute('live')).toBe('');
    expect(el.getAttribute('page-size')).toBe('100');
    Object.assign(c, { session: 'tok2', live: false });
    c.ngOnChanges();
    expect(el.getAttribute('session')).toBe('tok2');
    expect(el.hasAttribute('live')).toBe(false);
  });

  it('re-emits the element events and stops on destroy', async () => {
    const { el, c } = make();
    const seen: string[] = [];
    c.activityOpen.subscribe((e: ActivityEvent) => seen.push(e.id));
    c.activityError.subscribe((d) => seen.push(`error ${d.status}`));
    el.dispatchEvent(new CustomEvent(EVENTS.open, { detail: { event: { id: 'e1', account_id: 'a', action: 'x', occurred_at: '' } } }));
    el.dispatchEvent(new CustomEvent(EVENTS.error, { detail: { message: 'gone', status: 401 } }));
    c.ngOnDestroy();
    el.dispatchEvent(new CustomEvent(EVENTS.open, { detail: { event: { id: 'e2' } } }));
    expect(seen).toEqual(['e1', 'error 401']);
    await c.reload();
    expect(el.reloads).toBe(1);
  });
});
