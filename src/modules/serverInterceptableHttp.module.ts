import {CommonModule} from '@angular/common';
import {Http, XHRBackend, RequestOptions, ConnectionBackend, BrowserXhr, Connection, ReadyState, Request, Response, XSRFStrategy} from '@angular/http';
import {NgModule, FactoryProvider, ModuleWithProviders, Provider} from '@angular/core';
import {HttpInterceptor, InterceptableHttp, HTTP_INTERCEPTORS} from '@anglr/http-extensions';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';

//HACH - remove this when they make it public api
declare class Zone
{
  public static current: any;
}

export class ZoneMacroTaskConnection implements Connection {
  response: Observable<Response>;
  lastConnection: Connection;

  constructor(public request: Request, backend: XHRBackend) {
    this.response = new Observable((observer: Observer<Response>) => {
      let task: any = null;
      let scheduled: boolean = false;
      let sub: Subscription = null;
      let savedResult: any = null;
      let savedError: any = null;

      const scheduleTask = (_task: any) => {
        task = _task;
        scheduled = true;

        this.lastConnection = backend.createConnection(request);
        sub = (this.lastConnection.response as Observable<Response>)
                  .subscribe(
                      res => savedResult = res,
                      err => {
                        if (!scheduled) {
                          throw new Error('invoke twice');
                        }
                        savedError = err;
                        scheduled = false;
                        task.invoke();
                      },
                      () => {
                        if (!scheduled) {
                          throw new Error('invoke twice');
                        }
                        scheduled = false;
                        task.invoke();
                      });
      };

      const cancelTask = (_task: any) => {
        if (!scheduled) {
          return;
        }
        scheduled = false;
        if (sub) {
          sub.unsubscribe();
          sub = null;
        }
      };

      const onComplete = () => {
        if (savedError !== null) {
          observer.error(savedError);
        } else {
          observer.next(savedResult);
          observer.complete();
        }
      };

      // MockBackend is currently synchronous, which means that if scheduleTask is by
      // scheduleMacroTask, the request will hit MockBackend and the response will be
      // sent, causing task.invoke() to be called.
      const _task = Zone.current.scheduleMacroTask(
          'ZoneMacroTaskConnection.subscribe', onComplete, {}, () => null, cancelTask);
      scheduleTask(_task);

      return () => {
        if (scheduled && task) {
          task.zone.cancelTask(task);
          scheduled = false;
        }
        if (sub) {
          sub.unsubscribe();
          sub = null;
        }
      };
    });
  }

  get readyState(): ReadyState {
    return !!this.lastConnection ? this.lastConnection.readyState : ReadyState.Unsent;
  }
}

export class ZoneMacroTaskBackend implements ConnectionBackend 
{
  constructor(private backend: XHRBackend) {}

  createConnection(request: any): ZoneMacroTaskConnection {
    return new ZoneMacroTaskConnection(request, this.backend);
  }
}

/**
 * Factory method that is used for creating InterceptableHttp for server
 */
export function httpFactory(interceptors: HttpInterceptor[], backend: XHRBackend, defaultOptions: RequestOptions)
{
    const macroBackend = new ZoneMacroTaskBackend(backend);
    
    return new InterceptableHttp(interceptors, macroBackend, defaultOptions);
}

/**
 * InterceptableHttp module for server side
 */
@NgModule(
{
    imports: [CommonModule]
})
export class ServerInterceptableHttpModule
{
    //######################### public methods #########################

    /**
     * Returns module with HttpInterceptor providers and custom Http provider that supports InterceptableHttp for server side
     */
    public static forRoot(): ModuleWithProviders
    {
        return {
            ngModule: ServerInterceptableHttpModule,
            providers:
            [
                <FactoryProvider>
                {
                    provide: Http,
                    useFactory: httpFactory,
                    deps: [HTTP_INTERCEPTORS, XHRBackend, RequestOptions]
                }
            ]
        };
    }
}