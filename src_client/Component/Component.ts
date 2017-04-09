"use strict";

import View from '../View/View';
import Controller from '../Controller/Controller';
import ViewModel from '../ViewModel/ViewModel';
import Container from '../Container/Container';
import { ClassComponent, CVnode, Vnode, VnodeDOM } from 'mithril';

/**
* Controller, View, Model の依存設定を書く
* create() で Mithril の route, component へ渡す
*/
abstract class Component implements ClassComponent<{ [key: string]: any; }> {
    protected container = Container;

    public view: (attrs: CVnode<{ [key: string]: any; }>) => Vnode<any, any>;
    public oninit: (this: any, vnode: Vnode<{ [key: string]: any; }, any>) => void;
    public onbeforeupdate: (this: any, vnode: VnodeDOM<{ [key: string]: any; }, any>, old: VnodeDOM<{ [key: string]: any; }, any>) => boolean;
    public onupdate: (this: any, vnode: VnodeDOM<{ [key: string]: any; }, any>) => void;
    public onremove: (this: any, vnode: VnodeDOM<{ [key: string]: any; }, any>) => void;

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

        //view のセット
        this.view = (vnode: CVnode<{ [key: string]: any; }>): Vnode<any, any> => {
            if(typeof vnode.attrs != "undefined") {
                viewInstance.setOptions(vnode.attrs);
            }
            return viewInstance.execute();
        }

        //controller のセット
        if(controllerInstance == null) { return; }

        //oninit
        this.oninit = (vnode: Vnode<{ [key: string]: any }, any>): void => {
            if(typeof vnode.attrs != "undefined") {
                controllerInstance!.setOptions(vnode.attrs); //args のセット
            }
            controllerInstance!.onInit(); //oninit
        }

        //onbeforeupdate
        this.onbeforeupdate = (): boolean => { controllerInstance!.onBeforeUpdate(); return true; }

        //onupdate
        this.onupdate = (): void => { controllerInstance!.onUpdate(); }

        //onremove
        this.onremove = (): void => { controllerInstance!.onRemove(); }
    }

    protected abstract getController(): Controller | null;

    protected abstract getView(): View;

    protected abstract getModels(): { [key: string]: ViewModel } | null;
}

export default Component;

