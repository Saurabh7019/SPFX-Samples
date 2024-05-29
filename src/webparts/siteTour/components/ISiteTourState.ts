import { ITourItem, ISteps } from './ITourItem';

export interface ISiteTourState {
    items: ITourItem[];
    steps: ISteps[];
    isTourActive: boolean;
    stepIndex: number; 
    checked: boolean | undefined;
    isTourOpen: boolean;
}