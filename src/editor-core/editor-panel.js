var Ipc=require("ipc"),BrowserWindow=require("browser-window"),Panel={},_panel2windows={},_panel2argv={};Panel.templateUrl="editor://static/window.html",_dock=function(a,b){var c=_panel2windows[a];_panel2windows[a]=b},_undock=function(a){var b=_panel2windows[a];return b?(b.sendToPage("panel:undock",a),delete _panel2windows[a],b):null},Panel.open=function(a,b,c){_panel2argv[a]=c;var d=Panel.findWindow(a);if(d)return Editor.sendToPanel(a,"panel:open",c),d.show(),void d.focus();var e="editor-window-"+(new Date).getTime(),f={"use-content-size":!0,width:parseInt(b.width),height:parseInt(b.height),"min-width":parseInt(b["min-width"]),"min-height":parseInt(b["min-height"]),"max-width":parseInt(b["max-width"]),"max-height":parseInt(b["max-height"])},g=Editor.loadProfile("layout."+a,"local");if(g){if(g.window&&(e=g.window),d=Editor.Window.find(e))return;f.x=parseInt(g.x),f.y=parseInt(g.y),f.width=parseInt(g.width),f.height=parseInt(g.height)}var h=b.type||"dockable";switch(b.type){case"dockable":f.resizable=!0,f["always-on-top"]=!1;break;case"float":f.resizable=!0,f["always-on-top"]=!0;break;case"fixed-size":f.resizable=!1,f["always-on-top"]=!0,f.width=parseInt(b.width),f.height=parseInt(b.height);break;case"quick":f.resizable=!0,f["always-on-top"]=!0,f["close-when-blur"]=!0}isNaN(f.width)&&(f.width=800),isNaN(f.height)&&(f.height=600),d=new Editor.Window(e,f),_dock(a,d),d.nativeWin.setContentSize(f.width,f.height),d.nativeWin.setMenuBarVisibility(!1),d.load(Panel.templateUrl,{panelID:a}),d.focus()},Panel.close=function(a){var b=_undock(a);if(b){var c=!1;for(var d in _panel2windows)if(b===_panel2windows[d]){c=!0;break}c||b.isMainWindow||b.close()}},Panel.findWindow=function(a){return _panel2windows[a]},Panel.findWindows=function(a){var b=[];for(var c in _panel2windows){var d=c.split("@");if(2===d.length){var e=d[1];if(e===a){var f=_panel2windows[c];-1===b.indexOf(f)&&b.push(f)}}}return b},Panel.findPanels=function(a){var b=[];for(var c in _panel2windows){var d=c.split("@");if(2===d.length){var e=d[1];e===a&&b.push(d[0])}}return b},Panel.closeAll=function(a){Fire.warn("TODO: @Johnny please implement Panel.closeAll")},Panel._onWindowClosed=function(a){for(var b in _panel2windows){var c=_panel2windows[b];c===a&&delete _panel2windows[b]}},Ipc.on("panel:query-info",function(a,b){var c=b.split(".");if(2!==c.length)return Fire.error("Invalid panelID "+b),void a({});var d=c[0],e=c[1],f=Editor.PackageManager.getPackageInfo(d);if(!f)return Fire.error("Invalid package info "+d),void a({});if(!f.fireball)return Fire.error("Invalid package info %s, can not find fireball property",d),void a({});if(!f.fireball.panels)return Fire.error("Invalid package info %s, can not find panels property",d),void a({});if(!f.fireball.panels[e])return Fire.error("Invalid package info %s, can not find %s property",d,e),void a({});var g=f.fireball.panels[e],h=Editor.PackageManager.getPackagePath(d);for(var i in g.profiles){var j=g.profiles[i];j=Editor.loadProfile(b,i,j),g.profiles[i]=j}a({"panel-info":g,"package-path":h})}),Ipc.on("panel:ready",function(a){var b=_panel2argv[a];Editor.sendToPanel(a,"panel:open",b)}),Ipc.on("panel:open",function(a,b){Panel.open(a,!1,b)}),Ipc.on("panel:new",function(a,b){Panel.open(a,!0,b)}),Ipc.on("panel:dock",function(a,b){var c=BrowserWindow.fromWebContents(a.sender),d=Editor.Window.find(c);_dock(b,d)}),Ipc.on("panel:close",function(a){Panel.close(a)}),Ipc.on("panel:save-profile",function(a,b,c){var d=Editor.loadProfile(a,b);d&&(d.clear(),Fire.JS.mixin(d,c),d.save())}),module.exports=Panel;