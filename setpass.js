// JavaScript Document
// setpass.js
$(function(){
  // 設定
  var config = {
    name: "setpass",
    dbMTable : "pass",
    dbMkey   : "name",
    opMode   : "browse",
    mainscr: {
      name: "setpass" ,
      panels:[
        {type: "main" , "size":"450px", "resizable": "true" } ,
        {type: "right", "size":"50%" }
      ]
    }
    ,
    grid1: {
        name: "grid1setpass",
        url: "setpass.php",
        header: "使用者資料清單",
        columns: [
            { field: "name"     , caption: "用戶代號", size: "20%" , sortable: true },
            { field: "password" , caption: "用戶密碼", size: "20%" , sortable: false, hidden:true },
            { field: "usr_name" , caption: "中文姓名", size: "20%" , sortable: true },
            { field: "menugroup", caption: "權限群組", size: "20%" , sortable: false }
        ],
        sortData: [
            { field: 'name'    , direction: 'asc' },
            { field: 'usr_name', direction: 'asc' }
        ],
        show: {
            header        : true,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : true,
            toolbarEdit   : true,
            toolbarDelete : true
        },
        multiSearch: true,
        searches: [
            { field: "name"     , caption: "用戶代號", type: "text", operator: "contains" },
            { field: "usr_name" , caption: "中文姓名", type: "text", operator: "contains" },
            { field: "menugroup", caption: "權限群組", type: "text", operator: "contains" }
        ],
        onLoad: function(event){
            event.onComplete = function () {
              grid1.click(lstRecid);
            };
        },
        onClick: function(event){
            config.opMode = "browse";
            var rcd=grid1.get(event.recid);
            if (rcd==null)                 rcd=grid1.records[0];
            if (rcd!=null)  {
                form1.postData[config.dbMkey]= rcd[config.dbMkey];
                form1.recid=rcd['recid'];
                form1.reload();
                lstRecid=rcd[config.dbMkey];
            } else {
              form1.clear();
              lstRecid=0;
            }
            form1.disable(form1.fields);
            $(".w2ui-input:input").attr('disabled',true);
            $(".w2ui-btn:button").attr('disabled',false);
        },
        onDblClick: function(event){
            var rcd=grid1.get(event.recid);
            form1.recid=rcd['recid'];
            config.opMode = "edit";
            form1.render();
            $(".w2ui-input:input").attr('disabled',false);
            form1.disable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
        },
        onEdit: function(event){
            this.dblClick(event.recid);
        },
        onAdd: function (event) {
            form1.recid="";
            config.opMode = "new";
            $(".w2ui-input:input").attr('disabled',false);
            form1.enable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            form1.clear();
        }
    }
    ,
    form1: {
      name: "form1setpass",
      url: "setpass.php",
      header: "使用者資料明細-瀏覽",
      itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}],
      fields: [
        { name  : "name"     , type:"text" , required: true , html: {caption:"用戶代號", span:11 ,attr:'size=10'} },
        { name  : "password" , type:"pass" , required: true , html: {caption:"用戶密碼", span:11 ,attr:'size=20' }},
        { name  : "usr_name" , type:"text" , required: false, html: {caption:"中文姓名", span:11 ,attr:'size=10' }},
        { name  : "menugroup", type:"text" , required: false, html: {caption:"權限群組", span:11 ,attr:'size=10' }}
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" : this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增"; break;
            case "edit": this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改"; break;
            default    : this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽"; break;
          }
          //form1.get('kind').options.items = form1.itemsKind;
          //form1.get('sal_knd').options.items = form1.itemsSal;
          //form1.get('mate').options.items = form1.itemsYN;
      },
      onLoad : function(event)  {
        event.onComplete = function() {
          //consoleLog(form1.record['password'],decodepass(form1.record['password']));
          form1.record['password'] = decodepass(form1.record['password']);
        };
      },
      onChange: function(event)  {
          switch(event.target)  {
          default   :
                //consoleLog("change none process");
                break;
          }
      },
      onSave : function (data) {
        if (data.status=='success') {
          config.opMode='browse';
          grid1.reload();

        }
      },
      actions: {
        "save": {caption:"存檔",onClick:function(event) {
            form1.record['password']=encodepass(form1.get('password').el.value);
            form1.record['name']=form1.get('name').el.value.toUpperCase();
            this.save(function (data) {
                if (data.status == 'success') {
                  w2ui['grid1empm0100'].reload();
                }
            });
        }}
      }
    }
    , rePlay : function () {
        if (config.grid1) grid1 = w2ui[config.grid1.name] || $().w2grid(config.grid1);
        if (config.form1) form1 = w2ui[config.form1.name] || $().w2form(config.form1);
        if (config.grid2) grid2 = w2ui[config.grid2.name] || $().w2grid(config.grid2);
        if (config.form2) form2 = w2ui[config.form2.name] || $().w2form(config.form2);
        if (config.formc) formc = w2ui[config.formc.name] || $().w2form(config.formc);    // cusm0100    客戶
        if (config.formv) formv = w2ui[config.formv.name] || $().w2form(config.formv);    // venm0100    廠商
        if (config.formw) formw = w2ui[config.formw.name] || $().w2form(config.formw);    // wktm0100    加工
        if (config.forms) forms = w2ui[config.forms.name] || $().w2form(config.forms);    // stkm0100    貨品
        if (config.formb) formb = w2ui[config.formb.name] || $().w2form(config.formb);    // bomm0100    零件
        if (config.formk) formk = w2ui[config.formk.name] || $().w2form(config.formk);    // swkmm0100   工序
        if (config.forme) forme = w2ui[config.forme.name] || $().w2form(config.forme);    // empmm0100   員工
        w2ui.myLayout.content('main'   , w2ui[config.name]);
        w2ui[config.name].content('main'   , grid1);
        w2ui[config.name].content('right'  , form1);
        //w2ui[config.name].content('preview', grid2);
    }
}
;


  procid=config.name;
  if ( ! w2ui[config.name]) {
    lstRecid=0;
    JSconfig[config.name]=config;
    $().w2layout(config.mainscr);
  }
  config.rePlay();


});
