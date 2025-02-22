import { Action } from '@ngrx/store';

import { createConfig, DEFAULT_NAME, noMonitor } from '../src/config';

const defaultFeatures = {
  pause: true,
  lock: true,
  persist: true,
  export: true,
  import: 'custom',
  jump: true,
  skip: true,
  reorder: true,
  dispatch: true,
  test: true,
};

describe('StoreDevtoolsOptions', () => {
  it('creates default options with empty object given', () => {
    const config = createConfig({});
    expect(config).toEqual({
      maxAge: false,
      monitor: noMonitor,
      actionSanitizer: undefined,
      stateSanitizer: undefined,
      name: DEFAULT_NAME,
      serialize: false,
      logOnly: false,
      autoPause: false,
      features: defaultFeatures,
      trace: false,
      traceLimit: 75,
      connectOutsideZone: false,
    });
  });

  it('creates options that contain passed in options', () => {
    function stateSanitizer(state: any, index: number): any {
      return state;
    }
    function actionSanitizer(action: Action, id: number): Action {
      return action;
    }
    const config = createConfig({
      maxAge: 20,
      actionSanitizer,
      stateSanitizer,
      name: 'ABC',
      serialize: true,
      autoPause: true,
      trace: true,
      traceLimit: 20,
      features: {
        test: true,
      },
    });
    expect(config).toEqual({
      maxAge: 20,
      monitor: noMonitor,
      actionSanitizer,
      stateSanitizer,
      name: 'ABC',
      serialize: true,
      logOnly: false,
      autoPause: true,
      trace: true,
      traceLimit: 20,
      features: {
        test: true,
      },
      connectOutsideZone: false,
    });
  });

  it('can be initialized with a function returning options', () => {
    const config = createConfig(() => ({ maxAge: 15 }));
    expect(config).toEqual({
      maxAge: 15,
      monitor: noMonitor,
      actionSanitizer: undefined,
      stateSanitizer: undefined,
      name: DEFAULT_NAME,
      serialize: false,
      logOnly: false,
      autoPause: false,
      trace: false,
      traceLimit: 75,
      features: defaultFeatures,
      connectOutsideZone: false,
    });
  });

  it('logOnly will set features', () => {
    const config = createConfig({
      logOnly: true,
    });
    expect(config).toEqual({
      maxAge: false,
      monitor: noMonitor,
      actionSanitizer: undefined,
      stateSanitizer: undefined,
      name: DEFAULT_NAME,
      serialize: false,
      logOnly: true,
      autoPause: false,
      trace: false,
      traceLimit: 75,
      features: {
        pause: true,
        export: true,
        test: true,
      },
      connectOutsideZone: false,
    });
  });

  it('import "true" is updated to "custom"', () => {
    // setting import to true results in an error while importing a persisted state into the devtools
    // the imported state only contains the new state without the actions (and config)
    // while testing this, the imported state also wasn't correct and contained the initial state values
    const config = createConfig({
      features: {
        import: true,
      },
    });
    expect(config).toEqual({
      maxAge: false,
      monitor: noMonitor,
      actionSanitizer: undefined,
      stateSanitizer: undefined,
      name: DEFAULT_NAME,
      serialize: false,
      logOnly: false,
      autoPause: false,
      features: {
        import: 'custom',
      },
      trace: false,
      traceLimit: 75,
      connectOutsideZone: false,
    });
  });
});
