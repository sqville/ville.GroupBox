/* ************************************************************************

   Copyright:

   License: MIT

   Authors: Chris Eskew (sqville) chris.eskew@sqville.com

************************************************************************ */

/**
 * This is the main application class of your custom application
 *
 * @asset(wax/demo/*)
 */
qx.Class.define("wax.demo.Application",
{
  extend : qx.application.Standalone,

  /*
  *****************************************************************************
    PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    demoMode :
    {
      check : ["desktop", "mobile"],
      init : "desktop"
    }
  },

  /*
  *****************************************************************************
    MEMBERS
  *****************************************************************************
  */

  members :
  {
    _blocker : null,
    
    _northBox : null,
    
    _westBox : null,
    
    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);

      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      // *** Include third party assets *************************************************************************
      // *** Mixin ville.groupbox Appearances and Decorations with current theme
      qx.Theme.include(qx.theme.manager.Appearance.getInstance().getTheme(), ville.groupbox.Appearance);
      qx.Theme.include(qx.theme.manager.Decoration.getInstance().getTheme(), ville.groupbox.Decoration);
      
      // *** START of Base Scaffolding **************************************************************************
      // *** Base Scaffolding are objects common to all Wax - Franklin based apps  ******************************
      // ********************************************************************************************************

      // App's Root
      var approot = this.getRoot();

      // Add a Blocker to the application's root for the Main Menu Popup
      this._blocker = new qx.ui.core.Blocker(approot).set({color: "black", opacity: .08});
      
      // App's main Container (Composite) with Dock Layout 
      var appdocklayout = new qx.ui.layout.Dock(0, 0);
      //appdocklayout.setSort("x");
      var appcompdock = new qx.ui.container.Composite(appdocklayout).set({backgroundColor: "transparent"});
      
      // Dock's North section (Canvas)
      var northhbox = this._northBox = new qx.ui.container.Composite(new qx.ui.layout.Canvas()).set({backgroundColor: "white", decorator : "topheader"});

      // Dock's West section (VBox)
      var westbox = this._westBox = new qx.ui.container.Composite(new qx.ui.layout.VBox(0)).set({backgroundColor: "white", padding: [10,0,10,0], decorator : "leftside"});

      // Dock's Center section (Stack) === THE STACK ===
      var centerbox = new qx.ui.container.Stack().set({backgroundColor: "white", padding: 0});

      // mobile demo mode
      var southbox = new qx.ui.container.Composite(new qx.ui.layout.HBox(4)).set({alignY: "middle", padding: [0,4,0,4], decorator: "bottombar"});

      // West Scroll area to fit all menu items
      var scrollwest = new qx.ui.container.Scroll().set({minWidth: 230, allowStretchX: true, allowStretchY: true, padding: 0, margin: 0, contentPadding: [0,0,0,0]});
      
      // Center Scroll area to fit all content
      var scroll = new qx.ui.container.Scroll().set({padding: 0, margin: 0, contentPadding: [0,0,0,0]});

      // === North Toolbar, Parts and Buttons ===
      var northtoolbar = new qx.ui.toolbar.ToolBar().set({backgroundColor: "white"});
      var mainmenupart = new qx.ui.toolbar.Part(); //Top-Left of the screen 
      var profilepart = new qx.ui.toolbar.Part(); // Top-Right of the screen

      // Top-Left Button
      var mainmenubtnbutton = new qx.ui.toolbar.Button("MainMenu", "wax/demo/round-menu-24px.svg").set({show: "icon"});
      mainmenubtnbutton.getChildControl("icon").set({ width: 24, height: 24 });

      // Top-Right MenuButton
      var profilemenubutton = new qx.ui.toolbar.MenuButton("ProfileMenu", "wax/demo/round-account_circle-24px.svg").set({show: "icon", showArrow: false});
      profilemenubutton.getChildControl("icon").set({ width: 24, height: 24 });
      
      // Main Menu Popup (VBox)
      var mainmenupopup = new qx.ui.popup.Popup().set({allowGrowY: true, padding: 10});
      mainmenupopup.setLayout(new qx.ui.layout.VBox(0));

      // Profile and Settings Menu and Menu Buttons
      var profilemenu = new qx.ui.menu.Menu().set({spacingX: 12});
      
      var switchmenubutton1 = new qx.ui.menu.Button("Switch to Mobile", "wax/demo/mobile_friendly-24px.svg").set({padding: 10});
      switchmenubutton1.getChildControl("icon").set({ width: 24, height: 24 });
      var aboutmenubutton1 = new qx.ui.menu.Button("About Wax", "wax/demo/info-24px.svg").set({padding: 10});
      aboutmenubutton1.getChildControl("icon").set({ width: 24, height: 24 });
      var profilemenubutton1 = new qx.ui.menu.Button("Edit my profile", "wax/demo/edit-24px.svg").set({padding: 10});
      profilemenubutton1.getChildControl("icon").set({ width: 24, height: 24 });
      var settingsmenubutton = new qx.ui.menu.Button("Settings", "wax/demo/outline-settings-24px.svg").set({padding: 10});
      settingsmenubutton.getChildControl("icon").set({ width: 24, height: 24 });
      var logoutmenubutton = new qx.ui.menu.Button("Log out", "wax/demo/exit_to_app-24px.svg").set({padding: 10});
      logoutmenubutton.getChildControl("icon").set({ width: 24, height: 24 });

      // Search Button (hybrid mobile)
      var btnsearchbutton = new qx.ui.toolbar.Button("Search", "wax/demo/baseline-search-24px.svg").set({show: "icon"});

      // Back Button (hybrid mobile)
      var btnbackbutton = new qx.ui.toolbar.Button("Back", "wax/demo/baseline-chevron_left-24px.svg").set({show: "icon"});
      
      // Add Main Menu Popup Listeners
      mainmenubtnbutton.addListener("execute", function(e)
      {
        if (qx.core.Environment.get("browser.name") != "edge"){
          this._blocker.blockContent(mainmenubtnbutton.getZIndex());
        }
        mainmenupopup.show();
      }, this);
      mainmenupopup.addListener("disappear", function(e)
      {
        this._blocker.unblock();
      }, this);

      // Assemble all base pieces  
      scrollwest.add(westbox);
      scroll.add(centerbox);

      appcompdock.add(northhbox, {edge:"north"});
      appcompdock.add(scrollwest, {edge:"west"});
      appcompdock.add(scroll, {edge:"center"});

      approot.add(appcompdock, {edge: 0});
      profilemenu.add(switchmenubutton1);
      profilemenu.add(aboutmenubutton1);
      profilemenu.addSeparator();
      profilemenu.add(profilemenubutton1);
      profilemenu.add(settingsmenubutton);
      profilemenu.add(logoutmenubutton);
      profilemenubutton.setMenu(profilemenu);
  
      //noun_honey_2576471.svg 48x48
      var atmlogocurrentpage = new qx.ui.basic.Atom("wax","wax/demo/Wax_demo_logo.png").set({font: "hym-app-header", gap: 10, padding: 0, visibility: "hidden"}); // paddingLeft: 35
      atmlogocurrentpage.getChildControl("icon").set({ scale: true, width: 48, height: 38 });

      mainmenupart.add(mainmenubtnbutton);
      profilepart.add(profilemenubutton);
      
      //setup northtoolbar for both desktop and mobile, but hide mobile
      northtoolbar.add(mainmenupart);
      northtoolbar.addSpacer();
      northtoolbar.add(atmlogocurrentpage);
      northtoolbar.addSpacer();
      northtoolbar.add(profilepart);
      northhbox.add(northtoolbar, {left: 0, right: 0});

      // mobile demo mode
      appcompdock.add(southbox, {edge: "south"});

      // *** END of Base Scaffolding **********************************************************************

      // Add some simple ease in animation to the app's blocker
      var fadeinb = {duration: 300, timing: "ease", keyFrames : {
        0: {opacity: 0},
        100: {opacity: .08}
        }};

      this._blocker.addListener("blocked", function(e) {
        var domtable;
        if (domtable = this._blocker.getBlockerElement().getDomElement()) {
          qx.bom.element.Animation.animate(domtable, fadeinb);
        }
      }, this);



      // *** Populate THE STACK *********************************************************************************
      // Four page stack EXAMPLE
       // Dashboard Page with Flow layout
       // Overview Page with links to a Detail Page
       // Table to List Page - shows how the Table Widget converts to a List Widget for smaller screens
      // ********************************************************************************************************
      var dashboardpage = new qx.ui.container.Composite().set({padding: 20});
      var overviewpage = new qx.ui.container.Composite(new qx.ui.layout.VBox(20)).set({padding: 20});
      var gallerypage = new qx.ui.container.Composite(new qx.ui.layout.VBox(20)).set({padding: 20});
      var tablelistpage = new qx.ui.container.Composite().set({padding: 20});
      
      //more structure
      dashboardpage.setLayout(new qx.ui.layout.VBox(6).set({alignX: "left"}));
      var dashboardsubpage1 = new qx.ui.container.Composite();
      var dashboardflow = new qx.ui.layout.Flow(16,20,"left");
      dashboardsubpage1.setLayout(dashboardflow);


      // Controls
      // First page marker 
      var label1 = new qx.ui.basic.Label("My Default Dashboard").set({font: "control-header"});
      // GroubBox
      var groupbox1 = new ville.groupbox.GroupBox("First GroupBox", "wax/demo/baseline-directions_subway-24px.svg", true, true, false);
      groupbox1.setLayout(new qx.ui.layout.VBox());
      var piechartimage = new qx.ui.basic.Image("wax/demo/pie_chart-24px.svg").set({scale: true, width: 272, height: 272});

      var groupbox2 = new ville.groupbox.GroupBox("Second GroupBox", "wax/demo/local_airport-24px.svg", true, true, false);
      groupbox2.setLayout(new qx.ui.layout.VBox());

      var groupbox3 = new ville.groupbox.GroupBox("Third GroupBox - with linebreak", "wax/demo/commute-24px.svg", true, true, false);
      groupbox3.setLayout(new qx.ui.layout.VBox());

      var groupbox4 = new ville.groupbox.GroupBox("Forth GroupBox - Flow within a Flow", "wax/demo/local_dining-24px.svg", true, true, false);
      var groupbox4flow = new qx.ui.layout.Flow(6,6,"center");
      groupbox4.setLayout(groupbox4flow);
      groupbox4.set({allowShrinkX: true, allowShrinkY: true, allowGrowX: true, allowGrowY: true}); 
      groupbox4.add(new qx.ui.basic.Image("wax/demo/bar_chart-24px.svg").set({scale: true, width: 222, height: 222}));
      groupbox4.add(new qx.ui.basic.Image("wax/demo/bar_chart-24px.1.svg").set({scale: true, width: 222, height: 222}));
      groupbox4.add(new qx.ui.basic.Image("wax/demo/bar_chart-24px.2.svg").set({scale: true, width: 222, height: 222}));
      groupbox4.add(new qx.ui.basic.Atom("Year over year growth shows how the market favored the bold","wax/demo/bolt-24px.svg").set({rich: true, width: 200, height: 142}));

      var barchartimage = new qx.ui.basic.Image("wax/demo/view_compact-24px.svg").set({scale: true, width: 312, height: 312});
      var bubblechartimage = new qx.ui.basic.Image("wax/demo/bubble_chart-24px.svg").set({scale: true, width: 312, height: 312});
      
      groupbox1.add(piechartimage);
      groupbox1.add(new qx.ui.basic.Label("<b>Results:</b> Half of the pie is divided").set({rich: true}));
      var labelenv = new qx.ui.basic.Label("device.name=" + qx.core.Environment.get("device.name") + "<br>device.type=" + qx.core.Environment.get("device.type") + "<br>browser.name=" + qx.core.Environment.get("browser.name") + "<br>browser.version=" + qx.core.Environment.get("browser.version") + "<br>os.name=" + qx.core.Environment.get("os.name") + "<br>os.version=" + qx.core.Environment.get("os.version") + "<br>engine.name=" + qx.core.Environment.get("engine.name") + "<br>phonegap=" + qx.core.Environment.get("phonegap") + "<br>phonegap.notification=" + qx.core.Environment.get("phonegap.notification") + "<br>runtime.name=" + qx.core.Environment.get("runtime.name")).set({rich: true});
      groupbox2.add(labelenv);
      //groupbox2.add(barchartimage);
      //groupbox2.add(new qx.ui.basic.Label("<b>Overview:</b> Room will be configured in this manner").set({rich: true}));
      groupbox3.add(bubblechartimage);
      groupbox3.add(new qx.ui.basic.Label("<b>Insight:</b> Indicators suggest we go with <span style='color:red;'><b>Red</b></span>").set({rich: true}));

      
      // Assemble
      dashboardpage.add(label1);
      dashboardsubpage1.add(groupbox1);
      dashboardsubpage1.add(groupbox2);
      dashboardsubpage1.add(groupbox3, {lineBreak: true});
      dashboardsubpage1.add(groupbox4, {lineBreak: true, stretch: true});
      
      dashboardpage.add(dashboardsubpage1);


      // Second page marker  
      var label5 = new qx.ui.basic.Label("Actions").set({font: "control-header"});
      var secmidsection = new qx.ui.container.Composite(new qx.ui.layout.HBox(20));
      
      overviewpage.add(label5);
      
      // Do This code
      var secpagegroupbox1 = new ville.groupbox.GroupBox("Do This","", true, true).set({allowStretchX: [true, true], allowStretchY: [false, false], appearance: "ville-groupbox-connected", minWidth: 340});
      secpagegroupbox1.getChildControl("open", true).setMarginRight(20);
      secpagegroupbox1.setLayout(new qx.ui.layout.VBox());
      var secpagegroupbox1contentbox = new qx.ui.container.Composite(new qx.ui.layout.HBox(4)).set({alignY: "middle"});
      secpagegroupbox1contentbox.add(new qx.ui.basic.Label("If you would like to do this. This opens a modal window <b>with</b> a blocker box behind it. Adding more so text will wrap as screen shrinks").set({alignY: "middle", textAlign: "left", rich: true, wrap: true}), {flex: 1});
      secpagegroupbox1contentbox.add(new qx.ui.core.Spacer(30, 20), {flex: 1});
      var btnDoThis = new qx.ui.form.Button("Do This").set({width: 165, height: 40, maxHeight: 40, alignX: "right", alignY: "middle"});
      secpagegroupbox1contentbox.add(btnDoThis);
      secpagegroupbox1.add(secpagegroupbox1contentbox);
      var winDoThis = this.__createDetailWindow();
      winDoThis.set({caption: "Do This", status: "Modal window with a blocker", width: 660, contentPadding: 20});
      //winDoThis.add(new qx.ui.basic.Image("wax/demo/Roxarama-Guy.png"));
      //var wincontrolFlow = qx.ui.container.Composite(new qx.ui.layout.Flow(6,6,"left"));
      winDoThis.add(new qx.ui.basic.Label("<b>Action Name:</b>").set({rich: true}));
      winDoThis.add(new qx.ui.basic.Label(winDoThis.getCaption()).set({marginBottom:18}));
      winDoThis.add(new qx.ui.basic.Label("<b>Summary:</b>").set({rich: true}));
      winDoThis.add(new qx.ui.form.TextField().set({placeholder: "Action summary", marginBottom:18}));
      winDoThis.add(new qx.ui.basic.Label("<b>Details:</b>").set({rich: true}));
      winDoThis.add(new qx.ui.form.TextArea().set({placeholder: "Action details"}));
      var winselectbox01 = new qx.ui.form.SelectBox().set({marginBottom:18, maxWidth: 260});
      winselectbox01.add(new qx.ui.form.ListItem("New"));
      winselectbox01.add(new qx.ui.form.ListItem("In Progress"));
      winselectbox01.add(new qx.ui.form.ListItem("Complete"));
      winselectbox01.add(new qx.ui.form.ListItem("Revoked"));
      winDoThis.add(new qx.ui.basic.Label("<b>Status:</b>").set({rich: true}));
      winDoThis.add(winselectbox01);
      winDoThis.add(new qx.ui.basic.Label("<b>Date:</b>").set({rich: true, width: 175}));
      winDoThis.add(new qx.ui.form.DateField().set({marginBottom:18, maxWidth: 260}));
      winDoThis.add(new qx.ui.basic.Label("<b>Notes:</b>").set({rich: true}));
      winDoThis.add(new qx.ui.form.TextArea());

      var btnUpdatewin = new qx.ui.form.Button("Submit");
      var btnClosewin = new qx.ui.form.Button("Cancel");
      winDoThis.add(new qx.ui.core.Spacer(30, 20), {flex: 1});
      var buttonHBox = new qx.ui.container.Composite(new qx.ui.layout.HBox(10));
      buttonHBox.add(btnUpdatewin, {flex: 1});
      buttonHBox.add(btnClosewin, {flex: 1});
      winDoThis.add(buttonHBox);
      btnDoThis.addListener("execute", function(e) {
        winDoThis.restore();
        if (qx.core.Environment.get("device.type") == "mobile") {
          winDoThis.maximize();
        }
        winDoThis.center();
        winDoThis.show();
      });
      btnClosewin.addListener("execute", function(e) {
        winDoThis.close();
      });

      winDoThis.addListener("appear", function(e) {
        this._blocker.block();
      }, this);
      winDoThis.addListener("disappear", function(e) {
        this._blocker.unblock();
      }, this);
      

      // Do That code
      var secpagegroupbox2 = new ville.groupbox.GroupBox("Do That","", true, true).set({allowStretchX: [true, true], allowStretchY: [false, false], appearance: "ville-groupbox-connected", minWidth: 340});
      secpagegroupbox2.getChildControl("open", true).setMarginRight(20);
      secpagegroupbox2.setLayout(new qx.ui.layout.VBox(20));
      var secpagegroupbox2contentbox = new qx.ui.container.Composite(new qx.ui.layout.HBox(4)).set({alignY: "middle"});
      secpagegroupbox2contentbox.add(new qx.ui.basic.Label("If you would like to do that. That opens a modal window <b>without</b> a blocker box behind it Adding more so text will wrap as screen shrinks").set({alignY: "middle", textAlign: "left", rich: true, wrap: true}), {flex: 1});
      secpagegroupbox2contentbox.add(new qx.ui.core.Spacer(30, 20), {flex: 1});
      var btnDoThat = new qx.ui.form.Button("Do That").set({width: 165, height: 40, maxHeight: 40, alignX: "right", alignY: "middle"});
      secpagegroupbox2contentbox.add(btnDoThat);
      secpagegroupbox2.add(secpagegroupbox2contentbox);
      secpagegroupbox2.add(new qx.ui.basic.Atom("Warning message about doing that.","wax/demo/warning-24px.svg"));

      var winDoThat = this.__createDetailWindow();
      winDoThat.set({caption: "Do That", status: "Modal window without a blocker"});
      winDoThat.add(new qx.ui.basic.Image("wax/demo/Roxarama-Guy.png"));
      var btnClosewinThat = new qx.ui.form.Button("Close Window");
      winDoThat.add(new qx.ui.core.Spacer(30, 20), {flex: 1});
      winDoThat.add(btnClosewinThat);
      btnDoThat.addListener("execute", function(e) {
        winDoThat.restore();
        winDoThat.center();
        winDoThat.show();
      }, this);
      btnClosewinThat.addListener("execute", function(e) {
        winDoThat.close();
      }, this);

      approot.addListener("resize", function(e){
        //console.log("within resize of approot");
        winDoThis.center();
        winDoThat.center();
      }, this);
      
      secmidsection.add(secpagegroupbox1, {width: "50%", flex: 1});
      secmidsection.add(secpagegroupbox2, {width: "50%", flex: 1});

      // All that you did code
      var secpagegroupbox3 = new ville.groupbox.GroupBox("All That You Did","", true, true).set({allowStretchX: [true, true], allowStretchY: [false, false], appearance: "ville-groupbox-connected", minWidth: 340});
      secpagegroupbox3.getChildControl("open", true).setMarginRight(20);
      secpagegroupbox3.setLayout(new qx.ui.layout.VBox(20));
      secpagegroupbox3.add(new qx.ui.basic.Label("Here's a list of all that you did. The table below is just a simple grid rather than a qooxdoo table control. Versatility is the key. There are multiple options for every use case. Adding more so text will wrap as screen shrinks").set({alignY: "middle", textAlign: "left", rich: true, wrap: true}), {flex: 1});
      var secpagegridtable = this.__createGridTable();
      secpagegroupbox3.add(secpagegridtable);

      overviewpage.add(secmidsection);
      overviewpage.add(secpagegroupbox3);

      // Third page marker
      var label6 = new qx.ui.basic.Label("List of Items").set({font: "control-header"});
      //var tablelistflow = new qx.ui.layout.Flow().set({alignY: "bottom", alignX: "left"});
      var tablelistvbox = new qx.ui.layout.VBox();
      //tablelistpage.set({backgroundColor: "yellow"});
      //tablelistpage.setLayout(tablelistflow);
      tablelistpage.setLayout(tablelistvbox);
      tablelistpage.add(label6);
      var tableliststack = new qx.ui.container.Stack().set({ paddingTop: 10, allowGrowY: true});
      var tablelisttable = this.__createTable();
      var tablelistlist = this.__createList();
      tableliststack.add(tablelisttable);
      tableliststack.add(tablelistlist);
      tablelistpage.add(tableliststack, {flex: 1});

      // Gallery Page
      var lblGalleryHeader = new qx.ui.basic.Label("My Default Gallery").set({font: "control-header"});
      gallerypage.add(lblGalleryHeader);
      
      // Gallery Upload control - desktop only
      if (qx.core.Environment.get("device.type") == "desktop"){
        var ctrlUpload = new wax.demo.Upload("Drag and drop, or", "Browse", null);
        ctrlUpload.set({
          height: 120,
          spacing: 20,
          center: true,
          demo : true
        });
        ctrlUpload.getChildControl("message").set({ icon: "wax/demo/cloud_upload-24px.svg", iconPosition: "top", gap: 0});
        gallerypage.add(ctrlUpload);
        var uploaddemorestore = new qx.ui.form.Button("Restore").set({allowGrowX: false});
        uploaddemorestore.addListener("execute", function(){	
          var progressbar = ctrlUpload.getChildControl("progressbar", true);
          progressbar.setValue(0);
        }, this);
        var uploadprogress = new qx.ui.form.Button("+ 10%").set({allowGrowX: false});
        uploadprogress.addListener("execute", function(){	
          var progressbar = ctrlUpload.getChildControl("progressbar", true);
          progressbar.setValue(progressbar.getValue()+10);
        }, this);
        var upldhbox = new qx.ui.container.Composite(new qx.ui.layout.HBox());
        upldhbox.add(uploaddemorestore);
        upldhbox.add(uploadprogress);
        //gallerypage.add(upldhbox);
      };

      // Add Flow of image objects - images are from "resource/wax/demo/gallery" folder
      var gallaryimageflow = new qx.ui.layout.Flow(6,6,"left");
      var gallerygroupboxcars = new ville.groupbox.GroupBox("Cars", "wax/demo/commute-24px.svg", true, true, false);
      gallerygroupboxcars.setLayout(gallaryimageflow);
      gallerygroupboxcars.set({allowShrinkX: true, allowShrinkY: true, allowGrowX: true, allowGrowY: true}); 
      gallerygroupboxcars.add(new qx.ui.basic.Image("wax/demo/gallery/Yellow_Car2.jpg").set({scale: true, width: 420, height: 280}));
      gallerygroupboxcars.add(new qx.ui.basic.Image("wax/demo/gallery/Flame_Car2.jpg").set({scale: true, width: 420, height: 280}));
      
      var gallerygroupboxtrain = new ville.groupbox.GroupBox("Trains", "wax/demo/baseline-directions_subway-24px.svg", true, true, false);
      gallerygroupboxtrain.setLayout(new qx.ui.layout.Flow(6,6,"left"));
      gallerygroupboxtrain.set({allowShrinkX: true, allowShrinkY: true, allowGrowX: true, allowGrowY: true}); 
      gallerygroupboxtrain.add(new qx.ui.basic.Image("wax/demo/gallery/Deep_Train_Bridge_Sky.JPG").set({scale: true, width: 420, height: 280}));
      gallerygroupboxtrain.add(new qx.ui.basic.Image("wax/demo/gallery/Top_Train_Bridge.JPG").set({scale: true, width: 420, height: 280}));
      gallerygroupboxtrain.add(new qx.ui.basic.Image("wax/demo/gallery/Train_Bridge_Close.JPG").set({scale: true, width: 420, height: 280}));
      gallerygroupboxtrain.add(new qx.ui.basic.Image("wax/demo/gallery/Train_Bridge_Close2.JPG").set({scale: true, width: 420, height: 280}));
      gallerygroupboxtrain.add(new qx.ui.basic.Image("wax/demo/gallery/Deep_Train_Bridge.jpg").set({scale: true, width: 280, height: 420}));

      var gallerygroupboxfood = new ville.groupbox.GroupBox("Food", "wax/demo/local_dining-24px.svg", true, true, false);
      gallerygroupboxfood.setLayout(new qx.ui.layout.Flow(6,6,"left"));
      gallerygroupboxfood.set({allowShrinkX: true, allowShrinkY: true, allowGrowX: true, allowGrowY: true}); 
      gallerygroupboxfood.add(new qx.ui.basic.Image("wax/demo/gallery/Vegies2.jpg").set({scale: true, width: 420, height: 280}));

      var gallerygroupboxart = new ville.groupbox.GroupBox("Hand drawn", null, true, true, false);
      gallerygroupboxart.setLayout(new qx.ui.layout.Flow(6,6,"left"));
      gallerygroupboxart.set({allowShrinkX: true, allowShrinkY: true, allowGrowX: true, allowGrowY: true}); 
      gallerygroupboxart.add(new qx.ui.basic.Image("wax/demo/gallery/Crowd_Pressure.png").set({scale: true, width: 420, height: 280}));
      gallerygroupboxart.add(new qx.ui.basic.Image("wax/demo/gallery/Normal_Dude.png").set({scale: true, width: 420, height: 350}));
      gallerygroupboxart.add(new qx.ui.basic.Image("wax/demo/gallery/RoxArms.jpg").set({scale: true}));
      gallerygroupboxart.add(new qx.ui.basic.Image("wax/demo/gallery/Santa_Color-Orig.JPG").set({scale: true, width: 420, height: 306}));
      gallerygroupboxart.add(new qx.ui.basic.Image("wax/demo/gallery/holiday_cheer.JPG").set({scale: true, width: 420, height: 392}));
      gallerygroupboxart.add(new qx.ui.basic.Image("wax/demo/Roxarama-Guy.png").set({scale: true}));

      var gallerygroupboxvideo = new ville.groupbox.GroupBox("Videos", null, true, true, false);
      gallerygroupboxvideo.setLayout(new qx.ui.layout.Flow(6,6,"left"));
      gallerygroupboxvideo.set({allowShrinkX: true, allowShrinkY: true, allowGrowX: true, allowGrowY: true}); 
      gallerygroupboxvideo.add(new qx.ui.basic.Image("wax/demo/gallery/movie1.jpg").set({scale: true}));
    
      
      gallerypage.add(gallerygroupboxcars);
      gallerypage.add(gallerygroupboxtrain);
      gallerypage.add(gallerygroupboxfood);
      gallerypage.add(gallerygroupboxart);
      gallerypage.add(gallerygroupboxvideo);

      // Menu Page for demo mode = "mobile"
      var menupage = new qx.ui.container.Composite(new qx.ui.layout.VBox(10, null, "separator-vertical")).set({padding: [60, 0, 0, 0]});
      var btnAbout = new qx.ui.form.Button("About Wax", "wax/demo/info-24px.svg").set({appearance : "hym-page-button"});
      var btnSwitchBack = new qx.ui.form.Button("Switch to Desktop", "wax/demo/desktop_windows-24px.svg").set({appearance : "hym-page-button"});
      var btnProfile = new qx.ui.form.Button("Profile", "wax/demo/edit-24px.svg").set({appearance : "hym-page-button"});
      //btnProfile.getLayoutParent().add(new qx.ui.core.Spacer());
      var btnSettings = new qx.ui.form.Button("Settings", "wax/demo/outline-settings-24px.svg").set({appearance : "hym-page-button"});
      //var btnSupport = new wax.demo.MenuButton("Support", "wax/demo/assignment_returned-24px.svg", false);
      var btnLogout = new qx.ui.form.Button("Logout", "wax/demo/exit_to_app-24px.svg").set({appearance : "hym-page-button"});
      menupage.add(new qx.ui.basic.Label("WAX DEMO").set({paddingLeft: 20, textColor: "gray"}));
      menupage.add(btnSwitchBack);
      menupage.add(btnAbout);
      menupage.add(new qx.ui.basic.Label("ADDITIONAL FEATURES").set({paddingLeft: 20, paddingTop: 38, textColor: "gray"}));
      menupage.add(btnProfile);
      menupage.add(btnSettings);
      menupage.add(btnLogout);
      
      //create About Wax popup window
      var winAboutWax = this.__createDetailWindow();

      winAboutWax.getLayout().set({spacing: 20});
      winAboutWax.set({caption: "About Wax", contentPadding: 24, status: "Github repo coming soon"});
      var txtaboutwax = "Wax aims to be a rapid application development and prototyping tool/system. There's a spectrum of rapid-app-dev tools (or low-code tools) - Outsystems, Appian and Ionic on the high-end, Foundation, Gatsbyjs and SemanticUI on the other. Wax is currently not yet on this spectrum, but it does have an approach and supporting assets to begin the process of becoming a highly effective and useful app-dev/app-prototyping asset.<br><br><br>";
      txtaboutwax += "<span style='font-size: 16px;'>THE APPROACH (so far):</span><br><br>";
      txtaboutwax += "<b>Build Qooxdoo skeletons (and lots of them) that function on multiple devices or use case scenarios.</b> A typical use case - After meeting with the client and gathering initial requirements, the prototype developer generates an application using a skeleton (chosen from a long list of skeletons) that best meets the initial requirements. Just like website templates found on the web, Qooxdoo skeletons would encompass enough functionality to help produce a high fidelity prototype in a matter of a few days. There is the potential that a skeleton could also include mock data (json) and non-Qooxdoo scripts to set up a cloud backend (not yet proven out). Skeletons could even include non-Qooxdoo templates for native mobile frameworks such as React Native, Flutter and Felgo (easy to do since skeleton templates are just static files with mustache-like tags).<br><br>";
      txtaboutwax += "<b>Cut and paste components from a well-stocked and possibly specially-tailored demo browser application.</b> Just as we do today, we cut and paste code from examples into our apps. Properly constructed skeletons and documented demos could facilitate the rapid integration of components into any application (not yet proven out). Wax skeletons, and resulting applications would be divided out logically into three areas: Scaffolding, Wiring and Appearance. Scaffolding includes object creation, placement and initial configuration. Wiring involves application flow (mostly via event listener creation and assignment). Appearance is simple look and feel via theming and animations. Skeletons would include an appropriate amount of Appearance and animation code, but when the goal is to rapidly produce a high fidelity prototype Scaffolding and Wiring would be the top focus.<br><br>";
      txtaboutwax += "<b>Use other frameworks for native mobile applications, and sync changes made in the main Qooxdoo app with the produced (from a skeleton) native mobile framework project.</b> Converting Qooxdoo produced code to React Native code, for example, is relatively easy. Object hierarchy is taken from getObjectRegistry method of the Application (taken from Inspector application). UI objects and their properties can be easily mapped and organized (proven out to a small degree). The difficult part is how to best get the changes to (and from) the native mobile project. Using qooxdoo compiler would be ideal, but the compiler does not have access to the apps object hierarchy. The approach Wax would take is to mimic the manual means of producing code. The manual means goes something like this: Include InspectorModel.js file in a project. Add a control (Button) to execute the reading of the ObjectRegistry and translation to the target framework. Write the translation to the console (or a TextArea object). Cut and paste resulting code to the other project.  A more automated approach would be to include an Electronjs project/app in the skeleton for the user to run at any given time. Electronjs would then sync the resulting translation to the target native mobile project. This Electronjs, automated approach has not yet been proven out.<br><br><br>";
      txtaboutwax += "<span style='font-size: 16px;'>CONCLUSION:</span><br><br>";
      txtaboutwax += "Is Wax, or even the concept of Wax, a worthwhile endeavor? Can the needed productivity gains be met in order to call itself a rapid app-dev tool? Is the noted approach the right way forward? It completely leaves out any type of changes being made, or needed, to qooxdoo compiler. Red flag, or just using the simplest approach is the best approach, approach? This is all a head-scratcher for sure. Too many unknowns without enough time. Welcome to software solution development :-)<br><br><br>";
      txtaboutwax += "<span style='font-size: 16px;'>SPECIAL NOTE:</span><br><br>";
      txtaboutwax += "Skeletons and the demo browser are not new concepts to Qooxdoo. These features have been around since the beginning. The purpose of this writeup is to convey good-intent, thoughts and ideas on how to improve peoples work lives, and not meant to be critical or take credit for anything in anyway. The past and current qooxdoo core team have done, and are doing, phenomenal work. My thanks go out to them for making me look better than I really am - Cheers.";
      //var aboutbox = new qx.ui.container.Composite(new qx.ui.layout.VBox(10));
      var aboutscroll = new qx.ui.container.Scroll().set({ allowStretchY: true, padding: 0, margin: 0, contentPadding: [0,0,0,0]});
      var waxatom = new qx.ui.basic.Atom(txtaboutwax,"wax/demo/ville_Wax.png").set({rich: true, iconPosition: "top", gap: 30, paddingTop: 30});
      waxatom.getChildControl("icon").set({scale: true, width: 300, height: 106});
      waxatom.getChildControl("label").set({wrap: true});
      aboutscroll.add(waxatom);

      winAboutWax.add(aboutscroll, {flex:1});
      var btnClosewinAbout = new qx.ui.form.Button("Close Window").set({maxWidth: 300, alignX: "center"});
      //winAboutWax.add(new qx.ui.core.Spacer(30, 20), {flex: 1});
      winAboutWax.add(btnClosewinAbout);
      /*winAboutWax.addListener("execute", function(e) {
        winAboutWax.restore();
        winAboutWax.center();
        winAboutWax.show();
      }, this);*/
      btnClosewinAbout.addListener("execute", function(e) {
        winAboutWax.close();
      }, this);

      approot.addListener("resize", function(e){
        //console.log("within resize of approot");
        winAboutWax.center();
        winAboutWax.center();
      }, this);

      btnAbout.addListener("execute", function(e) {
        winAboutWax.restore();
        winAboutWax.maximize();
        winAboutWax.center();
        winAboutWax.show();
      }, this);

      aboutmenubutton1.addListener("execute", function(e) {
        winAboutWax.restore();
        winAboutWax.maximize();
        winAboutWax.center();
        winAboutWax.show();
      }, this);


      
      // Assemble - THE STACK 
      centerbox.add(dashboardpage);
      centerbox.add(overviewpage);
      centerbox.add(tablelistpage);
      centerbox.add(gallerypage);
      centerbox.add(menupage);

      // Show the default page
      centerbox.setSelection([dashboardpage]);

      // *** END of THE STACK ****************************************************************************************

      
      // *** Populate the Main Menu and Popup Main Menu with content *************************************************
      // Create Menu Buttons that will navigate the user through THE STACK Pages 
    
      // Populate westBox with content
      var atmleftnavheader = new qx.ui.basic.Atom("Wax Demo", "wax/demo/Wax_demo_logo.png").set({appearance: "header-atom", anonymous: true, focusable: false, selectable: false });
      atmleftnavheader.getChildControl("icon").set({ scale : true });
      westbox.add(atmleftnavheader);
      var tbtndashboardpage = new wax.demo.MenuButton("Dashboards", "wax/demo/dashboard-24px.svg", true );
      westbox.add(tbtndashboardpage);

      var tbtnSecondPage = new wax.demo.MenuButton("Actions", "wax/demo/assignment_returned-24px.svg", true);
      var btnSubSecondpage = new qx.ui.form.Button("Do This").set({ appearance: "submenubutton", allowGrowX: true, padding: [10,4,14,60], visibility: "excluded"});
      var btnSubSecondpage2 = new qx.ui.form.Button("Do That").set({ appearance: "submenubutton", allowGrowX: true, padding: [10,4,14,60], visibility: "excluded"});
      westbox.add(tbtnSecondPage);
      westbox.add(btnSubSecondpage);
      westbox.add(btnSubSecondpage2);

      btnSubSecondpage.addListener("execute", function(e) {
        winDoThis.restore();
        winDoThis.maximize();
        winDoThis.center();
        winDoThis.show();
      });

      var tbtnThirdPage = new wax.demo.MenuButton("List of Items", "wax/demo/view_list-24px.svg", true);
      westbox.add(tbtnThirdPage);

      var tbtnGalleryPage = new wax.demo.MenuButton("Gallery", "wax/demo/camera-24px.svg", true, "14" );
      westbox.add(tbtnGalleryPage);

      var westboxbuttongroup = new qx.ui.form.RadioGroup();
      westboxbuttongroup.add(tbtndashboardpage, tbtnSecondPage, tbtnThirdPage, tbtnGalleryPage);
      
      // CLONE the above controls
      var atmmenuleftnavheader = atmleftnavheader.clone();
      atmmenuleftnavheader.getChildControl("icon").set({ scale : true });
      var tbtnmenudashboardpage = tbtndashboardpage.clone();
      tbtnmenudashboardpage.getChildControl("icon").set({ scale : true });
      var tbtnmenuSecondPage = tbtnSecondPage.clone();
      tbtnmenuSecondPage.getChildControl("icon").set({ scale : true });
      var btnsubmenusubsecondpage = btnSubSecondpage.clone();
      btnsubmenusubsecondpage.getChildControl("icon").set({ scale : true });
      var btnsubmenusubsecondpage2 = btnSubSecondpage2.clone();
      btnsubmenusubsecondpage.set({visibility: "visible", decorator: "mainmenubutton-box"});
      btnsubmenusubsecondpage2.set({visibility: "visible", decorator: "mainmenubutton-box"});
      var tbtnmenuThirdPage = tbtnThirdPage.clone();
      tbtnmenuThirdPage.getChildControl("icon").set({ scale : true });
      var tbtnmenuGalleryPage = tbtnGalleryPage.clone();
      // Add the clones to the Main Menu Popup
      mainmenupopup.add(atmmenuleftnavheader);
      mainmenupopup.add(tbtnmenudashboardpage);
      mainmenupopup.add(tbtnmenuSecondPage);
      mainmenupopup.add(btnsubmenusubsecondpage);
      mainmenupopup.add(btnsubmenusubsecondpage2);
      mainmenupopup.add(tbtnmenuThirdPage);
      mainmenupopup.add(tbtnmenuGalleryPage);

      btnsubmenusubsecondpage.addListener("execute", function(e) {
        mainmenupopup.hide();
        winDoThis.maximize();
        winDoThis.center();
        winDoThis.show();
      });

      // Assign all the clones their own RadioGroup
      var mainmenubuttongroup = new qx.ui.form.RadioGroup();
      mainmenubuttongroup.add(tbtnmenudashboardpage, tbtnmenuSecondPage, tbtnmenuThirdPage, tbtnmenuGalleryPage);
      
      //***  CODE for applying popup fading in and out  ***//
      var fadeinleft = {duration: 300, timing: "ease-out", origin: "left top", keyFrames : {
        0: {opacity: 0, left: "-300px"},
        100: {opacity: 1, left: "0px"}
        }};

      mainmenupopup.addListener("appear", function(e) {
        var domtable = mainmenupopup.getContentElement().getDomElement();
        qx.bom.element.Animation.animate(domtable, fadeinleft);
      }, this);

      // *** END of Main Menu and Main Menu Popup *********************************************************
    

      // mobile demo mode - Populate southbox with content
      var tbtndashboardpagehym = new wax.demo.MenuButton("Dashboards", "wax/demo/dashboard-24px.svg", true ).set({appearance: "mainmenubutton-hym", iconPosition: "top"});
      var tbtnoverviewpagehym = new wax.demo.MenuButton("Actions", "wax/demo/assignment_returned-24px.svg", true).set({appearance: "mainmenubutton-hym", iconPosition: "top"});
      var tbtnlistofitemspagehym = new wax.demo.MenuButton("List of Items", "wax/demo/view_list-24px.svg", true).set({appearance: "mainmenubutton-hym", iconPosition: "top"});
      var tbtngallerypagehym = new wax.demo.MenuButton("Gallery", "wax/demo/camera-24px.svg", true).set({appearance: "mainmenubutton-hym", iconPosition: "top"});
      var tbtnmenuhym = new wax.demo.MenuButton("Menu", "wax/demo/round-menu-24px.svg", true).set({appearance: "mainmenubutton-hym", iconPosition: "top"});
      southbox.add(tbtndashboardpagehym, {flex: 1});
      southbox.add(tbtnoverviewpagehym, {flex: 1});
      southbox.add(tbtnlistofitemspagehym, {flex: 1});
      southbox.add(tbtngallerypagehym, {flex: 1});
      southbox.add(tbtnmenuhym, {flex: 1});

      southbox.setVisibility("excluded");

      // Assign all the clones their own RadioGroup
      var mainmenubuttongrouphym = new qx.ui.form.RadioGroup();
      mainmenubuttongrouphym.add(tbtndashboardpagehym, tbtnoverviewpagehym, tbtnlistofitemspagehym, tbtngallerypagehym, tbtnmenuhym);

      // *** END of Hybrid Mobil (hym) Main Menu and Main Menu Popup ****************************************************************


      // *** Wire all the Main Menu Buttons to THE STACK Pages (via Listeners) ******************************************************
      // Turn on all MenuButton listeners
      tbtndashboardpage.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([dashboardpage]);
          mainmenubuttongroup.setSelection([tbtnmenudashboardpage]);
        }
      }, this);

      tbtnSecondPage.addListener("changeValue", function(e) {
        if (e.getData()) {
          btnSubSecondpage.setVisibility("visible");
          btnSubSecondpage2.setVisibility("visible");
          centerbox.setSelection([overviewpage]);
          mainmenubuttongroup.setSelection([tbtnmenuSecondPage]);
          btnsubmenusubsecondpage.set({ decorator: "mainmenubutton-box-pressed"});
          btnsubmenusubsecondpage2.set({ decorator: "mainmenubutton-box-pressed"});
        } else {
          btnSubSecondpage.setVisibility("excluded");
          btnSubSecondpage2.setVisibility("excluded");
        }
      }, this);

      tbtnThirdPage.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([tablelistpage]);
          mainmenubuttongroup.setSelection([tbtnmenuThirdPage]);
        }
      }, this);

      tbtnGalleryPage.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([gallerypage]);
          mainmenubuttongroup.setSelection([tbtnmenuGalleryPage]);
        }
      }, this);

      // Popup menu buttons
      tbtnmenudashboardpage.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([dashboardpage]);
          westboxbuttongroup.setSelection([tbtndashboardpage]);
          btnsubmenusubsecondpage.set({ decorator: "mainmenubutton-box" });
          btnsubmenusubsecondpage2.set({ decorator: "mainmenubutton-box" });
          mainmenupopup.hide();
        }
      }, this);

      tbtnmenuSecondPage.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([overviewpage]);
          westboxbuttongroup.setSelection([tbtnSecondPage]);
          btnsubmenusubsecondpage.set({ decorator: "mainmenubutton-box-pressed" });
          btnsubmenusubsecondpage2.set({ decorator: "mainmenubutton-box-pressed" });

          dashboardpage.setVisibility("excluded");

          mainmenupopup.hide();
        }
      }, this);

      tbtnmenuThirdPage.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([tablelistpage]);
          westboxbuttongroup.setSelection([tbtnThirdPage]);
          btnsubmenusubsecondpage.set({ decorator: "mainmenubutton-box" });
          btnsubmenusubsecondpage2.set({ decorator: "mainmenubutton-box" });

          dashboardpage.setVisibility("excluded");

          mainmenupopup.hide();
        }
      }, this);

      tbtnmenuGalleryPage.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([gallerypage]);
          westboxbuttongroup.setSelection([tbtnGalleryPage]);
          btnsubmenusubsecondpage.set({ decorator: "mainmenubutton-box" });
          btnsubmenusubsecondpage2.set({ decorator: "mainmenubutton-box" });

          dashboardpage.setVisibility("excluded");

          mainmenupopup.hide();
        }
      }, this);

      // if Hybrid Mobile
      tbtndashboardpagehym.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([dashboardpage]);
          atmlogocurrentpage.set({label:"Dashboard"});
        }
      }, this);

      tbtnoverviewpagehym.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([overviewpage]);
          atmlogocurrentpage.set({label:"Actions"});
        }
      }, this);

      tbtnlistofitemspagehym.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([tablelistpage]);
          atmlogocurrentpage.set({label:"Table List"});
        }
      }, this);

      tbtngallerypagehym.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([gallerypage]);
          atmlogocurrentpage.set({label:"Gallery"});
        }
      }, this);

      tbtnmenuhym.addListener("changeValue", function(e) {
        if (e.getData()) {
          centerbox.setSelection([menupage]);
          atmlogocurrentpage.set({label:"Menu"});
        }
      }, this);

      // Demo mode switching to Mobile
      switchmenubutton1.addListener("execute", function(e){
        this.setDemoMode("mobile");
        southbox.setVisibility("visible");
        scrollwest.setVisibility("excluded");
        profilemenubutton.setVisibility("hidden");
        mainmenupart.setVisibility("hidden");
        centerbox.setSelection([menupage]);
        atmlogocurrentpage.set({visibility: "visible", label:"Menu"});
        mainmenubuttongrouphym.setSelection([tbtnmenuhym]);
      //mainmenupart.add(btnbackbutton);    
        //profilepart.add(btnsearchbutton);
      }, this);

      btnSwitchBack.addListener("execute", function(e){
        this.setDemoMode("desktop");
        southbox.setVisibility("excluded");
        profilemenubutton.setVisibility("visible");
        atmlogocurrentpage.setVisibility("hidden");
        mainmenupart.setVisibility("visible");
        centerbox.setSelection([dashboardpage]);
        mainmenubuttongroup.setSelection([tbtnmenudashboardpage]);
        westboxbuttongroup.setSelection([tbtndashboardpage]);
        //btnsearchbutton.setVisibility("excluded");
      }, this);


      // *** END of Wiring ************************************************************************************

      
      // ====================================
      // =======  MediaQuery code  ========== 
      // ====================================

      var mq1 = new qx.bom.MediaQuery("screen and (min-width: 1024px)");

      mq1.on("change", function(e){
        if(mq1.isMatching() && this.getDemoMode()=="desktop"){
          scrollwest.setVisibility("visible"); 
          mainmenupart.setVisibility("excluded");
        }
        else {
          scrollwest.addListener("appear", function(e) {
            var domtable = scrollwest.getContentElement().getDomElement();
            qx.bom.element.Animation.animate(domtable, fadeinleft);
          }, this); 
          scrollwest.setVisibility("excluded");
          if (this.getDemoMode() == "desktop")
            mainmenupart.setVisibility("visible");
          winDoThat.center();
        }
      }, this);
      if (mq1.isMatching()) {
        scrollwest.setVisibility("visible"); 
        mainmenupart.setVisibility("excluded");
      }
      else {
        scrollwest.addListener("appear", function(e) {
          var domtable = scrollwest.getContentElement().getDomElement();
          qx.bom.element.Animation.animate(domtable, fadeinleft);
        }, this); 
        scrollwest.setVisibility("excluded"); 
        mainmenupart.setVisibility("visible");
      }

      var mq2 = new qx.bom.MediaQuery("screen and (min-width: 767px)");

      mq2.on("change", function(e){
        if(mq2.isMatching() && this.getDemoMode()=="desktop"){
          tableliststack.setSelection([tablelisttable]);
          secmidsection.setLayout(new qx.ui.layout.HBox(20));
          secpagegridtable.getLayout().setColumnFlex(2, 1);
          secpagegridtable.getLayout().setColumnFlex(3, 1);
          secpagegridtable.getLayout().setColumnFlex(4, 1);
        }
        else {
          tableliststack.setSelection([tablelistlist]);
          secmidsection.setLayout(new qx.ui.layout.VBox(20));
          secpagegridtable.getLayout().setColumnFlex(2, 0);
          secpagegridtable.getLayout().setColumnWidth(2, 0);
          secpagegridtable.getLayout().setColumnFlex(3, 0);
          secpagegridtable.getLayout().setColumnWidth(3, 0);
          secpagegridtable.getLayout().setColumnFlex(4, 0);
          secpagegridtable.getLayout().setColumnWidth(4, 0);
        }
      }, this);
      if (mq2.isMatching()) {
        tableliststack.setSelection([tablelisttable]);
        secmidsection.setLayout(new qx.ui.layout.HBox(20));
      }
      else {
        tableliststack.setSelection([tablelistlist]);
        secmidsection.setLayout(new qx.ui.layout.VBox(20));
        secpagegridtable.getLayout().setColumnFlex(2, 0);
        secpagegridtable.getLayout().setColumnWidth(2, 0);
        secpagegridtable.getLayout().setColumnFlex(3, 0);
        secpagegridtable.getLayout().setColumnWidth(3, 0);
        secpagegridtable.getLayout().setColumnFlex(4, 0);
        secpagegridtable.getLayout().setColumnWidth(4, 0);
      }

  
      // ====================================
      // =====  Device Targetted code  ======
      // ====================================
     

      // mobile
      if (qx.core.Environment.get("device.type") == "mobile"){
        
        // No need for the west scroll area (main menu) in mobile
        scrollwest.setVisibility("excluded");

        // This addresses the scroll bouncing in: 
        //  - Chrome for Android
        var dsktopstylsheet = qx.ui.style.Stylesheet.getInstance();
        dsktopstylsheet.addRule("html", "overscroll-behavior : none none;");
        dsktopstylsheet.addRule("body", "overscroll-behavior : none none;");


        // Set the body tag's position to prevent scroll bouncing (and pull down refresh) in:
        //  - Safari for iOS
        //      - Edge for iOS (same as above browser now)
        //  - FireFox for iOS
        document.body.style.position = "fixed";

        // TODO *Need solution to address scroll bouncing in:
        //   - Chrome for iOS

        // App still bounces in Landscape; Locking screen to portrait where API is available
        // https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation
       // screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;
       // screen.lockOrientationUniversal("portrait");

        // Fix approot's position
        //approot.getContentElement().setStyle("position", "fixed");
        
      }

      // phonegap
      if (qx.core.Environment.get("phonegap")) {
        // build out south bar
      }
    },

    // property apply
    /***********************************************************
      PROPERTY APPLIES
    ************************************************************/
   //none

    /**********************************************************
      INTERNAL METHODS
    **********************************************************/
    __createGridTable : function()
    {
      var container = new qx.ui.container.Composite();
      var layout = new qx.ui.layout.Grid();
      layout.setColumnFlex(0, 1);
      layout.setColumnFlex(1, 1);
      layout.setColumnFlex(2, 1);
      layout.setColumnFlex(3, 1);
      layout.setColumnFlex(4, 1);
      layout.setColumnFlex(5, 1);
      //layout.setRowFlex(1, 3);
      layout.setSpacing(10);
      container.setLayout(layout);

      // Table Headers
      container.add(new qx.ui.basic.Label("Action").set({font: "default-bold"}), {row: 0, column: 0});
      container.add(new qx.ui.basic.Label("Header02").set({font: "default-bold"}), {row: 0, column: 1});
      container.add(new qx.ui.basic.Label("Header03").set({font: "default-bold"}), {row: 0, column: 2});
      container.add(new qx.ui.basic.Label("Header04").set({font: "default-bold"}), {row: 0, column: 3});
      container.add(new qx.ui.basic.Label("Header05").set({font: "default-bold"}), {row: 0, column: 4});
      container.add(new qx.ui.basic.Label("Revoke").set({font: "default-bold"}), {row: 0, column: 5});

      // Table Row 01
      container.add(new qx.ui.basic.Label("Did This"), {row: 1, column: 0});
      container.add(new qx.ui.basic.Label("Row01Column02"), {row: 1, column: 1});
      container.add(new qx.ui.basic.Label("Row01Column03"), {row: 1, column: 2});
      container.add(new qx.ui.basic.Label("Row01Column04"), {row: 1, column: 3});
      container.add(new qx.ui.basic.Label("Row01Column05"), {row: 1, column: 4});
      container.add(new qx.ui.basic.Image("wax/demo/cancel-24px.svg").set({opacity : .3, width: 24, height: 24}), {row: 1, column: 5});

      // Table Row 02
      container.add(new qx.ui.basic.Label("Did That"), {row: 2, column: 0});
      container.add(new qx.ui.basic.Label("Row02Column02"), {row: 2, column: 1});
      container.add(new qx.ui.basic.Label("Row02Column03"), {row: 2, column: 2});
      container.add(new qx.ui.basic.Label("Row02Column04"), {row: 2, column: 3});
      container.add(new qx.ui.basic.Label("Row02Column05"), {row: 2, column: 4});
      container.add(new qx.ui.basic.Image("wax/demo/cancel-24px.svg").set({opacity : .3, width: 24, height: 24}), {row: 2, column: 5});

      return container;
    },

    __createTable : function()
    { 
      //Get the raw data
      var rowData = this.__createrowData();

      //Create the data (table) model
      var tableModel = new qx.ui.table.model.Simple();
      tableModel.setColumns([ "", "Status", "Item ID", "Project", "Date Submitted" ]);
      tableModel.setData(rowData);

      tableModel.setColumnEditable(1, false);
      tableModel.setColumnEditable(2, false);
      tableModel.setColumnSortable(0, false);
      tableModel.setColumnSortable(5, false);

      //Create a table view for the model
      var table = new qx.ui.table.Table(tableModel);
      table.set({
        allowStretchY: true,
        allowStretchX: true,
        rowHeight: 30,
        showCellFocusIndicator: false,
        focusCellOnPointerMove : true,
        forceLineHeight: true
      });

      var imgrenderer = new qx.ui.table.cellrenderer.Image(24,24);
      table.getTableColumnModel().setDataCellRenderer(0, imgrenderer);

      table.getSelectionModel().setSelectionMode(qx.ui.table.selection.Model.MULTIPLE_INTERVAL_SELECTION);

      var tcm = table.getTableColumnModel();
      tcm.setColumnWidth(0,40);
      tcm.setColumnWidth(1,95);
      tcm.setColumnWidth(2,100);
      tcm.setColumnWidth(3,215);
      tcm.setColumnWidth(4,130);

      return table;
    },

    __createList : function()
    { 
      var rowData = this.__createrowData();

      var listvbox = new qx.ui.layout.VBox(4, null, "separator-vertical");
      var listctrl = new qx.ui.container.Composite(listvbox);

      for (var i in rowData) {
        var groupbox1 = new ville.groupbox.GroupBox(rowData[i][3], rowData[i][0], true, false);
        groupbox1.setLayout(new qx.ui.layout.VBox(4));
        groupbox1.add(new qx.ui.basic.Label("<b>Status:</b> " + rowData[i][1]).set({rich: true}));
        groupbox1.add(new qx.ui.basic.Label("<b>Item ID:</b> " + rowData[i][2]).set({rich: true}));
        groupbox1.add(new qx.ui.basic.Label("<b>Date Submitted:</b> " + rowData[i][4]).set({rich: true}));

        listctrl.add(groupbox1);
      }
    
      return listctrl;
    },

    __createrowData : function()
    {
      var rowData = [];
      var now = new Date().getTime();
      var date;
      var dateRange = 400 * 24 * 60 * 60 * 1000; // 400 days
      
      date = new Date(now + Math.random() * dateRange - dateRange / 2);
      rowData.push([ "wax/demo/round-check_circle_outline-24px.svg", "Completed", "001007222", "This Core", date ]);
      date = new Date(now + Math.random() * dateRange - dateRange / 2);
      rowData.push([ "wax/demo/round-check_circle_outline-24px.svg", "Completed", "002009333", "That Core", date ]);
      date = new Date(now + Math.random() * dateRange - dateRange / 2);
      rowData.push([ "wax/demo/round-check_circle_outline-24px.svg", "Completed", "003002777", "DTDT", date ]);
      date = new Date(now + Math.random() * dateRange - dateRange / 2);
      rowData.push([ "wax/demo/round-check_circle_outline-24px.svg", "Completed", "004074555", "eThis Modernization", date ]);
      date = new Date(now + Math.random() * dateRange - dateRange / 2);
      rowData.push([ "wax/demo/round-sync-24px.svg", "In Progress", "005111888", "eThat Modernization", date ]);
      date = new Date(now + Math.random() * dateRange - dateRange / 2);
      rowData.push([ "wax/demo/round-sync-24px.svg", "In Progress", "006003662", "eThis eThat Integration", date ]);

      return rowData;
    },

    __createDetailWindow : function()
    {
      // Create the Window
      var win = new qx.ui.window.Window("Generic Window").set({ appearance: "wax-window", allowMaximize : true, allowMinimize : false, modal: true, movable: true });
      win.setLayout(new qx.ui.layout.VBox(4));
      win.setShowStatusbar(true);
      win.setStatus("Generic Message"); 
      win.getChildControl("title").set({padding: [10,0,0,10]});

      return win;
    }

  }
});
