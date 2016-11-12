"use strict";

import View from '../View/View';
import Controller from '../Controller/Controller';
import ViewModel from '../ViewModel/ViewModel';
import Container from '../Container/Container';

/**
* Controller, View, Model の依存設定を書く
* create() で Mithril の route, component へ渡す
*/
abstract class Component implements Mithril.Component<{}> {
    protected container = Container;

    public view: (ctrl?: {}, ...args: any[]) => Mithril.VirtualElement;
    public controller: Mithril.ControllerFunction<{}>;

    constructor() {
        let controllerInstance = this.getController();
        let viewInstance = this.getView();
        let viewModels = this.getModels();

        //View に ViewModel をセット
        viewInstance.setModels(viewModels);

        //Controller に ViewModel をセット
        if(controllerInstance != null) {
            controllerInstance!.setModels(viewModels);
        }

        //controller のセット
        if(controllerInstance != null) {
            //https://github.com/lhorie/mithril.js/issues/914
            //controller にはアロー構文ではなく function を使う
            this.controller = function(args) {
                if(typeof args != "undefined") {
                    controllerInstance!.setOptions(args);
                }
                return controllerInstance!.execute();
            }
        }

        //view のセット
        this.view = (_ctrl, args) => {
            if(typeof args != "undefined") {
                viewInstance.setOptions(args);
            }
            return viewInstance.execute();
        }
    }

    public static getInstance(): Component | null { return null; }

    protected abstract getController(): Controller | null;

    protected abstract getView(): View;

    protected abstract getModels(): { [key: string]: ViewModel } | null;
}

export default Component;

