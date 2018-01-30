import { User } from "app/_models/index.model";

export class Map {
    title: String;
    description: String;
    question: String;
    keywords: Array<String>
    created: Date;
    author: User;
    link: String;
    isPublic: boolean;
    
    
}