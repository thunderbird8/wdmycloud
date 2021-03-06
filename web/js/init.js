var support_flag=0;
var supportDiag;
function init_support_dialog()
{
	var _TITLE = _T('_support','title');
	$("#topDiag_title").html(_TITLE);

	adjust_dialog_size("#topDiag", 950, "");
	
  	var Create_Obj=$("#topDiag").overlay({fixed:false,oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});		
	Create_Obj.load();
	supportDiag = Create_Obj;
	$("[type='checkbox']").checkboxStyle();
	$("#support_requestSupport_chkbox").attr('checked',false);
	$("#support_requestSupport_button").addClass('gray_out');
	
	$("#topDiag.WDLabelDiag").css("top","-80px").css("left","110px");
	
	$("#support_privacyPpolicy_link").attr("href",A_POLICY_URL);
	$("#tip_improvement").attr('title',_T('_tip','improvement'));
	init_tooltip();
	getImprovement("support");
	init_switch();
	
	$("#topDiag .close").click(function(){	
		$('#topDiag .close').unbind('click');						
		Create_Obj.close();
	});
	
	$("#support_imp_switch").unbind("click");
    $("#support_imp_switch").click(function(){
		var v = getSwitch('#support_imp_switch');
		setImprovement(v);
	});	
}
var about_flag=0;
function init_about_dialog()
{
	var _TITLE = '<div class="wd_logo" style="margin-left:100px"><div class="wd_dev"></div></div>';
	$("#topDiag2_title").html(_TITLE);

	adjust_dialog_size("#topDiag2",450,470);

	$(".atitle").css('margin-left','-100px');
	$(".atitle").css('top','10px');
	
	if(!getCookie("fw_version"))
	{
		get_fw_version();
	}
	
	$("#fw_version").html( _T("_common","firmware")+" : "+ getCookie("fw_version"));
	
  	var Create_Obj=$("#topDiag2").overlay({oneInstance:false,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0});		
	Create_Obj.load();
	

	$("#topDiag2 .close").click(function(){			
		$('#topDiag2 .close').unbind('click');						
		Create_Obj.close();
	});
}

function init_wizard()
{
		var sys_time = (new Date()).getTime();
		HomeinitDiag("/web/supportDiag.html?r="+sys_time, "main_diag", function() {
			language();
			$("#support_doc_link").attr("href","http://products.wdc.com/?id=" + DEV_ID + "&type=um");
			$("#support_faq_link").attr("href","http://products.wdc.com/?id=" + DEV_ID + "&type=faq");
			$("#support_forum_link").attr("href","http://products.wdc.com/?id=" + DEV_ID + "&type=forum");
			$("#support_contacts_link").attr("href","http://products.wdc.com/?id=" + DEV_ID + "&type=contact");
		});
		HomeinitDiag("/web/wizardDiag.html?r="+sys_time, "main_diag", function() {
			language();
		});

    $("#home_support_link").click(function(){
    	init_support_dialog();
	});

    $("#home_about_link").click(function(){
    	init_about_dialog();
	});

    $("#home_gettingStarted_link").click(function(){
    	run_wizard('toolbar');
	});
	
	$("#home_help_link").click(function(){
		google_analytics_log('Help', 'pv-help');
		
		adjust_dialog_size("#HelpDiag", 800, 604);
		$("#HelpDiag").overlay({fixed:false, left:110,expose: '#000',api:true,closeOnClick:false,closeOnEsc:false,speed:0}).load();
		//$("#HelpDiag .WDLabelBodyDialogue").width("100%");
		$("#HelpDiag").css("top", "20px");

//		$("#HelpDiag .OK").click(function(){
//			$('#HelpDiag .OK').unbind('click');
//			$("#HelpDiag").overlay().close();
//		});

		var help_url = String.format("/web/WebHelp/{0}/{1}/index.htm", WEBHELP_UPDATE, lanagage_list[parseInt(MULTI_LANGUAGE, 10)]);
		$("#help_iframe").attr('src', help_url);
	});
}
function display_request_button(obj)
{
	if($(obj).prop("checked"))
		$("#support_requestSupport_button").removeClass('gray_out');
	else
		$("#support_requestSupport_button").addClass('gray_out');
}
function send_request_support()
{
	if($("#support_requestSupport_button").hasClass('gray_out')) return;
	
	var lang_array = {	"ENG":"0",
						"FRA":"1",
						"ITA":"2",
						"DEU":"3",
						"ESN":"4",
						"CHS":"5",
						"CHT":"6",
						"KOR":"7",
						"JPN":"8",
						"RUS":"9",
						"POR":"10",
						"CZE":"11",
						"DUT":"12",
						"HUN":"13",
						"NOR":"14",
						"PLK":"15",
						"SWE":"16",
						"TUR":"17"
					};
	var lang = get_language();
	var L_array = $.map(lang_array, function(element,index) {return index});
	var gLanguage3Letter=L_array[lang];
	//var gLanguage3Letter = lang_array[lang].toLowerCase();
	var gSerialNumber = get_dev_info('serial_number');
	var gModelNumber = MODEL_NAME;
	var nastype = MODEL_NAME;
	var gFirmwareVersion = $.cookie('fw_version');
	/*
	console.log("gLanguage3Letter=%s %s",gLanguage3Letter,lang)
	console.log("gSerialNumber=%s",gSerialNumber)
	console.log("gModelNumber=%s",gModelNumber)
	console.log("nastype=%s",nastype)
	console.log("gFirmwareVersion=%s",gFirmwareVersion)
	console.log("logfilename=%s",logfilename)
	*/
	jLoading(_T('_common','set'), 'loading' ,'s',""); //msg,title,size,callback
	wd_ajax({
		type: "POST",
		cache: false,
		url: "/web/php/sendLogToSupport.php",
		data:"cmd=send_log&dev=" + MODEL_NAME,	
		dataType: "xml",
		success: function(xml){
			var status = $(xml).find('status').text();
			var logfilename = $(xml).find('logfile').text();
			var code = $(xml).find('code').text();
			
			jLoadingClose();
			supportDiag.close();
			
			if(status=='ok' && code=='0')
			{
    $("#quick_support_form").find("#devlang").val(gLanguage3Letter);
    $("#quick_support_form").find("#devsn").val(gSerialNumber);
    $("#quick_support_form").find("#devmodel").val(gModelNumber);
    $("#quick_support_form").find("#devnastype").val(nastype);
    $("#quick_support_form").find("#devfw").val(gFirmwareVersion);
    $("#quick_support_form").find("#devhash").val(logfilename);
				$("#quick_support_form").submit();
			}
			else
			{
				jAlert(_T('_support', 'msg1'), "warning");
			}
		},
		error:function(xmlHttpRequest,error){   
        		//alert("Get_User_Info->Error: " +error);   
		}
	});
}
function get_dev_info(name)
{
	var str="";
	wd_ajax({
		type: "POST",
		async: false,
		cache: false,
		url: "/cgi-bin/system_mgr.cgi",
		data:"cmd=cgi_get_device_info",	
		dataType: "xml",
		success: function(xml){		
			$(xml).find('device_info').each(function(){
				str = $(this).find(name).text();
			}); 
		}
		,
		error:function(xmlHttpRequest,error){   
			//alert("Get_User_Info->Error: " +error);   
		}  
	});
	
	return str;
}
function ready_init()
{
	document.title = get_dev_info('name') + DEV_NAME;
	/*$('.b1').after('<div class="logout"><span>'+ _T('_menu','logout') + '</span></div>')*/
	$(".logout").click(function(){
		google_analytics_log('Manual_Logout_Times',	'');
		do_logout();
	});
}
var alert_msg = new Array();
var alert_desc = new Array();
function get_alert_list()
{
	alert_msg = new Array();
	alert_desc = new Array();
	var my_html_options = "";
	$("#obj_alert_content").empty();
	$.ajax({
		type:"POST",
		url:"/cgi-bin/system_mgr.cgi",
		data:{cmd:"cgi_get_alert"},
		cache:false,
		async:true,
		success:function(xml){
			var num=-1;	
			var first_level = 2;
			$(xml).find('alerts').each(function(index){
				num = index;
				if (index == 0)
				{
					$("#obj_alert_content").empty();
					my_html_options = "";				
				}
				else  if (index >= 3 )
					return false;
			
				var code = $(this).find('code').text();		
				var seq_num = $(this).find('seq_num').text();		
				var level = $(this).find('level').text();		
				var msg = $(this).find('msg').text();		
				var desc = $(this).find('desc').text();		
				var time = $(this).find('time').text();										
				my_html_options+='<li>'
				my_html_options+='<div class="a_main">'
				if (level == "0")
					my_html_options+='<div class="a_icon_c"></div>'
				else if (level == "1")
					my_html_options+='<div class="a_icon_w"></div>'		
				else if (level == "2")
					my_html_options+='<div class="a_icon_i"></div>'				

				if (index == 0)
				{
					first_level = level;
				}
				my_html_options+='<div class="a_title">';
				my_html_options+=msg;
				my_html_options+='</div>';
				my_html_options+='<div class="a_time">';
				my_html_options+=multi_lang_format_time(time);
				my_html_options+='</div>';
				my_html_options+='<div class="a_del" id="home_alertDel'+(parseInt(index)+1)+'_link" onclick=\'del_alert("'+seq_num+'",0);\'>';
				my_html_options+='</div>';
								
				alert_msg[num] = msg;
				alert_desc[num] = alert_link(desc,code);

				my_html_options+="<div class='a_detail' id='home_alertDetail"+(parseInt(index)+1)+"_link' onclick=\"open_alert('','','"+time+"','"+code+"','"+level+"','"+num+"');\">";
				my_html_options+='</div>';	
				my_html_options+='</div>';
				my_html_options+='</li>';
				num=index;
			});

			if (num ==  -1)
			{
				show('no_alert');
				hide('yes_alert');						
				$("#obj_alert_content").empty();
				my_html_options="";	
				$("#ul_alert").height("120px");
				my_html_options+='<li><div style="padding:5px">No Alert</div></li>';
			}
			else
			{
				hide('no_alert');
				show('yes_alert');
				my_html_options+="<span class=a_info>"+_T('_notification','info')+"</span>";
				my_html_options+="<span class=a_warning>"+_T('_notification','warning')+"</span>";
				my_html_options+="<span class=a_critical>"+_T('_notification','critical')+"</span>";						
				my_html_options+="<div><button id='home_alertView_button' style='margin-right:10px' class=\"ButtonRightAlert close\" onclick=\"open_alert_all();\">"+_T('_notification','view')+"</button></div>";
			}
			$("#obj_alert_content").html(my_html_options);

			if (num != -1)
			{
				var h=100;
				$('#obj_alert_content li').each(function(index){
					h = h + $(this).height()+25;
				});
				$("#ul_alert").height(h+"px");
			}
			if (first_level == 1)
			{
				$("#id_alertIcon").removeClass().addClass("alertIcon_w");
			}
			else if (first_level == 0)
			{
				$("#id_alertIcon").removeClass().addClass("alertIcon_c");
			}	
			else
			{
				$("#id_alertIcon").removeClass().addClass("alertIcon");							
			}
		}
	});
}
function del_alert(v,flag)
{	
	_SELECT_SHOW = 1;
	
	wd_ajax({
			type:"POST",
			url:"/cgi-bin/system_mgr.cgi",
			data:{cmd:"cgi_del_alert",seq_num:v},
			cache:false,
			async:true,
			success:function(){		
				_SELECT_SHOW = 0;			
					
					
					if (flag == 1) //get all
					{
						reload_alert_all();
					}
					else
					get_alert_list();
				}			
		});
}
function remove_all()
{
	_SELECT_SHOW = 1;
	wd_ajax({
			type:"POST",
			url:"/cgi-bin/system_mgr.cgi",
			data:{cmd:"cgi_del_alert_all"},
			cache:false,
			async:true,
			success:function(){		
				_SELECT_SHOW = 0;			
					get_alert_list();
				}			
		});
}

function open_alert(msg,desc,time,code,level,num)
{
	
	//$("#id_alert_msg").text(msg)
	//$("#id_alert_desc").html(desc)	
	$("#id_alert_msg").text(alert_msg[num])
	if (code == "2214")
	$("#id_alert_desc").html(alert_desc[num])
	else	
		$("#id_alert_desc").text(alert_desc[num])
	$("#id_alert_time").text(multi_lang_format_time(time))
	$("#id_alert_error_code").text(code)

	$("#id_alert_icon").removeClass("a_icon_w").removeClass("a_icon_i").removeClass("a_icon_c")
	
	if (level == 0)
			$("#id_alert_icon").addClass("a_icon_c");
	else if (level == 1)
			$("#id_alert_icon").addClass("a_icon_w");
	else if (level == 2)
			$("#id_alert_icon").addClass("a_icon_i");
		
	if (code=="2046") //Register Product
	{
		$("#regDeviceDiag #gettingstarted_rFirstName_text").val("");
		$("#regDeviceDiag #gettingstarted_rLastName_text").val("");
		$("#regDeviceDiag #gettingstarted_rMail_text").val("");
								
		$("#regDeviceDiag #gettingstarted_rFirstName_text").attr("placeholder",_T('getting_start','first_name')+"*");
		$("#regDeviceDiag #gettingstarted_rLastName_text").attr("placeholder",_T('getting_start','last_name')+"*");
		$("#regDeviceDiag #gettingstarted_rMail_text").attr("placeholder",_T('getting_start','email')+"*");
		$("#regDeviceDiag  #gettingstarted_register_status").empty();
		getAccountXml(function(){
			wd_ajax({
				type: "POST",
				cache: false,
				url: "/xml/account.xml",
				dataType: "xml",
				success: function(xml){
					$(xml).find('users > item').each(function(index){
						var uid = $(this).find('uid').text();
						if(uid==500)
						{
							var fname = $(this).find('first_name').text();
							var lname = $(this).find('last_name').text();
							var email = $(this).find('email').text();
							$("#regDeviceDiag #gettingstarted_rFirstName_text").val(fname);
							$("#regDeviceDiag #gettingstarted_rLastName_text").val(lname);
							$("#regDeviceDiag #gettingstarted_rMail_text").val(email);
							_Regist_Info.account_name = $(this).find('name').text();
//							_Regist_Info.first_name = fname;
//							_Regist_Info.last_name = lname;
//							_Regist_Info.email = email;
	
							$("input:text").inputReset();
							$(":input[placeholder]").placeholder();
							return false;
						}
					});
				},
				error:function(xmlHttpRequest,error){
					//alert("Error: " +error);
				}
			});
		});
		
		var obj=$("#regDeviceDiag").overlay({expose: '#000',api:true,closeOnClick:false,closeOnEsc:false});		
		obj.load();
		adjust_dialog_size("#regDeviceDiag",740,"");
		$("#regDeviceDiag").center();
	}
	else
	{
		var obj=$("#alertDiag").overlay({expose: '#000',api:true,closeOnClick:false,closeOnEsc:false});		
		obj.load();
		adjust_dialog_size("#alertDiag",550,380);
		_DIALOG = obj;
		$("#alertDiag .close").click(function(){
			$('#alertDiag .close').unbind('click');
				obj.close();
		});
	}
}

function open_alert_all()
{	
	var my_html_options = "";
	$("#id_alert_all").empty();	

	wd_ajax({
			type:"POST",
			url:"/cgi-bin/system_mgr.cgi",
			data:{cmd:"cgi_get_alert"},
			cache:false,
			async:true,
			success:function(xml){
				$(xml).find('alerts').each(function(index){
					var code = $(this).find('code').text();
					var seq_num = $(this).find('seq_num').text();
					var level = $(this).find('level').text();	
					var msg = $(this).find('msg').text();	
					var desc = $(this).find('desc').text();
					var time = $(this).find('time').text();
					my_html_options +="<div class='alert_tb' style='margin-bottom:2px;'><table width='520' id='id_alert_all_tb'>";	

					var str = "";
					$("#id_alert_all_icon").removeClass("a_icon_w").removeClass("a_icon_i").removeClass("a_icon_c");

					if (level == 0)
						str = "a_icon_c";
					else if (level == 1)
						str = "a_icon_w";
					else if (level == 2)
					{
						str = "a_icon_i";
					}

					my_html_options +="<tr><td width='10px'></td><td colspan=3 height=30><div id='id_alert_all_icon' class='"+str+"'>"+msg+"</div></td></tr>";
					my_html_options +="<tr><td width='10px'></td><td colspan=3 height=30>"+alert_link(desc,code)+"</td></tr>";
					my_html_options +="<tr><td width='10px'></td><td height=30 width='400'>"+multi_lang_format_time(time)+"</td><td width=150>"+_T('_common','code')+":"+code+"</td><td><span class='del' id='home_alertDel"+(parseInt(index)+1)+"_link' onclick='del_alert(\""+seq_num+"\",1)'></td></tr>";									
					my_html_options +="</table></div>";
				});

				$("#id_alert_all").html(my_html_options);
				adjust_dialog_size("#alertAllDiag", 620, 420);
				var obj=$("#alertAllDiag").overlay({expose: '#000',api:true,closeOnClick:false,closeOnEsc:false});		
				obj.load();
				_DIALOG = obj;

				draw_bar();
				setTimeout(draw_bar,1000);
				$("#alert_reg_div_link").unbind("click");
				$("#alert_reg_div_link").click(function(){
					open_alert("","","",2046,"","");
				});
			}
	});	
	
}

function getAccountXml(callback)
{
	wd_ajax({
		type: "GET",
		cache: false,
		url: "/web/php/users.php",
		data:"cmd=getAccountXml",
		dataType: "xml",
		success: function(xml){
			if(callback) callback();
		}
		,
		error:function(xmlHttpRequest,error){   
			//alert("Get_User_Info->Error: " +error);   
		} 
	});
}
function draw_bar()
{
		$(".scrollbar_alert").jScrollPane();
}

function reload_alert_all()
{	
	var my_html_options = "";
	$("#id_alert_all").empty();	
	
	wd_ajax({
		type:"POST",
		url:"/cgi-bin/system_mgr.cgi",
		data:{cmd:"cgi_get_alert"},
		cache:false,
		async:true,
		success:function(xml){
			$(xml).find('alerts').each(function(index){
					var code = $(this).find('code').text();		
					var seq_num = $(this).find('seq_num').text();		
					var level = $(this).find('level').text();		
					var msg = $(this).find('msg').text();		
					var desc = $(this).find('desc').text();		
					var time = $(this).find('time').text();		
					my_html_options +="<div class='alert_tb' style='margin-bottom:2px;'><table width='520' id='id_alert_all_tb'>"		
					
					var str = ""	
					$("#id_alert_all_icon").removeClass("a_icon_w").removeClass("a_icon_i").removeClass("a_icon_c")
				
					if (level == 0)
								str = "a_icon_c";
					else if (level == 1)
								str = "a_icon_w";
					else if (level == 2)
					{	
						
							str = "a_icon_i";
					}		
							
					
					my_html_options +="<tr><td width='10px'></td><td colspan=3 height=30><div id='id_alert_all_icon' class='"+str+"'>"+msg+"</div></td></tr>";
					my_html_options +="<tr><td width='10px'></td><td colspan=3 height=30>"+alert_link(desc,code)+"</td></tr>";
					my_html_options +="<tr><td width='10px'></td><td height=30 width='400'>"+multi_lang_format_time(time)+"</td><td width=150>"+_T('_common','code')+":"+code+"</td><td><span class='del' onclick='del_alert(\""+seq_num+"\",1)'></td></tr>";									
					my_html_options +="</table></div>";
			});
			$("#id_alert_all").append(my_html_options);	
			draw_bar();
			setTimeout(draw_bar,1000);
		}
	});
	$("#alertAllDiag .close").click(function(){
		$('#alertAllDiag .close').unbind('click');
		_DIALOG.close();
		_DIALOG = "";
	})
}


function alert_link(desc,code)
{
	if (code=="2214" && desc.indexOf(">") != -1) //Drive Inserted
	{
		desc = desc.replace(">", "><span style='TEXT-DECORATION:UNDERLINE;cursor:pointer;' onclick='alert_link_menu();'>");
		desc = desc+"</span>";
	}
	else if(code=="2046") //Register Product
	{
		desc = desc + " " + _T('_notification','register_dev');
	}
	return desc;
}
function alert_link_menu(){		
	go_page('/web/storage/storage.html', 'nav_storage');
	
	if ($("#alertDiag").css("display") == "block")
		$("#alertDiag").overlay().close();		
	
	if ($("#alertAllDiag").css("display") == "block")
		$("#alertAllDiag").overlay().close();		
		
				
	
}

function setImprovement(enable)
{
	wd_ajax({
		type: "POST",
		cache: false,
		url: "/web/php/improvement.php",
		data:"cmd=setAnalytics&enable=" + enable,	
		dataType: "xml",
		success: function(xml){		

		}
		,
		error:function(xmlHttpRequest,error){   
			//alert("Get_User_Info->Error: " +error);   
		}  
	});
}
function getImprovement(entry)
{
	wd_ajax({
		type: "POST",
		cache: false,
		url: "/web/php/improvement.php",
		data:"cmd=getAnalytics",	
		dataType: "xml",
		success: function(xml){
				var enable = $(xml).find('enable').text();					
				if(enable!="1") enable="0";
				//if(_Regist_Info.eula==2) enable="1"; //sky-4715 fish20151001 mark
				if(entry=="eula")
				{
					setSwitch('#gettingstarted_imp_switch',1); //sky-5483
				}
				else if(entry=="toolbar")
				{
					setSwitch('#gettingstarted_imp_switch',parseInt(enable,10));
				}
				else
				{
					setSwitch('#support_imp_switch',parseInt(enable,10));
				}
		}
		,
		error:function(xmlHttpRequest,error){   
			//alert("Get_User_Info->Error: " +error);   
		}  
	});
}