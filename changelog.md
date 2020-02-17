# Changelog

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