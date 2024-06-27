import { Injectable } from '@angular/core';

interface Script {
  name: string;
  src: string;
}

export const scriptsStore: Script[] = [
  { name: 'uw', src: 'https://upload-widget.cloudinary.com/global/all.js' },
];

@Injectable({
  providedIn: 'root',
})
export class ScriptService {
  private scripts: any = {};
  constructor() {
    scriptsStore.forEach((script) => {
      this.scripts[script.name] = {
        loaded: false,
        src: script.src,
      };
    });
  }

  load(...scripts: string[]) {
    const promises: any[] = [];
    scripts.forEach((script) => promises.push(this.loadScript(script)));
    return Promise.all(promises);
  }

  loadScript(name: string) {
    return new Promise((resolve, reject) => {
      if (this.scripts[name].loaded) {
        resolve({ script: name, loaded: true, status: 'Already Loaded' });
      } else {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.setAttribute('async', '');
        script.src = this.scripts[name].src;
        script.onload = () => {
          this.scripts[name].loaded = true;
          resolve({ script: name, loaded: true, status: 'Loaded' });
        };
        script.onerror = (error) =>
          reject({ script: name, loaded: false, status: error });
        document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }
}
