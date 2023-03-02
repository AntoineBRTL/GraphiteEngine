import { Abstract } from "../../Tools/Abstract";
import { Title } from "../../Tools/Title";
import { Content } from "../Content.js";

export class Introduction extends Content
{
    public constructor()
    {
        super();
        let title: Title = new Title("Introduction");
        let abstract: Abstract = new Abstract("Graphite engine is an open source engine ....");
    }
}