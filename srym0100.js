// JavaScript Document
// srym0100.js
$(function(){
  // 設定
  var config = {
    name: "srym0100",
    dbMTable : "srym0100",
    dbMkey   : "autoid",
    //dbSTable : "outi0100",
    //dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "srym0100" ,
      panels:[
        //{type: "left"    , "size":"20%", "resizable": true } ,
        {type: "main"    , "size":"30%", "resizable": true } ,
        {type: "right"   , "size":"70%", "resizable": true }
      ]
    } ,
    grid1: {
        name: "grid1srym0100",
        url: "srym0100.php",
        header: "員工薪資資料清單",
        columns: [
            { field: "yymm"   , caption: "月份"    , size: "20%" , sortable: true, hidden:false },
            { field: "emp_no" , caption: "員工編號", size: "20%" , sortable: true, hidden:false },
            { field: "emp_na" , caption: "中文姓名", size: "30%" , sortable: false, hidden:false },
            { field: "id_no"  , caption: "身份証字號",size:"30%" , sortable: true, hidden:false }
        ],
        multiSort: true,
        multiSelect:false,
        sortData: [
            { field: 'yymm'    , direction: 'desc' },
            { field: 'emp_no'  , direction: 'asc' }
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
            { field: "yymm"  , caption: "月份"    , type: "text", operator: "begins" },
            { field: "emp_no", caption: "員工編號", type: "text", operator: "between" }
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
                  for (i=0; i<form1.fields.length; i++) {
                    if (form1.fields[i].type=='float' || form1.fields[i].type=='int' || form1.fields[i].type=='number' )
                        form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value= 0 ;
                  }
        }
    } ,
    form1: {
      name: "form1srym0100",
      url: "srym0100.php",
      header: "員工薪資資料明細-瀏覽",
      itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}],
      fields: [
        { name  : "yymm"    , type:"text" , required: true , html: {caption:"月份", span:11  , attr: 'size=10 ' }},
        { name  : "emp_no"  , type:"combo", required: true , html: {caption:"員工編號", span:15 , attr: 'size=10  '}, options:{url:"empm0100.php"} },
        { name  : "emp_na"  , type:"text" , required: false, html: {caption:"中文姓名", span:15 , attr: 'size=10 readonly'} },
        { name  : "job"     , type:"text" , required: false, html: {caption:"職務"    , span:11 , attr: 'size=10 readonly' }   },
        { name  : "in_date" , type:"date" , required: false, html: {caption:"到職日期", span:15 , attr: 'size=10 readonly'}, options:{format:'yyyy/mm/dd'}  },
        { name  : "fr_date" , type:"date" , required: false, html: {caption:"離職日期", span:15 , attr: 'size=10 readonly'}, options:{format:'yyyy/mm/dd'}  },
        { name  : "bank"    , type:"text" , required: false, html: {caption:"郵局局號", span:11 , attr: 'size=10 readonly'},  },
        { name  : "acc"     , type:"text" , required: false, html: {caption:"存簿帳號", span:15 , attr: 'size=10 readonly'},  },
        { name  : "mate"    , type:"list" , required: false, html: {caption:"有無配偶", span:15 , attr: 'size=4 readonly'}, options:{items:[{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}]} },
        { name  : "sons"    , type:"text" , required: false, html: {caption:"扶養人數", span:15 , attr: "size=4 readonly style='text-align:right;' " } , options:{precision:"0"} },
        { name  : "adddd"   , type:"float", required: false, html: {caption:"假日加班-天", span:11  , attr: "size=4 style='text-align:right;' " } , options:{precision:"0"} },
        { name  : "adddh"   , type:"float", required: false, html: {caption:"假日加班-時", span:15  , attr: "size=4 style='text-align:right;' " } , options:{precision:"1"} },
        { name  : "addnd"   , type:"float", required: false, html: {caption:"晚間加班-天", span:15  , attr: "size=4 style='text-align:right;' " } , options:{precision:"0"} },
        { name  : "addnh"   , type:"float", required: false, html: {caption:"晚間加班-時", span:15  , attr: "size=4 style='text-align:right;' " } , options:{precision:"1"} },
        { name  : "hol1d"   , type:"float", required: false, html: {caption:"給薪休假-天", span:11  , attr: "size=4 style='text-align:right;' " } , options:{precision:"0"} },
        { name  : "hol1h"   , type:"float", required: false, html: {caption:"給薪休假-時", span:15  , attr: "size=4 style='text-align:right;' " } , options:{precision:"1"} },
        { name  : "hol2d"   , type:"int"  , required: false, html: {caption:"無薪休假-天", span:15  , attr: "size=4 style='text-align:right;' " } , options:{precision:"1"} },
        { name  : "hol2h"   , type:"int"  , required: false, html: {caption:"無薪休假-時", span:15  , attr: "size=4 style='text-align:right;' " } , options:{precision:"1"} },
        { name  : "base"    , type:"int"  , required: false, html: {caption:"本薪"    , span:11, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "base1"   , type:"int"  , required: false, html: {caption:"申報"    , span:15, attr:"size=6 readonly style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "plus3"   , type:"int"  , required: false, html: {caption:"津貼"    , span:11, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"}  },
        { name  : "plus4"   , type:"int"  , required: false, html: {caption:"工作獎金", span:15, attr:"size=6 style='text-align:right;'" }  },
        { name  : "plus5"   , type:"int"  , required: false, html: {caption:"職務津貼", span:15, attr:"size=6 style='text-align:right;'" }  },
        { name  : "plus1"   , type:"float", required: false, html: {caption:"假日加班", span:15, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"} },
        { name  : "plus2"   , type:"float", required: false, html: {caption:"晚間加班", span:15, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"} },
        { name  : "plus6"   , type:"float", required: false, html: {caption:"伙食費"  , span:15, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"} },
        { name  : "plus7"   , type:"float", required: false, html: {caption:"全勤獎金", span:15, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"} },
        { name  : "plus8"   , type:"float", required: false, html: {caption:"績效獎金", span:15, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"} },
        { name  : "plus9"   , type:"float", required: false, html: {caption:"其他加給", span:15, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"} },
        { name  : "food1"   , type:"float", required: false, html: {caption:"申報伙食", span:15, attr:"size=6 style='text-align:right;'" } , options:{precision:"0"} },
        { name  : "mnus3"   , type:"int"  , required: false, html: {caption:"扣所得稅", span:11, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus4"   , type:"int"  , required: false, html: {caption:"扣勞保費", span:15, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus5"   , type:"int"  , required: false, html: {caption:"扣健保費", span:15, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus1"   , type:"int"  , required: false, html: {caption:"借    支", span:15, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus2"   , type:"int"  , required: false, html: {caption:"缺席扣款", span:15, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "mnus9"   , type:"int"  , required: false, html: {caption:"扣其他"  , span:15, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "amt"     , type:"int"  , required: false, html: {caption:"實領金額", span:11, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "amt1"    , type:"int"  , required: false, html: {caption:"申報金額", span:15, attr:"size=6 style='text-align:right;'"} , options:{precision:"0"}  },
        { name  : "remark"  , type:"text" , required: false, html: {caption:"備註"    , span:11, attr: 'size=40 '},  }
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
                $('Button.w2ui-btn.btnsrymAdd' ).attr('disabled',false);
                $('Button.w2ui-btn.btnsrymEdit').attr('disabled',false);
                if (grid1.getSelection().length>0)
                  $('Button.w2ui-btn.btnsrymDel' ).attr('disabled',false);
                else
                  $('Button.w2ui-btn.btnsrymDel' ).attr('disabled',true);
                $('Button.w2ui-btn.btnsrymSave').attr('disabled',true);
                $('Button.w2ui-btn.btnsrymCancel').attr('disabled',true);
                break;
          }
          form1.get('mate').options.items = form1.itemsYN;
      },
      onChange: function(event)  {
          if (config.opMode=='browse')  return;
          switch(event.target)  {
            case "date"  :
                var ym = form1.get('date').el.value.substr(0,7).replace("-","");
                autoDocno("srym0100.php","doc_no",ym,4);
                break;
            case "emp_no"  :
                if (!spForm1('emp_no','emp_no,emp_na'))  w2alert('欄位選擇不正確');
                forme.postData['emp_no']= forme.recid=form1.record['emp_no'];
                forme.reload( function(data){
                  if (data.status="success") {
                    form1.record['job']=form1.get('job').el.value= forme.record['job'];
                    form1.record['in_date']=form1.get('in_date').el.value= forme.record['in_date'];
                    form1.record['fr_date']=form1.get('fr_date').el.value= forme.record['fr_date'];
                    form1.record['mate']=form1.get('mate').el.value= forme.record['mate'];
                    form1.record['sons']=form1.get('sons').el.value= forme.record['sons'];
                    form1.record['bank']=form1.get('bank').el.value= forme.record['bank'];
                    form1.record['acc'] =form1.get('acc').el.value= forme.record['acc'];
                    form1.record['base'] =form1.get('base' ).el.value= forme.record['base'];
                    form1.record['base1']=form1.get('base1').el.value= forme.record['base1'];
                    form1.record['plus3']=form1.get('plus3').el.value= forme.record['plus3'];
                    form1.record['plus4']=form1.get('plus4').el.value= forme.record['plus4'];
                    form1.record['plus5']=form1.get('plus5').el.value= forme.record['plus5'];
                    form1.record['mnus3']=form1.get('mnus3').el.value= forme.record['mnus3'];
                    form1.record['mnus4']=form1.get('mnus4').el.value= forme.record['mnus4'];
                    form1.record['mnus5']=form1.get('mnus5').el.value= forme.record['mnus5'];
                    form1.record['mnus9']=form1.get('mnus9').el.value= forme.record['mnus9'];
                  } else consoleLog("emp not set");
                });
                break;
            case "adddd"  :
            case "adddh"  :
              form1.record['plus1']=form1.get('plus1').el.value = Math.round(
                  pfForm1('base')/30*1.33 *( pfForm1('adddd')  + pfForm1('adddh')/8 ) ,0)
            case "addnd"  :
            case "addnh"  :
              form1.record['plus2']=form1.get('plus2').el.value = Math.round(
                  pfForm1('base')/30*1.33 *( pfForm1('addnd')  + pfForm1('addnh')/8 ) ,0)
                break;
            case "hol2d"  :
            case "hol2h"  :
              form1.record['mnus2']=form1.get('mnus2').el.value = Math.round(
                  pfForm1('base')/30 *( pfForm1('hol2d')  + pfForm1('hol2h')/8 ) ,0)
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
              //consoleLog(event.target,form1.get(event.target).el.value);
              form1.record['amt']=form1.get('amt').el.value =
                  pfForm1('base')  + pfForm1('plus1') + pfForm1('plus2') + pfForm1('plus3') + pfForm1('plus4')
                + pfForm1('plus5') + pfForm1('plus6') + pfForm1('plus7') + pfForm1('plus8') + pfForm1('plus9')
                - pfForm1('mnus1') - pfForm1('mnus2') - pfForm1('mnus3') - pfForm1('mnus4') - pfForm1('mnus5') - pfForm1('mnus9') ;
              form1.record['amt1']=form1.get('amt1').el.value = ( pfForm1('base1')==0? 0 :
                  pfForm1('base1') + pfForm1('plus1') + pfForm1('plus2') + pfForm1('plus3') + pfForm1('plus4')
                + pfForm1('plus5') + pfForm1('plus6') + pfForm1('plus7') + pfForm1('plus8') + pfForm1('plus9')
                - pfForm1('mnus2') );
              //consoleLog(form1.record['amt']);
      },
      onRequest: function (event) {
          consoleLog("request", event.target, event.url, event.postData);
      },
      onRequest: function (event) {
          consoleLog("search", event.target, event.url, event.postData);
      },
      actions: {
        add: {caption:"新增" , "class":"btnsrymAdd"  , onClick:function(event) {
            editsrymData("");
        }},
        edit: {caption:"編輯" , "class":"btnsrymEdit" , onClick:function(event) {
            editsrymData(this.recid);
        }},
        "delete" : {caption:"刪除" , "class":"btnsrymDel" , onClick:function(event) {
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
        "save": {caption:"存檔" , "class":"btnsrymSave" ,onClick:function(event) {
            if (!spForm1('emp_no','emp_no,emp_na'))  w2alert('欄位選擇不正確');
            this.save(function (data) {
                if (data.status == 'success') {
                  grid1.render();
                }
            });
        }} ,
        cancel: {caption:"取消" , "class":"btnsrymCancel" , onClick: function(event) {
            config.opMode="browse";
            grid1.click(lstRecid);
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

  function editsrymData(recid) {
            config.opMode = ( (recid==0 || recid=='')  ? "new" : "edit");
            if (config.opMode=="new") {
              form1.clear();
              //form1.enable(config.dbMkey);
              //  grid2.searchData[0].value= "";
              //  grid2.reload();
              //var dt = new Date();
              //var ym = dt.getFullYear() + "" + padLeftZero(dt.getMonth()+1,2);
              form1.get('yymm').el.value = lastMonth().replace('/','');
              //consoleLog(dt , ym);
              //autoDocno("srym0100.php","doc_no",ym,4);
              //form1.get('date').el.value = dt.getFullYear() +"-" + padLeftZero(dt.getMonth()+1,2) +"-" + padLeftZero(dt.getDate(),2) ;
              //form1.record['date'] = form1.get('date').el.value;
              //defaultYM();
                  for (i=0; i<form1.fields.length; i++) {
                    if (form1.fields[i].type=='float' || form1.fields[i].type=='int' || form1.fields[i].type=='number' )
                        form1.record[form1.fields[i].name] = form1.get(form1.fields[i].name).el.value= 0 ;
                  }
            }
            else {
              form1.recid=recid;
              form1.render();
              form1.disable(config.dbMkey);
            }
            $(".w2ui-input:input").attr('disabled',false);
            $('Button.w2ui-btn.btnsrymAdd' ).attr('disabled',true);
            $('Button.w2ui-btn.btnsrymEdit').attr('disabled',true);
            $('Button.w2ui-btn.btnsrymDel' ).attr('disabled',true);
            $('Button.w2ui-btn.btnsrymSave').attr('disabled',false);
            $('Button.w2ui-btn.btnsrymCancel').attr('disabled',false);
            //$(".w2ui-btn:button").attr('disabled',false);
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

});
