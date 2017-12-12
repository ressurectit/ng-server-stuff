# Changelog

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