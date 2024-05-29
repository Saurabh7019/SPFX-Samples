export interface ITourItem {
    title: string;
    description: string;
    selector: string;
    controlId: string;
    order: number;    
    isActive: boolean;
}

export interface ISteps {
    selector: string;
    content: string;
}