/**
* Material-Design-Lite の MaterialSnackbar の拡張定義
* typing で取得できる定義ファイルで不足する部分が書かれている
*/

interface MaterialSnackbar extends HTMLElement {
    MaterialSnackbar: {
        showSnackbar(data : {
            message?: string,
            actionHandler?: (event: any) => any,
            actionText?: string,
            timeout?: number
        }): void;
    }
}

