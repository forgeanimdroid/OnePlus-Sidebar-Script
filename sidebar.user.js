// ==UserScript==
// @name         Quick Links for OnePlus Forum Users
// @namespace    *.oneplus.net*
// @version      0.1
// @description  enter something useful
// @author       Mikasa Ackerman aka Kallen & Kevin Pei
// @match        *.oneplus.net*
// @include        *.oneplus.net*
// @grant        none
// ==/UserScript==

//ADD JQUERY SCRIPT ADAPTED FROM https://gist.github.com/eristoddle/4440713

function addJQuery(callback) {
	var script = document.createElement("script");
	script.textContent = "(" + callback.toString() + ")();";
	document.body.appendChild(script);
}
function main(){
	function closeThread(){
		function getWarningMsg(option, name, title){
			if(option == 1){
				return '<p>Hi there @'+name+'!</p><br/><p>It has come to my attention that you have created a thread to ask for invites, however that is not allowed.</p><br/><p>The best way to receive an invite is to hang around the forums, join in on the community discussion and create quality replies and threads.</p><br/><p>If you have any further questions, please read the following thread https://forums.oneplus.net/threads/2-rules-revisited-and-restated.78159/, or feel free to message me via the private message feature.</p><br/><p>Thanks for your understanding!</p><br/><p>Thread closed.</p>';
			}
			if(option == 2){
				var link = prompt("Duplicate link for "+title+"? (enter 0 to skip this)");
				return '<p>Hi there @'+name+'!</p><br/><p>It appears that this has already been discussed '+(link ? ('at '+link+'.</p>'): 'before.')+'<p>Please search in the future prior to creating a thread, so we don\'t encounter any duplicates :).</p><br/><p>If you have any further questions, feel free to message me via the private message feature.</p><br/><p>Thanks for your understanding!</p><br/><p>Thread closed.</p>';
			}
			if(option == 3){
				return '<p>Hi there @'+name+'!</p><br/><p>It has come to my attention that you have linked to a scalper site, however that is not allowed.</p><br/><p>OnePlus is the one and only official retailer of the OnePlus One at the moment, and buying from other sources puts people at risk of scamming and other dangers.</p><br/><p>If you have any further questions, please read the following thread https://forums.oneplus.net/threads/5-reasons-to-not-buy-the-oneplus-one-from-scalpers.35689/, or feel free to message me via the private message feature.</p><br/><p>Thanks for your understanding!</p>';
			}
			if(option == 4){
				return '<p>Congrats to the winner(s)!</p><br/><p>Thank you @'+name+' for sharing with the OnePlus community :)</p><br/>Invites given, thread closed.</p>';
			}
		}
		function closePost(url, message){
			$.get(url, function (data) {
			  var token = data.match(/_csrfToken: \"(.*)\"/)[1];
			  var dataObject = $(data);
			  var name = dataObject.find('.message:first').attr('data-author');
			  var msg = getWarningMsg(message, name, dataObject.find('.titleBar:first h1').text());
			  $.post(url+'/add-reply', {
				message_html: msg,
				_xfRelativeResolver:url,
				last_date: Date.now(),
				last_known_date: Date.now(),
				_xfToken:token,
				_xfRequestUri:url.replace("https://forums.oneplus.net", ""),
				_xfNoRedirect:1,
				_xfResponseType:"json"
			  }, function(data){
				if(data.error){
					alert(data.error[0]);
					return 0;
				}
				 $.post(url+'/quick-update', {
					'set[discussion_open]':	1,
					'set[sticky]':1,
					_xfToken:token,
					_xfRequestUri:url.replace("https://forums.oneplus.net", ""),
					_xfNoRedirect:1,
					_xfResponseType:'json'
				  }, function(data){});
					location.reload(1);
				});
			  });
			 
		}
		var links = [location.href.replace(/page-\d+/, '').split("#")[0]];
		window.queue = [];
		for(var i = 0; i < links.length; i++){
			var message = 0;
			while(message < 1 || message > 4){
				message = Number(prompt("Warning type for \""+(links[i].replace('https://forums.oneplus.net/threads/','').replace('/','').replace('-',' '))+"\": \n1. Begging\n2. Duplicate\n3. Scalpers\n4. Contest over"));
				if(!message){
					return; 
				}
			}
			window.queue.push([links[i], message]);
		}
		var thisArgs = window.queue.shift();
		closePost(thisArgs[0], thisArgs[1]);
	}
	function sidebar(title){
		this.wrapper = $('<div class="section widget-group-no-name widget-container"></div>');
		this.wrapper.append('<div class="secondaryContent widget" id="widget-12"><h3>'+title+'</h3><ul class="custom-inner"></ul><div class="clearfix" style="clear:left"></div></div>');
		this.content = this.wrapper.find('.custom-inner');
		this.add = function(elem){
			this.content.append(elem.wrap('li'));
		}
		$('.sidebar .section:first').after(this.wrapper);
	}
	var moderatorTools = new sidebar("Moderator Tools");
	var closeThreadLink = $('<a href="javascript:void(0);">Close Current Thread</a>');
	closeThreadLink.click(function(){
		closeThread();
	});
	moderatorTools.add(closeThreadLink);
}
addJQuery(main);