$(function(){
  var config= {
    confirm : {
        title: "登出系統",
        msg: "你確定要離開本系統?",
        callBack: function(result)  {
            if (result == 'Yes') window.location.replace("logout.php");
        }
    }
  };

  w2confirm(config.confirm);

});
