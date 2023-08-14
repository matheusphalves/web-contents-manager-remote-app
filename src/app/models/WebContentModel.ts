import { WebContentStructureModel } from "./WebContentStructureModel";

export interface WebContentModel{
    id: number,
    title: string;
    webContentStructure: WebContentStructureModel | undefined;
    contentFields: object[];
    dateCreated: Date
}