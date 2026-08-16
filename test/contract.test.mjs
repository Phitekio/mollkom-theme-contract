import assert from 'node:assert/strict';
import test from 'node:test';
import {
  STOREFRONT_EDITOR_BRIDGE_CHANNEL,
  THEME_PAGE_COMPONENTS,
  THEME_PAGE_TYPES,
  THEME_REQUIRED_MAIN_COMPONENT,
  isStorefrontEditorHostMessage,
  isStorefrontEditorStudioMessage,
  isThemeDocument,
} from '../dist/index.js';

const data = {
  root: { props: { title: 'Store' } },
  content: [{ type: 'MainProduct', props: { id: 'main' } }],
  zones: {},
};

test('every page has a canonical allowlist and commerce kernel', () => {
  assert.deepEqual(Object.keys(THEME_PAGE_COMPONENTS), [...THEME_PAGE_TYPES]);
  assert.equal(THEME_REQUIRED_MAIN_COMPONENT.product, 'MainProduct');
  assert.equal(THEME_REQUIRED_MAIN_COMPONENT.collection, 'MainCollection');
  assert.equal(THEME_REQUIRED_MAIN_COMPONENT.cart, 'MainCart');
});

test('validates JSON-safe theme documents', () => {
  assert.equal(isThemeDocument(data), true);
  assert.equal(isThemeDocument({ root: {}, content: [{ type: 'FAQ' }] }), false);
});

test('validates both sides of the production editor bridge', () => {
  const sessionId = '12345678-1234-1234-1234-123456789012';
  assert.equal(isStorefrontEditorHostMessage({
    channel: STOREFRONT_EDITOR_BRIDGE_CHANNEL,
    sessionId,
    type: 'sync',
    data,
    selectedId: null,
  }, sessionId), true);
  assert.equal(isStorefrontEditorStudioMessage({
    channel: STOREFRONT_EDITOR_BRIDGE_CHANNEL,
    sessionId,
    type: 'change',
    data,
  }, sessionId), true);
  assert.equal(isStorefrontEditorStudioMessage({
    channel: STOREFRONT_EDITOR_BRIDGE_CHANNEL,
    sessionId: 'wrong-session',
    type: 'ready',
  }, sessionId), false);
});
