<?php
// <div id="loginform" style="width:400px;margin:100px 300px;">

?>
</div>
<script type="text/javascript">
$(function () {
    var popLogin = {
        name  : 'login',
        //header : '登入系統',
        url   : 'inc_loginCheck.php',
        fields: [
            { field: 'username', type: 'text', required: true , html: { caption: '用戶代號', attr: 'style="width: 100px" placeholder="username"' }},
            { field: 'password', type: 'password', required: true , html: { caption: '密碼', attr: 'style="width: 100px"' }}
        ],
        onRender: function() {
          last_user = $.cookie("login_user");
          //consoleLog(last_user);
          w2ui.login.record['username'] = last_user;
        },
        actions: {
            'login': {caption:"登入" , "class":"btnSubmit"  ,onClick: function (event) {
                //consoleLog(event);
                passcode = w2ui.login.record['password'].toUpperCase();
                w2ui.login.record['password'] = encodepass(passcode);
                //this.save();
                //consoleLog(passcode,w2ui.login.record['password']);
                this.save(function (data) {
                    //consoleLog("login",data);
                    if (data.status == 'success') {
                      //consoleLog("pass success");
                      //alert("OK");
                      window.location.reload();
                      w2ui.login.record['password'] = passcode;
                    } else {
                      //consoleLog("pass error");
                      w2ui.login.record['password'] = passcode;
                      alert("無法驗証密碼");
                      w2ui.login.record['password'] = "";
                    }
                });
            }},
            "重填": function () {
                this.clear();
            }
        }
    };
    var forml = $().w2form(popLogin);
    $().w2popup('open', {
        title   : '登入系統',
        body    : '<div id="pop_login" style="width: 100%; height: 100%"></div>',
        style   : 'padding: 15px 10px 10px 10px',
        width   : 320,
        height  : 220,
        onOpen  : function (event) {
            event.onComplete = function () {
                forml.clear();
                $('#w2ui-popup #pop_login').w2render(forml.name);
            }
        }
    });
//console.log(w2ui['login']);
//  w2ui['login'].on({type:'complete',excute:'after',}, function(target ,eventData)  {
//    console.log("CompleteEvent ");
//  });
});
</script>
