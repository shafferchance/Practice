let currentScript: HTMLElement;

// Really want to dynamic import instead but webpack....
export function dynamicallyAddScript(url: string) {
  return new Promise((res, rej) => {
    const newScript = document.createElement("script");
    newScript.src = url;
    newScript.type = "text/javascript";
    newScript.async = true;

    newScript.onload = () => {
      res(true);
    };

    newScript.onerror = (e) => {
      console.error(e);
      rej(e);
    };

    if (currentScript) {
      document.head.removeChild(currentScript);
    }
    document.head.appendChild(newScript);
    currentScript = newScript;
  });
}

export function getHtmlElementById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}
