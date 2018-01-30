import { Group, Map } from "app/_models/index.model";

export class User {
    name: String;
    username: String;
    password: String;
    company: String;
    email: String;
    created: Date;
    groups: Array<Group>
    link: String;
    maps: Array<Map>
    profilePicture: String;
}