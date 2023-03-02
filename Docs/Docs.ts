import { Introduction } from "./Classes/Content/Tutorials/Introduction.js";
import { Page } from "./Classes/Page.js";

export class Docs
{
    public constructor()
    {
        let introduction: Introduction = new Introduction();
        let page: Page = new Page(introduction);
    }
}