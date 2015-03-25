function matchData(obj){

	var gender = $("#gender").val();
	var age = $("#age").val();
	var pregnant = $("#pregnant").val();
	var tobacco = $("#tobacco").val();
	var sexual = $("#sexual").val();
	var risks = "",typogen="";
	if(pregnant=="yes"){
		risks+="pregnant";
	}
	if(tobacco=="yes"){
		risks+="Tobacco user";
	}
	if(sexual=="yes"){
		risks+="Sexually Active";
	}
	var obj = {
		gender : gender,
		age : age,
		risks : risks
	}
	
	if(gender == "male"){
		typogen = "men"
	}else{
		typogen = "women"
	}

	$("#busy-holder").show()
	$.post("https://epssdata.ahrq.gov/json_compact.jsp",function(jsonObj){
		$("#busy-holder").hide()
		var specific = jsonObj['specificRecommendations'];
		var general = jsonObj['generalRecommendations'];
		var specificLen = specific.length;
		var matchedResults = [];
		for(var i=0;i<specificLen;i++){
			if(specific[i]['gender'].toLowerCase()==gender || specific[i]['gender'].toLowerCase()==typogen || specific[i]['gender'].toLowerCase()=="men and women"){
				if(obj.age>=specific[i]['ageRange'][0] && obj.age<=specific[i]['ageRange'][1]){
					if(obj.risks.toLowerCase().indexOf(specific[i]['riskName'].toLowerCase())!=-1 || specific[i]['riskName'].toLowerCase()=="other" || specific[i]['riskName'].toLowerCase()=="none" || specific[i]['riskName'].toLowerCase()=="age"){
						if(specific[i]['grade'].toLowerCase()=="a" || specific[i]['grade'].toLowerCase()=="b"){
							matchedResults.push(specific[i]);
						}
					}
				}
			}
		}

		var resStr = "";
		for(var j=0;j<matchedResults.length;j++){
			resStr+="<div><h5><div class='open_box' tabindex='-1'></div>";
			resStr+=matchedResults[j].title;
			resStr+="</h5><div class='contentBlog' style='display:none'>";

			/* sub division part */

			var subStr = "";
			for(name in matchedResults[j]){
				if(name!="id" && name!="title"&& name!="grade"&& name!="gradeVer"&& name!="gender"&& name!="ageRange"&& name!="general" && name!="riskName"){
					var dispName = "";
					if(name=="text"){
						dispName="Description";
					}else if(name=="servFreq"){
						dispName="Frequency";
					}else if(name=="riskText"){
						dispName="Risk";
					}else if(name=="rationale"){
						dispName="Rationale";
					}
					subStr+="<div><h5><div class='open_box' tabindex='-1'></div>";
					subStr+=dispName;
					subStr+="</h5><div class='contentBlog' style='display:none'>";
					subStr+=matchedResults[j][name];
					subStr+="</div></div>";
				}
			}

			// sub division part ends
			resStr+=subStr;
			resStr+="</div></div>";
		}
		if(matchedResults.length==0){
			resStr="<p> No Matching Result(s) </p>";
		}
		$("#main-result").html(resStr);
		$("#results").show();
	})  
}

$(document).ready(function(){
	$("#results").on("click",".open_box",function(){
		var thisObj = $(this);
        var contentBlog = thisObj.parent().next(".contentBlog");
        if(contentBlog.is(":visible")){
          thisObj.parent().removeClass('opened');
        	contentBlog.slideUp('slow');
        }else{
          thisObj.parent().addClass('opened')
          contentBlog.slideDown('slow');
        }
	})

	$('#find').click(function(){
		matchData()
	})

	 $("#gender").change(function(){
	 	if($(this).val()=="female"){
	 		 $("#pregnant").prop('disabled',false);
	 	}else{
	 		$("#pregnant").prop('disabled',true);
	 	}
	 });
})