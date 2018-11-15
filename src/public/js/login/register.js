
$(document).on("click", ".register_button", function () {
    if(isRegister == true && enableInvitationCode == 1) {
        $(".register_button").attr("is_type", updateInvitationCodeType);
    }
    registerAndLogin();
});



function registerAndLogin()
{
    var isType = $(".register_button").attr("is_type");
    invitationCode = $(".register_input_code").val();

    if(isType == updateInvitationCodeType) {
        showLoading($(".site_login_div"));
        cancelLoadingBySelf();
        apiPassportPasswordLogin(updatePassportPasswordInvitationCode);
    } else {
        var flag = checkRegisterInfo();
        if(flag == false) {
            return false;
        }
        showLoading($(".site_login_div"));
        cancelLoadingBySelf();
        zalyjsWebCheckUserExists(loginNameNotExist, loginNameExist);
    }
}

function registerForLogin()
{
    window.location.href="./index.php?action=page.passport.login";
}

function returnRegisterDiv() {
    $(".zaly_site_register-invitecode")[0].style.display = "none";
    $(".zaly_site_update-invitecode")[0].style.display="none";
    $(".zaly_site_register-name")[0].style.display = "block";
}

$(document).on("click", ".register_code_button", function () {
    var flag = checkRegisterInfo();
    if(flag == false) {
        return false;
    }
    $(".zaly_site_register-name")[0].style.display = "none";
    $(".zaly_site_register-invitecode")[0].style.display = "block";
});


var pwdContainCharacters = $(".pwdContainCharacters").val();
var loginNameMaxLength = $(".loginNameMaxLength").val();
var loginNameMinLength = $(".loginNameMinLength").val();
var pwdMaxLength = $(".pwdMaxLength").val();
var pwdMinLength = $(".pwdMinLength").val();

var registerCustom = new Array();
function checkRegisterInfo()
{
    registerLoginName = $(".register_input_loginName").val();
    registerPassword  = $(".register_input_pwd").val();
    repassword = $(".register_input_repwd").val();
    registerEmail = $(".register_input_email").val();
    isFocus = false;

    registerLoginName = trimString(registerLoginName);
    if(registerLoginName == "" || registerLoginName == undefined
        || registerLoginName.length<loginNameMinLength || registerLoginName.length>loginNameMaxLength
        || checkIsEntities(registerLoginName)
    ) {
        $("#register_input_loginName").focus();
        $(".register_input_loginName_failed")[0].style.display = "block";
        isFocus = true;
    }
    registerPassword = trimString(registerPassword);

    if(registerPassword == "" || registerPassword == undefined
        || registerPassword.length<pwdMinLength || registerPassword.length>pwdMaxLength
        || !verifyChars(pwdContainCharacters, registerPassword)

    ) {
        $(".register_input_pwd_failed")[0].style.display = "block";
        if (isFocus == false) {
            $("#register_input_pwd").focus();
            $(".register_input_loginName_failed")[0].style.display = "none";
            isFocus = true;
        }
    }

    if(repassword == "" || repassword == undefined
        || repassword.length<0 || (repassword != registerPassword)
    ) {
        $(".register_input_repwd_failed")[0].style.display = "block";
        if(isFocus == false) {
            $("#register_input_repwd").focus();
            $(".register_input_pwd_failed")[0].style.display = "none";
            isFocus = true;
        }
    }

    registerEmail = trimString(registerEmail);
    if(passwordResetRequired == 1
        && (
            registerEmail == "" || registerEmail == undefined
            || registerEmail.length<0)
    ) {
        $(".register_input_email_failed")[0].style.display = "block";
        if(isFocus == false) {
            $("#register_input_email").focus();
            isFocus = true;
        }
    }
    
    $(".register_custom").each(function (index, custom) {
        var isRequired = $(custom).attr("isRequired");
        var customName = $(custom).attr("customName");
        var customKey = $(custom).attr("customKey");
        var value = $(custom).val();
        if(Number(isRequired) == 1) {
            if(trimString(value)<1) {
                $(".register_input_"+customKey+"_failed")[0].style.display = "block";
                if(isFocus == false) {
                    $("#register_input_"+customKey).focus();
                    isFocus = true;
                }
            } else {
                $(".register_input_"+customKey+"_failed")[0].style.display = "none";
            }
        }
        registerCustomProfile = {
            "customKey":customKey,
            "customValue":value,
            "customeName":customName
        }
        registerCustom.push(registerCustomProfile);
    });
    
    if(isFocus == true) {
        return false;
    }
    $(".register_input_email_failed")[0].style.display = "none";
    $(".register_input_loginName_failed")[0].style.display = "none";
    $(".register_input_pwd_failed")[0].style.display = "none";
    $(".register_input_repwd_failed")[0].style.display = "none";

    if(registerPassword != repassword) {
        alert($.i18n.map["passwordIsNotSameJsTip"]);
        return false;
    }
    return true;
}

function loginNameExist()
{
    hideLoading();
    alert("用户名已经在站点被注册");
}

function handlePassportPasswordReg(results)
{
    isRegister = true;
    preSessionId = results.preSessionId;
    cancelLoadingBySelf();
    zalyjsLoginSuccess(registerLoginName, preSessionId, isRegister,registerCustom,  loginFailed);
}


function apiPassportPasswordLogin(callback)
{
    var action = "api.passport.passwordLogin";
    var name = registerLoginName ;
    var password = registerPassword;

    var reqData = {
        loginName:name,
        password:password,
    };
    handleClientSendRequest(action, reqData, callback);
}

function handlePassportPasswordUpdateInvationCode(results)
{
    isRegister = true;
    preSessionId = results.preSessionId;
    cancelLoadingBySelf();
    zalyjsLoginSuccess(registerLoginName, preSessionId, isRegister, registerCustom, failedCallBack);
}

///更新邀请码，并且登录site
function failedCallBack(result) {
    try{
        hideLoading();
        if(result.hasOwnProperty("errorInfo")) {
            alert(result.errorInfo);
        }else {
            if(result != undefined && result !='') {
                alert(result);
            }
        }
        $(".register_button").attr("is_type", updateInvitationCodeType);
    }catch (error){
        $(".register_button").attr("is_type", updateInvitationCodeType);
    }
}