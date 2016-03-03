<?php
$headTitle="忠懋企業ＭＩＳ資訊管理系統網頁版";
include "inc_mysql.php";
?>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link rel="stylesheet" type="text/css" href="/jquery/w2ui-1.4.3.min.css" />
    <script src="/jquery/jquery-2.1.1.min.js"></script>
    <script type="text/javascript" src="/jquery/w2ui-1.4.3.min.js"></script>
<style type="text/css">
.w2ui-sidebar .w2ui-sidebar-div .w2ui-node-caption { font-size:1.5em; }
.w2ui-sidebar .w2ui-sidebar-div .w2ui-node-sub .w2ui-node-caption { font-size:1.2em; }
</style>
<title><?echo $headTitle?></title>
</head>
<body>
    <div id="myLayout" style="height: 600px"></div>
    <div id="test"></div>
</body>
<script>
$(function () {
  var lTopStyle = 'border: 1px solid #cfcfcf; padding: 1px; font-size:2.5em; background-color:darkgreen; color:lightgreen; letter-spacing:10px; font-family:"標楷體"; text-align:center ; text-shadow:1px 1px 5px greenyellow;  ';
  var lLeftStyle = 'border: 1px solid #cfcfcf; padding: 2px;';
  var lMainStyle = 'border: 1px solid #cfcfcf; padding: 5px;';
    $('#myLayout').w2layout({
        name: 'myLayout',
        panels: [
            { type: 'top', size: 48 , style: lTopStyle},
            { type: 'left', size: 250,minSize:100,maxSize:500, style: lLeftStyle, resizable: true },
            { type: 'main', style: lMainStyle ,
                tabs: {
                    name: 'tabs',
                    active: 'tab0',
                    tabs: [{ id: 'tab0', caption: '歡迎使用' }],
                    onClick: function (event) {
                        //w2ui.myLayout.html('main', 'Active tab: '+ event.target);
                        console.log(event.target + ' actived');
                        if (event.target=='tab0') {
                          w2ui.myLayout.content('main',"");
                          console.log('clear main');
                          w2ui.myLayout_main_tabs.show('tab0');
                        } else {
                          w2ui.myLayout.content('main',w2ui[event.target]);
                          w2ui.myLayout_main_tabs.hide('tab0');
                        }
                    },
                    onClose: function (event) {
                        //this.click('tab0');
                        var tabs = w2ui.myLayout_main_tabs;
                        var curtab = tabs.get(event.target, true);
                        var maxtab = tabs.tabs.length-1;
                        console.log(event.target + ' closed')
                        //console.log(tabs.tabs);
                        //console.log(curtab);
                        //console.log(maxtab);
                        if (curtab < maxtab) {
                          this.click(tabs.tabs[curtab+1].id);
                        } else {
                          this.click(tabs.tabs[maxtab-1].id);
                        }
                    }
                }

            }
        ]
    });
    w2ui.myLayout.content('top',"<?echo $headTitle;?>"  );
    //ShowMenu("/jm/menu.json");
    ShowMenu("/jm/menujson.php");
    $("#myLayout").css('height', $(window).height()-20);
});

function ShowMenu(menuJSON) {
    $.getJSON( menuJSON, function( data ) {
      console.log( data );
      w2ui.myLayout.content('left', $().w2sidebar(data));
      //xxx  = w2ui['myLayout'].content('left').sidebar;
      w2ui['myLayout'].content('left').sidebar.on('dblClick', function (event) {
      	//w2ui['myLayout'].content('main', 'id: ' + event.target);
            //console.log(event);
            //console.log(event.object.text);
            var tabs = w2ui.myLayout_main_tabs;
            if (tabs.get(event.target)) {
                tabs.select(event.target);
                //w2ui.myLayout.html('main', 'Tab Selected ' + event.target);
                console.log(event.target + " tab selected");
                w2ui.myLayout.content('main',w2ui[event.target]);
                console.log(event.target+" show");
            } else {
                tabs.add({ id: event.target, caption: event.object.text, closable: true });
                //w2ui.myLayout.html('main', 'New tab added '+event.target);
                tabs.select(event.target);
                ReadData('/jm/'+event.target+'.json',event.target);
            }
      }    );
      })
    .done(function() {console.log(menuJSON+' done');})
    .fail(function() {console.log('fail');})
    ;
}

function ReadData(dataFile, procid) {
      console.log(dataFile+","+procid);
    $.getJSON( dataFile, function( data ) {
      console.log(data);
      if (w2ui[procid]) {
        w2ui.myLayout.content('main',w2ui[procid]);
        console.log(procid+" show");
      } else {
        w2ui.myLayout.content('main', $().w2layout(data.mainscr));
        console.log(w2ui[procid]);
        if (data.grid1) {
          w2ui[procid].content('left', $().w2grid(data.grid1));
          w2ui['grid1'+procid].reload();
        }
        if (data.form1) {
          w2ui[procid].content('main', $().w2form(data.form1));
          w2ui['form1'+procid].reload();
          w2ui['form1'+procid].lock('Locking...',true);
          console.log(procid+" form lock");
        }
        if (data.grid2) {
          w2ui[procid].content('preview', $().w2grid(data.grid2));
          w2ui['grid2'+procid].reload();
        }
        if (data.form2) {
          w2ui[procid].content('preview', $().w2form(data.form2));
          w2ui['form2'+procid].reload();
        }
      }
    })
    .done(function() {w2ui['form1'+procid].lock('Locking...',true);console.log(dataFile+' done');})
    .fail(function( jqxhr, textStatus, error ) {var err = textStatus + ", " + error;console.log('fail '+err);})
    ;
}
</script>
</html>