"use strict";

import Util from '../Util/Util';
import SocketIoManager from './SocketIoManager';

/**
* socketio がサーバから切断された時にページをリロードさせる
*/
namespace SocketIoDisconnect {
    export const init = (): void => {
        let io = SocketIoManager.getInstance().getIo();

        let movePage = false;

        window.onunload = () => {};

        window.onpageshow = (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        };

        window.onbeforeunload = (event) => {
            event = event || window.event;
            movePage = true;
        }

        //切断時
        let busy: Element | null = null;
        io.on('disconnect', () => {
            if(movePage || busy != null) { return; }
            //"接続が切断された
            busy = document.createElement("div");
            busy.setAttribute("style", "width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; background-color: black; opacity: 0.5; z-index: 100000;");
            document.body.appendChild(busy);
        });

        //再接続時 reload
        io.on('reconnect', () => {
            Util.fakeReload();
            if(busy != null) { setTimeout(() => { document.body.removeChild(busy!); busy = null; }, 600);  }
        });
    }
}

export default SocketIoDisconnect;

