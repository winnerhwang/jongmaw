// JavaScript Document
// srym0100.js
$(function(){
  // 設定
  var config = {
    name: "vrcm0100",
    dbMTable : "vrcm0100",
    dbMkey   : "autoid",
    //dbSTable : "outi0100",
    //dbSkey   : "autoid",
    dbRelVal : "",
    opMode   : "browse",
    mainscr: {
      name: "vrcm0100" ,
      panels:[
        //{type: "left"    , "size":"20%", "resizable": true } ,
        {type: "main"    , "size":"40%", "resizable": true } ,
        {type: "right"   , "size":"60%", "resizable": true }
      ]
    } ,
    grid1: {
        name: "grid1vrcm0100",
        url: "vrcm0100.php",
        header: "廠商應付帳款資料清單",
        columns: [
            { field: "yymm"    , caption: "月份"    , size: "15%" , sortable: true, hidden:false },
            { field: "cust_no" , caption: "廠商編號", size: "15%" , sortable: true, hidden:false },
            { field: "cust_na" , caption: "廠商簡稱", size: "20%" , sortable: false, hidden:false },
            { field: "sal_amt" , caption: "本期合計金額", size: "20%" , sortable: true, hidden:false , render:"float:2"},
            { field: "flag"    , caption: "註記"    , size: "10%"  , sortable: true, hidden:false }
        ],
        multiSort: true,
        multiSelect:false,
        sortData: [
            { field: 'yymm'    , direction: 'desc' },
            { field: 'cust_no' , direction: 'asc' }
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
            { field: "yymm"   , caption: "月份"    , type: "text", operator: "begins" },
            { field: "cust_no", caption: "廠商編號", type: "text", operator: "between" }
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
      name: "form1vrcm0100",
      url: "vrcm0100.php",
      header: "廠商應付帳款資料明細-瀏覽",
      itemsYN   : [{id:'Y',text:'Y.是'},{id:'N',text:'N.否'}],
      fields: [
        { name  : "yymm"    , type:"text" , required: true , html: {caption:"月份"    , span:11, attr:"size=10 " }},
        { name  : "cust_no" , type:"combo", required: true , html: {caption:"廠商編號", span:15, attr:"size=10 "}, options:{url:"venm0100.php"} },
        { name  : "cust_na" , type:"text" , required: false, html: {caption:"廠商簡稱", span:15, attr:"size=10 readonly"} },
        { name  : "lst_amt" , type:"float", required: false, html: {caption:"前期未付", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "out_amt" , type:"float", required: false, html: {caption:"進貨金額", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "bad_amt" , type:"float", required: false, html: {caption:"退回金額", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "wrk_amt" , type:"float", required: false, html: {caption:"託工金額", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "wrk_bad" , type:"float", required: false, html: {caption:"託工退回", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "wrk_add" , type:"float", required: false, html: {caption:"託工其他", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "dsc_amt" , type:"float", required: false, html: {caption:"折讓金額", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "csh_amt" , type:"float", required: false, html: {caption:"現購金額", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "c3p_amt" , type:"float", required: false, html: {caption:"現金折扣", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "sal_amt" , type:"float", required: false, html: {caption:"本期合計", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "tax_rate", type:"float", required: false, html: {caption:"稅率"    , span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "tax_amt" , type:"float", required: false, html: {caption:"稅額"    , span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "pre_amt" , type:"float", required: false, html: {caption:"預付金額", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "bln_amt" , type:"float", required: false, html: {caption:"應付合計", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "date"    , type:"date" , required: false, html: {caption:"付款日期", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "amt_rec" , type:"float", required: false, html: {caption:"實付金額", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "dsc_rec" , type:"float", required: false, html: {caption:"折讓金額", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "c3p_rec" , type:"float", required: false, html: {caption:"現金折扣", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "bad_rec" , type:"float", required: false, html: {caption:"抵退貨額", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "rec_amt" , type:"float", required: false, html: {caption:"付款小計", span:15, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "bln_rec" , type:"float", required: false, html: {caption:"未付餘額", span:11, attr:"size=10 style='text-align:right;'"}, options:{precision:"1"} },
        { name  : "flag"    , type:"text" , required: false, html: {caption:"對帳"    , span:15, attr:"size=6"  }  },
        { name  : "note1"   , type:"text" , required: false, html: {caption:"備註"    , span:11, attr:"size=40" }  },
        { name  : "note2"   , type:"text" , required: false, html: {caption:" "       , span:15, attr:"size=40" }  },
        { name  : "note3"   , type:"text" , required: false, html: {caption:" "       , span:11, attr:"size=40" }  },
        { name  : "note4"   , type:"text" , required: false, html: {caption:" "       , span:15, attr:"size=40" }  },
        { name  : "note5"   , type:"text" , required: false, html: {caption:" "       , span:11, attr:"size=40" }  },
        { name  : "note6"   , type:"text" , required: false, html: {caption:" "       , span:15, attr:"size=40" }  },
        { name  : "note7"   , type:"text" , required: false, html: {caption:" "       , span:11, attr:"size=40" }  }
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
                $('Button.w2ui-btn.btnvrcmAdd' ).attr('disabled',false);
                $('Button.w2ui-btn.btnvrcmEdit').attr('disabled',false);
                if (grid1.getSelection().length>0)
                  $('Button.w2ui-btn.btnvrcmDel' ).attr('disabled',false);
                else
                  $('Button.w2ui-btn.btnvrcmDel' ).attr('disabled',true);
                $('Button.w2ui-btn.btnvrcmSave').attr('disabled',true);
                $('Button.w2ui-btn.btnvrcmCancel').attr('disabled',true);
                break;
          }
          //form1.get('mate').options.items = form1.itemsYN;
      },
      onChange: function(event)  {
          if (config.opMode=='browse')  return;
          switch(event.target)  {
            case "date"  :
                //var ym = form1.get('cust_na').el.value.substr(0,7).replace("-","");
                //autoDocno("vrcm0100.php","doc_no",ym,4);
                break;
            case "cust_no"  :
                if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
                break;
            case "sal_amt"  :
            case "tax_rate"  :
                form1.record['tax_amt']=form1.get('tax_amt').el.value =  Math.round(
                   pfForm1('sal_amt') * pfForm1('tax_rate')/100 ,0);
                break;
            default   :
                //consoleLog("change none process");
                break;
          }
          form1.record['sal_amt']=form1.get('sal_amt').el.value =  
    		     pfForm1('out_amt') - pfForm1('bad_amt') + pfForm1('wrk_amt') - pfForm1('wrk_bad')
    			  +pfForm1('wrk_add') - pfForm1('dsc_amt') - pfForm1('csh_amt') - pfForm1('c3p_amt') ;
          form1.record['bln_amt']=form1.get('bln_amt').el.value =
             pfForm1('lst_amt') + pfForm1('sal_amt') + pfForm1('tax_amt') - pfForm1('pre_amt');
          form1.record['rec_amt']=form1.get('rec_amt').el.value =
             pfForm1('amt_rec') + pfForm1('dsc_rec') + pfForm1('c3p_rec') + pfForm1('bad_rec');
          form1.record['bln_rec']=form1.get('bln_rec').el.value =
             pfForm1('bln_amt') + pfForm1('rec_amt');
      },
      onRequest: function (event) {
          //consoleLog("search", event.target, event.url, event.postData);
      },
      actions: {
        add: {caption:"新增" , "class":"btnvrcmAdd"  , onClick:function(event) {
            editvrcmData("");
        }},
        edit: {caption:"編輯" , "class":"btnvrcmEdit" , onClick:function(event) {
            editvrcmData(this.recid);
        }},
        "delete" : {caption:"刪除" , "class":"btnvrcmDel" , onClick:function(event) {
            //consoleLog('delete', grid1.getSelection());
                w2confirm({
                    title : w2utils.lang('Delete Confirmation'),
                    msg   : "確定刪除本筆資料 及 明細項目資料嗎？",
                    yes_class : 'w2ui-btn-red',
                    callBack: function (result) {
                        if (result == 'Yes') grid1['delete'](true);
                    }
                });
        }},
        "save": {caption:"存檔" , "class":"btnvrcmSave" ,onClick:function(event) {
            if (!spForm1('cust_no','cust_no,cust_na'))  w2alert('欄位選擇不正確');
            this.save(function (data) {
                if (data.status == 'success') {
                  grid1.render();
                }
            });
        }} ,
        cancel: {caption:"取消" , "class":"btnvrcmCancel" , onClick: function(event) {
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

  function editvrcmData(recid) {
            config.opMode = ( (recid==0 || recid=='')  ? "new" : "edit");
            if (config.opMode=="new") {
              form1.clear();
              var dt = new Date();
              var ym = dt.getFullYear() + "" + padLeftZero(dt.getMonth()+1,2);
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
            $('Button.w2ui-btn.btnvrcmAdd' ).attr('disabled',true);
            $('Button.w2ui-btn.btnvrcmEdit').attr('disabled',true);
            $('Button.w2ui-btn.btnvrcmDel' ).attr('disabled',true);
            $('Button.w2ui-btn.btnvrcmSave').attr('disabled',false);
            $('Button.w2ui-btn.btnvrcmCancel').attr('disabled',false);
            //$(".w2ui-btn:button").attr('disabled',false);
  }



});
