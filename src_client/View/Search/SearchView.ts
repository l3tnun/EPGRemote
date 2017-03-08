"use strict";

import * as m from 'mithril';
import ParentPageView from '../ParentPageView';
import Util from '../../Util/Util';
import Scroll from '../../Util/Scroll';
import SearchViewModel from '../../ViewModel/Search/SearchViewModel';
import SearchOptionComponent from '../../Component/Search/SearchOptionComponent';
import SearchResultComponent from '../../Component/Search/SearchResultComponent';
import SearchAddKeywordComponent from '../../Component/Search/SearchAddKeywordComponent';
import ProgramInfoDialogComponent from '../../Component/Program/ProgramInfoDialogComponent';
import ProgramInfoDialogViewModel from '../../ViewModel/Program/ProgramInfoDialogViewModel';

/**
* Search の View
*/
class SearchView extends ParentPageView {
    private viewModel: SearchViewModel;
    private searchOptionComponent = new SearchOptionComponent();
    private searchResultComponent = new SearchResultComponent();
    private searchAddKeywordComponent = new SearchAddKeywordComponent();
    private programInfoDialogComponent = new ProgramInfoDialogComponent();

    public execute(): Mithril.Vnode<any, any> {
        this.viewModel = <SearchViewModel>this.getModel("SearchViewModel");

        return m("div", { class: "mdl-layout mdl-js-layout mdl-layout--fixed-header" }, [
            //scroll top button
            m("button", { class: "fab-left-bottom mdl-shadow--8dp mdl-button mdl-js-button mdl-button--fab mdl-button--colored",
                onclick: () => {
                    let mainLayout = document.getElementsByClassName("mdl-layout__content")[0];
                    Scroll.scrollTo(mainLayout, mainLayout.scrollTop, 0);
                }
            }, m("i", { class: "material-icons" }, "arrow_upward") ),

            this.createHeader("番組検索"),
            this.createHeaderMenu(),
            this.createNavigation(),

            this.mainLayout([
                m(this.searchOptionComponent),
                m(this.searchResultComponent),
                m(this.searchAddKeywordComponent)
            ],
            (vnode: Mithril.VnodeDOM<any, any>) => {
                //for android
                if(!Util.uaIsAndroid()) { return; }
                (<HTMLElement>(vnode.dom)).style.display = "none";
            }),

            //予約ダイアログ
            m(this.getDialogComponent(ProgramInfoDialogViewModel.infoDialogId), {
                id: ProgramInfoDialogViewModel.infoDialogId,
                width: 400,
                content: m(this.programInfoDialogComponent)
            }),

            //ディスク空き容量ダイアログ
            this.createDiskDialog(),

            //snackbar
            this.createSnackbar()
        ]);
    }
}

export default SearchView;

