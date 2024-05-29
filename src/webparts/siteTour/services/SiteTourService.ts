import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { ServiceKey, ServiceScope } from '@microsoft/sp-core-library';
import { SPFI, spfi } from "@pnp/sp";
import { Caching } from "@pnp/queryable";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { getSP } from "../../../common/pnpjsConfig";
import { ITourItem } from './../components/ITourItem';
import * as strings from 'SiteTourWebPartStrings';

export interface ISiteTourService {
    getUserProfileProperties(userLoginName: string, siteUrl: string): Promise<boolean>;
    setUserProfileProperties(userLoginName: string, isChecked: boolean): Promise<void>;
    getTourContent(): Promise<ITourItem[]>;
}

export class SiteTourService implements ISiteTourService {
    private spHttpClient: SPHttpClient;
    public static readonly serviceKey: ServiceKey<ISiteTourService> = ServiceKey.create<ISiteTourService>('spfx:ISiteTourService', SiteTourService);
    private _sp: SPFI;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this.spHttpClient = serviceScope.consume(SPHttpClient.serviceKey);
        });
    }

    /**
     * Gets user profile property value
     * @returns Promise<boolean>
     */
    async getUserProfileProperties(userLoginName: string, siteUrl: string): Promise<boolean> {
        try {
            const encodedUserName = encodeURIComponent(`i:0#.f|membership|${userLoginName}`);
            const restAPIUrl = `${siteUrl}/_api/sp.userprofiles.peoplemanager/getuserprofilepropertyfor(accountName=@v,%20propertyname='NoTutorialForAllSites')?@v='${encodedUserName}'`;

            const response: SPHttpClientResponse = await this.spHttpClient.get(restAPIUrl, SPHttpClient.configurations.v1);
            const results: { value?: string } = await response.json();

            const NoforAllSite: boolean = results.value ? JSON.parse(results.value.toLowerCase()) : false;

            return NoforAllSite;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Sets user profile property value
     * @returns {void}
     */
    async setUserProfileProperties(userLoginName: string, isChecked: boolean): Promise<void> {
        try {
            const chekedValue: string = String(isChecked);
            const baseUrl = window.location.protocol + "//" + window.location.host;
            const apiUrl = baseUrl + "/_api/SP.UserProfiles.PeopleManager/SetSingleValueProfileProperty";

            const userData = {
                'accountName': `i:0#.f|membership|${userLoginName}`,
                'propertyName': 'NoTutorialForAllSites',
                'propertyValue': chekedValue,
            };

            const spOpts = {
                headers: {
                    'Accept': 'application/json;odata=nometadata',
                    'Content-type': 'application/json;odata=verbose',
                    'odata-version': '',
                },
                body: JSON.stringify(userData),
            };

            await this.spHttpClient.post(apiUrl, SPHttpClient.configurations.v1, spOpts);

        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    /**
     * Gets site tour content
     * @returns Promise<ITourItem[]>
     */
    async getTourContent(): Promise<ITourItem[]> {
        try {
            this._sp = getSP();
            const spService = spfi(this._sp).using(Caching({ store: "session" }));

            const response: ITourItem[] = await spService.web.lists
                .getByTitle(strings.tourListTitle)
                .items
                .select("Title", "SC_ControlID", "SC_Description", "SC_Selector", "SC_TourOrder", "SC_IsActive")
                .filter(`SC_IsActive eq 1`)
                .orderBy("SC_TourOrder", true)();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return response.map((item: any) => ({
                title: item.Title,
                description: item.SC_Description,
                selector: item.SC_Selector,
                controlId: item.SC_ControlID,
                order: item.SC_TourOrder,
                isActive: item.SC_IsActive,
            }));

        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}