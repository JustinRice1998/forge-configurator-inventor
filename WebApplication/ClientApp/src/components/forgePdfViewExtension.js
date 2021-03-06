/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Design Automation team for Inventor
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

const Autodesk = window.Autodesk;

function ForgePdfViewExtension(viewer, options) {
    this.initialized = false;
    Autodesk.Viewing.Extension.call(this, viewer, options);
}

ForgePdfViewExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
ForgePdfViewExtension.prototype.constructor = ForgePdfViewExtension;

ForgePdfViewExtension.prototype.load = function () {

    if (this.viewer.toolbar) {
        // Toolbar is already available, create the UI
        this.createUI();
    } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    }

    return true;
};

ForgePdfViewExtension.prototype.onToolbarCreated = function () {
    this.viewer.removeEventListener(Autodesk.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
    this.onToolbarCreatedBinded = null;
    this.createUI();
};

ForgePdfViewExtension.prototype.createUI = function() {
    if (this.initialized === true)
        return;

    this.initialized = true;
    const viewer = this.viewer;
    const urn = viewer.getState().seedURN;
    const numPages = viewer.model.loader.pdf.numPages;
    let actualPage = 1;

    if (numPages === 1) // skip buttons when only one page is available
        return;

    // prev button
    const prevbutton = new Autodesk.Viewing.UI.Button('drawing-button-prev');
    // next button
    const nextbutton = new Autodesk.Viewing.UI.Button('drawing-button-next');

    // initially disabled prev button on the first page
    prevbutton.setState(Autodesk.Viewing.UI.Button.State.DISABLED);

    prevbutton.onClick = function () {

        actualPage -= 1;
        const state = actualPage === 1 ? Autodesk.Viewing.UI.Button.State.DISABLED : Autodesk.Viewing.UI.Button.State.INACTIVE;

        prevbutton.setState(state);
        nextbutton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);

        viewer.loadModel( urn, { page: actualPage });
    };

    prevbutton.addClass('drawing-button-prev');
    prevbutton.setIcon('drawing-icon-prev');
    prevbutton.setToolTip('Previous Drawing Sheet');

    nextbutton.onClick = function () {

        actualPage += 1;
        const state = actualPage === numPages ? Autodesk.Viewing.UI.Button.State.DISABLED : Autodesk.Viewing.UI.Button.State.INACTIVE;

        prevbutton.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        nextbutton.setState(state);

        viewer.loadModel( urn, { page: actualPage });
    };

    nextbutton.addClass('drawing-button-next');
    nextbutton.setIcon('drawing-icon-next');
    nextbutton.setToolTip('Next Drawing Sheet');

    // SubToolbar
    this.subToolbar = new Autodesk.Viewing.UI.ControlGroup('custom-drawing-toolbar');
    this.subToolbar.addControl(prevbutton);
    this.subToolbar.addControl(nextbutton);

    viewer.toolbar.addControl(this.subToolbar);
};

ForgePdfViewExtension.prototype.unload = function () {
    if (this.subToolbar) {
        this.viewer.toolbar.removeControl(this.subToolbar);
        this.subToolbar = null;
    }
};


Autodesk.Viewing.theExtensionManager.registerExtension('ForgePdfViewExtension', ForgePdfViewExtension);