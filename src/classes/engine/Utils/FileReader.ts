export class FileReader
{
    public readFile(path: string, callback: Function)
    {
        const XHR = new XMLHttpRequest();
        XHR.open('GET', path);

        XHR.send();

        XHR.onreadystatechange = function(){
            if(this.readyState === 4 && this.status === 200){
                callback(this.responseText);
            }
        }
    }
}