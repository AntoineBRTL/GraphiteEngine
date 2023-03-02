import { Introduction } from "./Content/Tutorials/Introduction";
import { Page } from "./Page.js";

export class Docs
{
    public constructor()
    {
        let introduction: Introduction = new Introduction();
        let page: Page = new Page(introduction);
    }
}