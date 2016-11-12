"use strict";

import SocketIoManager from './SocketIoManager';

/**
* socketio がサーバから切断された時にページをリロードさせる
*/
namespace SocketIoDisconnect {
    export const init = (): void => {
        let io = SocketIoManager.getInstance().getIo();

        let connectStatus = true;
        let movePage = false;

        window.onunload = () => {};

        window.onpageshow = (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        };

        window.onbeforeunload = (event) => {
            event = event || window.event;
            connectStatus = true;
            movePage = true;
        }

        //切断時
        io.on('disconnect', () => {
            if(!movePage) {
                //"接続が切断された
                var busy = document.createElement("div");
                busy.setAttribute("style", "width: 100%; height: 100%; position: absolute; left: 0px; top: 0px; background-color: black; opacity: 0.5; z-index: 100000;");
                document.body.appendChild(busy);
            }
            connectStatus = false;
        });

        //再接続時 reload
        io.on('connect', () => {
            if(!connectStatus) { location.reload(true); }
        });
    }
}

export default SocketIoDisconnect;

