export class FileReader
{
    public readFile(path: string, callback: Function)
    {
        let XHR: XMLHttpRequest;
        XHR = new XMLHttpRequest();
        XHR.open('GET', path);
        XHR.send();
        XHR.onreadystatechange = function()
        {
            if(this.readyState === 4 && this.status === 200)
            {
                callback(this.responseText);
            }
        }
    }

    public async readFileAsync(path: string): Promise<string>
    {
        let response = await fetch(path);
        return await response.text();
    }
}