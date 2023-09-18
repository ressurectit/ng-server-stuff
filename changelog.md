# Changelog

## Version 9.0.0 (2023-09-18)

### Features

- new `provideSsrProgressIndicator` function, that provides Server side progress indicator
- new `ServerRenderProviders` interface
   - `platformProviders` additional platform providers
   - `appProviders` additional app providers
- new `provideServerHotkeysService` function, that provides `provideServerHotkeysService`
- new `ServerHotkeysService` service, that is server hotkeys service

### BREAKING CHANGES

- minimal supported version of `@anglr/common` is `18.0.0`
- minimal supported version of `angular2-hotkeys` is `16.0.1`
- minimal supported version of `tslib` is `2.6.1`
- removed `ServerHotkeysModule` module, not needed anymore
- removed `ServerProvidersModule` module, use `provideSsrProgressIndicator` instead
- `ssrProgressIndicatorFactory` changed signature, now only can be used in DI context (constructor or factory functions)
- `serverRenderFactory` changed signature, removed last parameter, use `getProvidersCallback` to provide extra providers
- updated `ServerRenderOptions`
   - **extends**
      - `ServerRenderOptions`
   - `extraProviders` replaced with `platformProviders` and `appProviders`

## Version 8.0.0 (2023-06-05)

### BREAKING CHANGES

- minimal supported version of `@angular` is `16.0.3`
- minimal supported version of `@rxjs` is `7.5.7`
- minimal supported version of `@anglr/common` is `16.0.0`
- dropped support of `NodeJs` lower than `16.14`

## Version 7.1.0

- added *subpackage* `@anglr/server-stuff/hotkeys`
- *subpackage* `@anglr/server-stuff/hotkeys`
   - added `ServerHotkeysModule` containing mocks for *server side rendering* for `HotkeysService`

## Version 7.0.0

- updated to latest stable *Angular* 9
- added generating of API doc

## Version 6.0.0

- Angular IVY ready (APF compliant package)
- added support for ES2015 compilation
- Angular 8

## Version 5.0.0
 - stabilized for angular v6

## Version 5.0.0-beta.2
 - `@anglr/server-stuff` is now marked as *sideEffects* free
 - `StatusCodeService` is no longer provided by `serverRenderFactory`

## Version 5.0.0-beta.1
 - aktualizácia balíčkov `Angular` na `6`
 - aktualizácia `Webpack` na verziu `4`
 - aktualizácia `rxjs` na verziu `6`
 - automatické generovanie dokumentácie

## Version 4.0.4
 - added factory method for SSR progress indicator `ssrProgressIndicatorFactory`

## Version 4.0.3
 - removed `ServerTransferState` service
 - removed `ServerTransferStateModule`
 - completely refactored `serverRenderFactory` helper, now using Angulars `renderModule`
 - added `ServerProvidersModule` so far empty, no providers

## Version 4.0.2
 - returned typescript version back to 2.4.2 and removed distJit

## Version 4.0.1
 - added compiled outputs for Angular JIT

## Version 4.0.0
 - updated angular to 5.0.0 (final)
 - changed dependencies of project to peerDependencies
 - more strict compilation
 - updated usage of rxjs, now using operators

## Version 4.0.0-beta.1
 - updated factory for generating bootstrap code, now should be compatible with @ngtools/webpack

## Version 4.0.0-beta.0
 - updated angular to >=5.0.0-rc.7