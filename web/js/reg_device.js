function fireAlert(code,method)
{
	wd_ajax({
		type: "POST",
		cache: false,
		url: "/web/php/reg_device.php",
		data: "method=" + method + "&code=" + code,
		dataType: "xml",
		success: function(xml){
		}
		,
		error:function(xmlHttpRequest,error){
			//alert("Get_User_Info->Error: " +error);
		}
	});
}
function create_reg_file()
{
	//create a file /etc/.device_registered
	$.ajax({
		type:"PUT",
		cache:false,
		url:"/api/" + REST_VERSION + "/rest/device_registration?registered=true",
		dataType: "xml",
		success:function(xml){
			save_file();
		},
		complete: function (jqXHR, textStatus) {
		}
	});
}
function save_file()
{
	wd_ajax({
		type: "POST",
		cache: false,
		url: "/web/php/reg_device.php",
		data: "method=save",
		dataType: "xml",
		success: function(xml){
		}
		,
		error:function(xmlHttpRequest,error){
			//alert("Get_User_Info->Error: " +error);
		}
	});
}
function _REST_chk_dev_registered()
{
	var registered;
	wd_ajax({
		type: "GET",
		async: false,
		cache: false,
		url:"/api/" + REST_VERSION + "/rest/device_registration",
		dataType: "xml",
		success: function(xml){
			registered = $(xml).find("registered").text();
		}
		,
		error:function(xmlHttpRequest,error){
			registered = "false";
		}
	});
	
	return registered;
}
