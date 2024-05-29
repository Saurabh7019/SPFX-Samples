import { ServiceScope, ServiceKey } from '@microsoft/sp-core-library';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { Log } from '@microsoft/sp-core-library';
import * as Common from "@microsoft/applicationinsights-common";
import { SeverityLevel } from '@microsoft/applicationinsights-common';

const LOG_SOURCE: string = "SPFX Samples";

export interface IAppInsightsService {
    initialize(key: string): void;
    trackEvent(name: string, properties?: { [name: string]: string }, measurements?: { [name: string]: number }): void;
    trackPageView(pageView?: Common.IPageViewTelemetry): void;
    trackException(exception: Error, properties?: { [name: string]: string }, measurements?: { [name: string]: number }, severityLevel?: SeverityLevel | number | string): void;
    appInsights: ApplicationInsights;
}

export class AppInsightsService implements IAppInsightsService {
    private _initialized: boolean;
    public static readonly serviceKey: ServiceKey<IAppInsightsService> = ServiceKey.create<IAppInsightsService>('spfx:IAppInsightsService', AppInsightsService);
    public appInsights: ApplicationInsights;

    constructor(serviceScope: ServiceScope) {
        this._initialized = false;
        serviceScope.whenFinished(() => {
            this.appInsights = serviceScope.consume(AppInsightsService.serviceKey).appInsights;

            this.initialize("2d2dc1f7-3fcf-4783-a655-6b23c2a164ac"); // TODO: Fetch from config
        });
    }

    initialize(key: string): void {
        if (this._initialized) {
            return;
        }

        if (!key) {
            throw new Error("Instrumentation key is required for initialization.");
        }

        this.appInsights = new ApplicationInsights({
            config: {
                instrumentationKey: key
            }
        });

        this.appInsights.loadAppInsights();
        this._initialized = true;
    }

    trackEvent(name: string, properties?: { [name: string]: string }, measurements?: { [name: string]: number }): void {
        try {
            if (!this.appInsights) {
                return;
            }

            const event: Common.IEventTelemetry = { name };

            if (measurements) {
                Object.keys(measurements).map(key => {
                    const value = measurements[key];
                    this.appInsights.trackMetric({ name: `${name}.${key}`, average: value });
                });
            }

            this.appInsights.trackEvent(event, properties);
        } catch (ex) {
            Log.error(LOG_SOURCE, ex);
        }
    }

    trackPageView(pageView?: Common.IPageViewTelemetry): void {
        try {
            if (this.appInsights) {
                this.appInsights.trackPageView(pageView);
            }
        } catch (ex) {
            Log.error(LOG_SOURCE, ex);
        }
    }

    trackException(exception: Error, properties?: { [name: string]: string }, measurements?: { [name: string]: number }, severityLevel?: SeverityLevel | number | string): void {
        try {
            if (!this.appInsights) {
                return;
            }

            if (typeof severityLevel === "string") {
                severityLevel = parseInt(severityLevel);
            }

            const exceptionObj: Common.IExceptionTelemetry = {
                exception,
                severityLevel
            };

            if (measurements && Object.keys(measurements).length > 0) {
                Object.keys(measurements).forEach(key => {
                    const value = measurements[key];
                    const metricName = `${name}.${key}`;
                    this.appInsights.trackMetric({ name: metricName, average: value });
                });
            }

            this.appInsights.trackException(exceptionObj, properties);
        } catch (ex) {
            Log.error(LOG_SOURCE, ex);
        }
    }
}
