// JavaScript Document
// wodm0100.js
$(function(){
  // 設定
  var config = {
    name: "wodm0100",
    dbMTable : "wodh0100",
    dbMkey   : "doc_no",
    //dbSTable : "wodi0100",
    //dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "wodm0100" ,
      panels:[
        //{type: "left"    , "size":"20%", "resizable": true } ,
        {type: "main"    , "size":"70%", "resizable": true } ,
        {type: "right"   , "size":"30%", "resizable": true }

      ]
    } ,
    grid1: {
        name: "grid1wodm0100",
        url: "wodh0100.php",
        header: "工令資料清單",
        columns: [
            { field: "doc_no"   , caption: "工令單號", size: "12%" , sortable: true, hidden:false },
            { field: "date"     , caption: "預訂出貨", size: "12%" , sortable: true, render:'date:yyyy/mm/dd' },
            { field: "cust_no"  , caption: "客戶編號", size: "10%" , sortable: true, hidden:false },
            { field: "cust_na"  , caption: "客戶簡稱", size: "10%" , sortable: false, hidden:false },
            { field: "bom_no"   , caption: "機種代號", size: "10%" , sortable: true },
            { field: "stk_na"   , caption: "產品名稱", size: "16%"  },
            { field: "stk_no"   , caption: "客戶貨號", size: "10%" , sortable: true },
            { field: "qty"      , caption: "數量"    , size: "10%" , style:"text-align:right;" , render:'float:0'  },
            { field: "flag"     , caption: "出貨"    , size: "05%" , sortable: true }
        ],
        multiSort: true,
        multiSelect:false,
        sortData: [
            { field: 'date'    , direction: 'desc' },
            { field: 'doc_no'  , direction: 'desc' }
            //{ field: 'cust_no' , direction: 'asc' }
        ],
        show: {
            header        : true,
            toolbar       : true,
            footer        : true,
            toolbarAdd    : false,
            toolbarEdit   : false,
            toolbarDelete : false
        },
        multiSearch: true,
        searches: [
            { field: "doc_no"  , caption: "工令單號", type: "text", operator: "begins" },
            { field: "date"    , caption: "預訂出貨", type: "date", operator: "between" },
            { field: "wodh0100.cust_no"  , caption: "客戶編號", type: "text", operator: "contains" },
            { field: "wodh0100.bom_no"   , caption: "機種代號", type: "text", operator: "contains" }
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
                //grid2.searchData[0].value= rcd[config.dbMkey];
                //grid2.reload();
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
            form1.disable(config.dbMkey);
            $(".w2ui-btn:button").attr('disabled',false);
            form1.clear();
        }
    } ,
    form1: {
      name: "form1wodm0100",
      url: "wodh0100.php",
      header: "工令資料明細-瀏覽",
      fields: [
        { name  : "doc_no"  , type:"text" , required: true , html: {caption:"工令單號", span:11  , attr: 'size=12 ' }},
        { name  : "date"    , type:"date" , required: true , html: {caption:"預訂出貨", span:15  , attr: 'size=10 ' } , options:{format:'yyyy/mm/dd'} },
        { name  : "cust_no" , type:"combo", required: true , html: {caption:"客戶編號", span:11  , attr: 'size=10 ' } , options:{url:"cusm0100.php"} },
        { name  : "cust_na" , type:"text" , required: false, html: {caption:"客戶簡稱", span:15  , attr: 'size=10 readonly'} },
        { name  : "bom_no"  , type:"combo", required: true , html: {caption:"機種代號", span:11  , attr: 'size=10'  } , options:{url:"stkm0100.php"} },
        { name  : "stk_na"  , type:"text" , required: false, html: {caption:"產品名稱", span:11  , attr: 'size=30 readonly'} },
        { name  : "spec"    , type:"text" , required: false, html: {caption:"規格"    , span:11  , attr: "size=30 readonly" }},
        { name  : "stk_no"  , type:"text" , required: false, html: {caption:"客戶貨號", span:11  , attr: "size=30 " }},
        { name  : "qty"     , type:"float", required: true , html: {caption:"數量"    , span:11  , attr: "size=10 style='text-align:right;' " } , options:{precision:"0"} },
        { name  : "color"   , type:"text" , required: false, html: {caption:"顏色"    , span:11  , attr: "size=16 " }},
        { name  : "label"   , type:"text" , required: false, html: {caption:"標籤"    , span:15  , attr: "size=30 " }},
        { name  : "flag"    , type:"text" , required: false, html: {caption:"出貨"    , span:15  , attr: "size=4  " }}
      ],
      onRefresh: function(event)  {
          switch (config.opMode)  {
            case "new" :
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-新增";
                break;
            case "edit":
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-修改";
                break;
            default    :
                this.header =this.header.substr(0,this.header.indexOf("-"))+"-瀏覽";
                $('Button.w2ui-btn.btnwodmAdd' ).attr('disabled',false);
                $('Button.w2ui-btn.btnwodmEdit').attr('disabled',false);
                if (grid1.getSelection().length>0)
                  $('Button.w2ui-btn.btnwodmDel' ).attr('disabled',false);
                else
                  $('Button.w2ui-btn.btnwodmDel' ).attr('disabled',true);
                $('Button.w2ui-btn.btnwodmSave').attr('disabled',true);
                $('Button.w2ui-btn.btnwodmCancel').attr('disabled',true);
                break;
          }
      },
      onChange: function(event)  {
          if (config.opMode=='browse')  return;
          switch(event.target)  {
            case "date"  :
                var ym = form1.get('date').el.value.substr(0,7).replace("-","").replace("/","");
                if (config.opMode=='new') autoDocno("wodh0100.php","doc_no",ym,4);
                break;
            case "cust_no"  :
                if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
                break;
            case "bom_no"  :
                if (!spForm1('bom_no','bom_no,stk_na'))  w2alert('欄位選擇不正確');
                forms.recid=forms.postData['stk_no']=form1.record['bom_no']
                forms.reload( function(data){
                  if (data.status="success") {
                    form1.record['spec']=form1.get('spec').el.value= forms.record['spec'];
                  } else consoleLog("stk spec not set");
                });
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
      },
      onSave: function (data) {
           if (data.status == 'success') {
                  lstRecid=form1.record['doc_no'];
                  grid1.render();
             }
      },
      actions: {
        add: {caption:"新增" , "class":"btnwodmAdd"  , onClick:function(event) {
            editWodmData("");
        }},
        edit: {caption:"編輯" , "class":"btnwodmEdit" , onClick:function(event) {
            editWodmData(this.recid);
        }},
        "delete" : {caption:"刪除" , "class":"btnwodmDel" , onClick:function(event) {
            consoleLog('delete', grid1.getSelection());
                w2confirm({
                    title : w2utils.lang('Delete Confirmation'),
                    msg   : "確定刪除本筆資料 及 明細項目資料嗎？",
                    yes_class : 'w2ui-btn-red',
                    callBack: function (result) {
                        if (result == 'Yes') grid1['delete'](true);
                    }
                });
        }},
        "save": {caption:"存檔" , "class":"btnWodmSave" ,onClick:function(event) {
            if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
            if (!spForm1('bom_no','bom_no,stk_na'))  w2alert('欄位選擇不正確');
            this.save(function (data) {
                if (data.status == 'success') {
                  lstRecid=form1.record['doc_no'];
                  grid1.render();
                }
            });
        }} ,
        cancel: {caption:"取消" , "class":"btnwodmCancel" , onClick: function(event) {
            config.opMode="browse";
            grid1.click(lstRecid);
        }  }
      }
    } ,
    form2: {
      name: "form2wodm0101",
      url: "wodi0100.php",
      //header: "工令資料明細-展開",
      fields: [
        { name  : "date"    , type:"date" , required: true , html: {caption:"工令日期", span:15  , attr: 'size=10 ' } , options:{format:'yyyy/mm/dd'} },
        { name  : "stk_no"  , type:"combo", required: true , html: {caption:"產品編號", span:11  , attr: 'size=10'}, options:{url:"stkm0100.php"} },
        { name  : "stk_na"  , type:"text" , required: false, html: {caption:"產品名稱", span:15  , attr: 'size=30 readonly'} },
        { name  : "qty"     , type:"float", required: false, html: {caption:"數量"    , span:11  , attr: "size=10 style='text-align:right;' " } , options:{precision:"0"} }
      ],
      onRender: function(event){
        form2.record['date']=today();
      },
      onChange: function(event)  {
          switch(event.target)  {
            case "stk_no"  :
                if (!spForm2('stk_no','stk_no,stk_na'))  w2alert('欄位選擇不正確');
                break;
          }
      },
      actions: {
        "open": {caption:"展開" , "class":"btnWodmOpen"  , onClick:function(event) {
            openWodmItem("");
            $().w2popup('close');
        }},
        cancel: {caption:"取消" , "class":"btnWodmCancel" , onClick: function(event) {
            //config.opMode="browse";
            //grid1.click(lstRecid);
            $().w2popup('close');
        }  }
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
  };


  procid=config.name;
  if ( ! w2ui[config.name]) {
    lstRecid=0;
    JSconfig[config.name]=config;
    $().w2layout(config.mainscr);
  }
  config.rePlay();

  function editWodmData(recid) {
            config.opMode = ( (recid==0 || recid=='')  ? "new" : "edit");
            if (config.opMode=="new") {
              form1.clear();
              form1.enable(config.dbMkey);
              //  grid2.searchData[0].value= "";
              //  grid2.reload();
              var dt = new Date();
              var ym = dt.getFullYear() + "" + padLeftZero(dt.getMonth()+1,2);
              //consoleLog(dt , ym);
              autoDocno("wodh0100.php","doc_no",ym,4);
              form1.get('date').el.value = dt.getFullYear() +"-" + padLeftZero(dt.getMonth()+1,2) +"-" + padLeftZero(dt.getDate(),2) ;
              form1.record['date'] = form1.get('date').el.value;
              for (i=0; i<form1.fields.length; i++) {
                if (form1.fields[i].type=='float' || form1.fields[i].type=='number' )  form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value=0
              }
              //defaultYM();
            }
            else {
              form1.recid=recid;
              form1.render();
              form1.disable(config.dbMkey);
            }
            $(".w2ui-input:input").attr('disabled',false);
            $('Button.w2ui-btn.btnwodmAdd' ).attr('disabled',true);
            $('Button.w2ui-btn.btnwodmEdit').attr('disabled',true);
            $('Button.w2ui-btn.btnwodmDel' ).attr('disabled',true);
            $('Button.w2ui-btn.btnwodmSave').attr('disabled',false);
            $('Button.w2ui-btn.btnwodmCancel').attr('disabled',false);
            //$(".w2ui-btn:button").attr('disabled',false);
  }

  function openWodmData(recid) {
    $().w2popup('open', {
        title   : '工令資料明細-展開',
        body    : '<div id="pop_edit" style="width: 100%; height: 100%"></div>',
        style   : 'padding: 15px 0px 0px 0px',
        width   : 420,
        height  : 280,
        onOpen  : function (event) {
            event.onComplete = function () {
                form2.clear();
                form2.recid = recid;
                $('#w2ui-popup #pop_edit').w2render(form2.name);
            }
        }
    });
  }

  function openWodmItem(op) {
    var cmdRequest = {} ;
    var postData   = {} ;
    cmdRequest['cmd']='open-item';
    cmdRequest['opdate']=form2.record['date'];
    cmdRequest['stk_no']=form2.record['stk_no'] = form2.get('stk_no').el.value;
    cmdRequest['qty'   ]=form2.record['qty'];
    //cmdRequest['price' ]=form2.record['price'];
    var ajaxOptions = {
        type     : 'POST',
        url      : form2.url,
        data     : cmdRequest,
        dataType : 'text'   // expected from server
    };
    consoleLog(ajaxOptions);
    ajaxOptions.data =  String($.param(ajaxOptions.data, false)).replace(/%5B/g, '[').replace(/%5D/g, ']');
    var xhr = $.ajax(ajaxOptions)
                .done(function (data, status, xhr) {
                    if (data.status == 'success') {
                      data = JSON.parse(data);
                      consoleLog(data);
                      consoleLog(data.records);
                      if (data.records.length==0) {
                        //lstRecid=0;
                      } else {
                        consoleLog(data.records);
                        //consoleLog(data.record[fldName].substr(prefix.length));
                        lstRecid = data.records[0]['doc_no'];
                        config.opMode="browse";
                        grid1.reload();
                      }
                      consoleLog("moveToNewDocno",lstRecid);
                    } else {
                      alert('open item error');
                    }
                })
                .fail(function (xhr, status, error) {
                      consoleLog(xhr, status, error);

                });

  }
  
  function autoDocno(url, fldName, prefix, numLen) {
    var cmdRequest = {} ;
    var postData   = {} ;
    cmdRequest['cmd']='auto-no';
    cmdRequest['prefix']=prefix;
    cmdRequest['field'] =fldName;
    //$.extend(cmdRequest, postData);
    var ajaxOptions = {
        type     : 'POST',
        url      : url,
        data     : cmdRequest,
        dataType : 'text'   // expected from server
    };
    lastVal = 0;
    //consoleLog(ajaxOptions);
    ajaxOptions.data =  String($.param(ajaxOptions.data, false)).replace(/%5B/g, '[').replace(/%5D/g, ']');
    var xhr = $.ajax(ajaxOptions)
                .done(function (data, status, xhr) {
                    if (status == 'success') {
                      data = JSON.parse(data);
                      //consoleLog(data);
                      //consoleLog(data.record);
                      if (data.record.length==0) {
                        lastVal=0;
                      } else {
                        //consoleLog(data.record[fldName]);
                        //consoleLog(data.record[fldName].substr(prefix.length));
                        lastVal = parseInt(data.record[fldName].substr(prefix.length));
                      }
                      //consoleLog(lastVal);
                        nextVal = lastVal+1;
                        //consoleLog(nextVal);
                        form1.get(fldName).el.value = prefix + padLeftZero(nextVal, numLen);
                        form1.record[fldName] = prefix + padLeftZero(nextVal, numLen);
                    }
                })
                .fail(function (xhr, status, error) {
                      consoleLog(xhr, status, error);

                });
    //return prefix + padLeftZero(lastVal+1, numLen);
  }

  function defaultYM() {
                ym = form1.get('date').el.value;
                //consoleLog("yymm" , ym);
                if (ym=='') return "";
                var d = form1.get('date').el.value;
                  //consoleLog(d, typeof d);
                  yymm = d.substr(0,7);
                if (d!='') {
                  form1.get('yymm').el.value = d.substr(0,7);
                  form1.record['yymm']=form1.get('yymm').el.value;
                  //consoleLog(d, form1.get('yymm').el.value);
                }
                return  form1.record['yymm'];
  }

  function searchSwkm(event){
    fldStk = form1.get('stk_no');
    fldWkt = form1.get('wkt_no');
    consoleLog(fldStk, fldWkt);
    fldWkt.options.postData['stk_no']=fldStk.el.value;
    consoleLog(fldStk.el.value, fldWkt.options);
    //consoleLog("search SWKM", event.target, event.url, event.postData);
    //consoleLog("request"    , event.target, event.url, event.postData);
  }
});
