/**
 * Globals for jslint
 */
/*global  window, hitta, jq, Class, HStandardMapProvider*/
hitta.mapPage.Partner = hitta.mapPage.Page.extend({

    activeToolbars: { // initialize with default values
        zoom: true,
        largeZoom: false,
        smallZoom: true,
        controls: false,
        mapMode: true,
        logo: true,
        scale: true
    },


    hidePoiInfoBoxes: false,

    parseUrlFragment: function () {
        this.parseUrlFragment_toolbars();
        this.parseUrlFragment_hide();
        this.parseUrlFragment_show();
    },

    parseUrlFragment_toolbars: function () {
        // Support for URL fragment toolbars=zoom,controls ; only present here for backward compatibility
        if (hitta.hash !== undefined && hitta.hash.toolbars !== undefined) {
            var toolbars = decodeURIComponent(hitta.hash.toolbars).split(',');
            for (var t = 0, len = toolbars.length; t < len; t++) {
                this.activeToolbars[toolbars[t]] = true;
                if (toolbars[t] === "zoom") {
                    this.activeToolbars.largeZoom = true;
                }
            }
        }
    },

    parseUrlFragment_hide: function () {
        // support for URL fragment hide=zoom,controls,mapMode,logo
        if (hitta.hash !== undefined && hitta.hash.hide !== undefined) {
            var hide = decodeURIComponent(hitta.hash.hide).split(',');
            for (var t = 0, len = hide.length; t < len; t++) {
                if (hide[t] === "poiInfoBoxes") {
                    this.hidePoiInfoBoxes = true;
                } else {
                    this.activeToolbars[hide[t]] = false;
                    if (hide[t] === "all") {
                        for (var p in this.activeToolbars) {
                            if (this.activeToolbars.hasOwnProperty(p)) {
                                this.activeToolbars[p] = false;
                            }
                        }
                    }
                }
            }
        }
    },

    parseUrlFragment_show: function () {
        // support for URL fragment show=zoom,controls,mapMode,logo
        if (hitta.hash !== undefined && hitta.hash.show !== undefined) {
            var show = decodeURIComponent(hitta.hash.show).split(',');
            for (var t = 0, len = show.length; t < len; t++) {
                this.activeToolbars[show[t]] = true;
                if (show[t] === "all") {
                    for (var p in this.activeToolbars) {
                        if (this.activeToolbars.hasOwnProperty(p)) {
                            this.activeToolbars[p] = true;
                        }
                    }
                }
            }
        }
    },

    activate: function () {
        var VIEWS = hitta.common.Config.views;
        var MANAGERS = hitta.common.Config.managers;

        var activeViews = [VIEWS.LOGO];
        var activeManagers = [MANAGERS.SEARCH, MANAGERS.STATE, MANAGERS.POI, MANAGERS.TRADE];

        // Set flags in the mapManager (map-manager.js) to specify which components shall be shown/hidden on the map
        this.parseUrlFragment();
        this.mapManager.showZoomToolbar = this.activeToolbars.zoom;
        this.mapManager.hasSmallZoomControl = !this.activeToolbars.largeZoom && this.activeToolbars.smallZoom; // large zoom has precedence over small zoom
        this.mapManager.showMapModeToolbar = this.activeToolbars.mapMode;
        this.mapManager.showLogo = this.activeToolbars.logo;
        this.mapManager.showScale = this.activeToolbars.scale;

        this.mapManager.hideInfoBoxes = this.hidePoiInfoBoxes;

        if (this.activeToolbars.controls) {
            activeManagers.push(MANAGERS.MAP_MODE);
        }

        this.mapManager.activateViews(activeViews);
        this.mapManager.activateManagers(activeManagers);

        this._super();

        if (this.mapManager.panControl !== undefined) {
            this.mapManager.panControl.disable();
        }
    }
});

jq(document).ready(function () {
    var page = new hitta.mapPage.Partner();
    page.activate();
});
