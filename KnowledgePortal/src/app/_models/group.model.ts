import { User } from "app/_models/index.model";

export class Group {
    name: String;
    description: String;
    isPublic: boolean;
    created: Date;
    admin: User;
    users: Array<User>;
    link: String;
}