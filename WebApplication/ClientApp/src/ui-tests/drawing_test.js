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

/* eslint-disable no-undef */
const noDrawingElement = '.drawingEmptyText';
const locators = require('./elements_definition.js');
const viewCubeElement = '//div[@id="ForgePdfViewer"] //div[@class="viewcubeWrapper"]';

Before((I) => {
    I.amOnPage('/');
});

Feature('Drawing Validation');

// this test checks that Drawing tab displays correct data
// if an assembly has a drawing then the drawing should be displayed
// If there is no drawing or only IPT - no content is displayed
Scenario('should check that Drawing tab shows drawing for an Assembly', async (I) => {

    // select project in the Project Switcher
    I.selectProject('Wheel');

    // click on drawing tab
    I.waitForForgeViewerToPreventItFromCrashing(30);
    I.goToDrawingTab();

    // check the dialog will appear with Ok button
    const drawingProgress = '//p[text()="Generating Drawing"]';
    I.waitForVisible(drawingProgress, 10);
    I.waitForVisible(locators.xpButtonOk, locators.FDAActionTimeout);
    I.click(locators.xpButtonOk);

    // wait for drawing to be displayed
    I.waitForVisible(viewCubeElement, locators.FDAActionTimeout);

});

Scenario('should check if an Assembly do not have any drawings then No data page is displayed', async (I) => {

    // select project in the Project Switcher
    I.selectProject('Wrench');

    // click on drawing tab
    I.waitForForgeViewerToPreventItFromCrashing(30);
    I.goToDrawingTab();

    // wait for no drawing page to be displayed
    I.waitForVisible(noDrawingElement, locators.FDAActionTimeout);
    I.see("You don't have any drawings in package.", noDrawingElement);

});

Scenario('should check id a drawing has more sheet is will show arrow buttons', async (I) => {

    I.signIn();

    I.uploadProject('src/ui-tests/dataset/SimpleBox2asm.zip', 'Assembly1.iam');

    // select project in the Project Switcher
    I.selectProject('SimpleBox2asm');

    // click on drawing tab
    I.waitForForgeViewerToPreventItFromCrashing(30);
    I.goToDrawingTab();

    // check the dialog will appear with Ok button
    const drawingProgress = '//p[text()="Generating Drawing"]';
    I.waitForVisible(drawingProgress, 10);
    I.waitForVisible(locators.xpButtonOk, locators.FDAActionTimeout);
    I.click(locators.xpButtonOk);

    // wait for drawing page to be displayed with extra arrow buttons
    const customDrwToolbar = '//div[@id="custom-drawing-toolbar"]';
    const prevButtonEnabled = '//div[@id="drawing-button-prev" and not(contains(@class,"disabled"))]';
    const nextButtonEnabled = '//div[@id="drawing-button-next" and not(contains(@class,"disabled"))]';
    const prevButtonDisabled = '//div[@id="drawing-button-prev" and contains(@class,"disabled")]';
    const nextButtonDisabled = '//div[@id="drawing-button-next" and contains(@class,"disabled")]';

    I.waitForVisible(customDrwToolbar, locators.FDAActionTimeout);
    I.waitForVisible(prevButtonDisabled, locators.FDAActionTimeout);
    I.waitForVisible(nextButtonEnabled, locators.FDAActionTimeout);

    // show next sheet
    I.click(nextButtonEnabled);

    // check button states
    I.seeElement(prevButtonEnabled);
    I.seeElement(nextButtonEnabled);

    // show next sheet
    I.click(nextButtonEnabled);

    // check button states
    I.seeElement(prevButtonEnabled);
    I.seeElement(nextButtonDisabled);

});

Scenario('should check that IPT do not display any data', async (I) => {

    I.signIn();

    I.uploadIPTFile('src/ui-tests/dataset/EndCap.ipt');

    // select project in the Project Switcher
    I.selectProject('EndCap');

    // click on drawing tab
    I.waitForForgeViewerToPreventItFromCrashing(30);
    I.goToDrawingTab();

    // wait for no drawing page to be displayed
    I.waitForVisible(noDrawingElement, locators.FDAActionTimeout);
    I.see("You don't have any drawings in package.", noDrawingElement);

});

Scenario('Delete the project', (I) => {

    I.signIn();
    I.deleteProject('EndCap');
    I.deleteProject('SimpleBox2asm');
});
