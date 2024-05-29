import { SPHttpClient } from "@microsoft/sp-http";
import { ServiceScope } from "@microsoft/sp-core-library";

export interface ISiteTourProps {
  spHttpClient: SPHttpClient;
  userLoginName: string;
  siteUrl: string;
  serviceScope: ServiceScope;
}