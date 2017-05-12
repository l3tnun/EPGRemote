"use strict";

import ApiModel from './ApiModel';

abstract class SortCheannelMapApiModel extends ApiModel {
    /**
    * config の channelMapXX に合わせてソートする
    * @param type: GR or BS or CS or EX
    * @param channels: { string: any }[] "channel_disc" が含まれている事が必須
    */
    protected sortChannel(type: string, channels: { string: any }[] ): { string: any }[] {
        let channelMap = this.getChannelMap(type);
        if(channelMap == null) { return channels; }

        //ランク付け
        channels.forEach((channel: { string: any }) => {
            channel["rank"] = channelMap!.length;
            channelMap!.forEach((map, index) => {
                if(channel["channel_disc"] == map) { channel["rank"] = index; }
            });
        });

        //sort
        return channels.sort((a: { string: any }, b: { string: any }) => {
            if( a["rank"] < b["rank"] ) return -1;
            if( a["rank"] > b["rank"] ) return 1;
            return 0;
        });
    }

    private getChannelMap(type: string): string[] | null {
        let channelMap: string[] | null;
        switch (type) {
            case 'GR':
                channelMap = this.config.getConfig().channelMapGR;
                break;
            case 'BS':
                channelMap = this.config.getConfig().channelMapBS;
                break;
            case 'CS':
                channelMap = this.config.getConfig().channelMapCS;
                break;
            case 'EX':
                channelMap = this.config.getConfig().channelMapEX;
                break;
            default:
                channelMap = null;
                break;
        }

        return typeof channelMap == "undefined" ? null : channelMap;
    }
}

export default SortCheannelMapApiModel;

