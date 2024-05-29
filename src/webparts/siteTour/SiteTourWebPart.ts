import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'SiteTourWebPartStrings';
import SiteTour from './components/SiteTour';
import { ISiteTourProps } from './components/ISiteTourProps';
import { getSP } from '../../common/pnpjsConfig';

export interface ISiteTourWebPartProps {
  description: string;
}

export default class SiteTourWebPart extends BaseClientSideWebPart<ISiteTourWebPartProps> {

  protected async onInit(): Promise<void> {
    await super.onInit();

    getSP(this.context);
  }

  public render(): void {
    const element: React.ReactElement<ISiteTourProps> = React.createElement(
      SiteTour,
      {
        spHttpClient: this.context.spHttpClient,
        userLoginName: this.context.pageContext.user.loginName,
        siteUrl: this.context.pageContext.site.absoluteUrl,
        serviceScope: this.context.serviceScope
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
