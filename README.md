# spfx-samples

- Site guided tour
- Welcome card
- 

## Summary

### Site guided tour

The Guided Tour Web Part provides a brief introduction to the key components on a SharePoint page, aiding users in navigating and understanding the layout and functionality. You can configure the tour to highlight specific components by targeting them using a title, web part instance ID, CSS class, or ID.

Configurations are managed through a SharePoint list, allowing for easy updates and customization. Additionally, you can include rich text in the content to provide detailed descriptions and instructions, enhancing the user experience.

![Site guided tour](./assets/tour.gif)

## Compatibility

| :warning: Important          |
|:---------------------------|
| Every SPFx version is only compatible with specific version(s) of Node.js. In order to be able to build this sample, please ensure that the version of Node on your workstation matches one of the versions listed in this section. This sample will not work on a different version of Node.|
|Refer to <https://aka.ms/spfx-matrix> for more information on SPFx compatibility.   |

![SPFx 1.18.1](https://img.shields.io/badge/version-1.18.1-green.svg)
![Node.js v18](https://img.shields.io/badge/Node.js-v18-green.svg) 
![Compatible with SharePoint Online](https://img.shields.io/badge/SharePoint%20Online-Compatible-green.svg)
![Does not work with SharePoint 2019](https://img.shields.io/badge/SharePoint%20Server%202019-Incompatible-red.svg "SharePoint Server 2019 requires SPFx 1.4.1 or lower")
![Does not work with SharePoint 2016 (Feature Pack 2)](https://img.shields.io/badge/SharePoint%20Server%202016%20(Feature%20Pack%202)-Incompatible-red.svg "SharePoint Server 2016 Feature Pack 2 requires SPFx 1.1")
![Local Workbench Unsupported](https://img.shields.io/badge/Local%20Workbench-Unsupported-red.svg "Local workbench is no longer available as of SPFx 1.13 and above")
![Hosted Workbench Compatible](https://img.shields.io/badge/Hosted%20Workbench-Compatible-green.svg)
![Compatible with Remote Containers](https://img.shields.io/badge/Remote%20Containers-Compatible-gre)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)

## Prerequisites

Widgets list in the site, with the Title "Site tour configurations" and the below columns:

Column Internal Name|Type|Required| comments
--------------------|----|--------|----------
Title | Text| Yes
SC_Description | Note | No
SC_Selector | Choice | No
SC_ControlID | Text | No
SC_TourOrder | Number | No
SC_IsActive | Boolean | No

> Deploy the list using template [siteTour.xml](./pnpTemplates/siteTour.xml)

## Minimal Path to Awesome

- Clone this repository
- in the command line run:
  - `npm install`
  - `gulp build`
  - `gulp bundle --ship`
  - `gulp package-solution --ship`
- Add and Deploy Package to AppCatalog
- Deploy the list using template [siteTour.xml](./pnpTemplates/siteTour.xml)
