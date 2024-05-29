declare interface ISiteTourWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  AppLocalEnvironmentSharePoint: string;
  AppLocalEnvironmentTeams: string;
  AppLocalEnvironmentOffice: string;
  AppLocalEnvironmentOutlook: string;
  AppSharePointEnvironment: string;
  AppTeamsTabEnvironment: string;
  AppOfficeEnvironment: string;
  AppOutlookEnvironment: string;
  UnknownEnvironment: string;
  btnTitle: string;
  tourListTitle: string;
  disableAutoPlay: string;
  startTour: string;
}

declare module 'SiteTourWebPartStrings' {
  const strings: ISiteTourWebPartStrings;
  export = strings;
}
