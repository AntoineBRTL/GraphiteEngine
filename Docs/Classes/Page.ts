import { Content } from "./Content/Content.js";

export class Page
{
    private content: Content;

    public constructor(content: Content)
    {
        this.content = content;
    }
}