var socket = io(); 
var username;

document.addEventListener('DOMContentLoaded', function() {
   document.getElementById("send").onclick=function(){messageSend()};//makes the send button able to send messages to clients
   document.getElementById("chatbox").onkeypress=function(){sendMessage();};//makes chatbox send messages by pressing enter
   document.getElementById("textColor").onchange=function(){changeColor(event);};//hepls in changing the chat colors
   document.getElementById("hide_button").onclick=function(){hideThings();};//secret function
   document.getElementById("password").onkeypress=function(){reappear();};//cancels the effects of the secret function

   //while(prompt("Password")!="aaaa"){}//

   pickUsername();
   
   //when someone sends a message to the server, the server sends it back to ALL clients
   //and in this function each client seperately handles the message.
   socket.on('messageReply',function(data){
      var nameNode = document.createElement("span");
      var textNode = document.createElement("span");
      textNode.innerHTML = data.text;
      nameNode.style.color=data.textColor;
      nameNode.innerHTML = "<b>" +data.name +" : </b>";
      document.getElementById("chat_history").appendChild(nameNode);
      document.getElementById("chat_history").appendChild(textNode);
   });

   socket.on('usernameTaken',function(){//prompts the user to choose another username,sends the new one on the server for evaluation
      username = prompt('Please chose another username, this one is taken',username);
      while(username==null)
      {
         username=prompt('Invalid input,choose your username please');
      }
      socket.emit('pickUsername',{name:username,textColor:document.getElementById("textColor").value});
   });

   socket.on('usernameGranted',function(){//grants the user his username,created that for future expandability.
      document.getElementById("chatbox").value=""; 
   });
   
   socket.on('newUser',function(data){//in case a new user has joined, we handle this annoucement
      var newNode = document.createElement("span");
      newNode.classList.add('bspan');
      newNode.classList.add('announcement');
      newNode.innerHTML = data;
      document.getElementById("chat_history").appendChild(newNode);
   });

   socket.on('colorChangeApproval',function(){//announces that user's color has changed
      var newNode = document.createElement("span");
      newNode.classList.add('bspan');
      newNode.classList.add('announcement');
      newNode.innerHTML = username +" has changed their chat color<br>";
      document.getElementById("chat_history").appendChild(newNode);
   });

});

function messageSend(){//sends message to the server in order to be transmitted to other clients, then resets the chatbox's content
   if(document.getElementById("chatbox").value!="")socket.emit('sendMessage',{name:username,text:document.getElementById("chatbox").value});
   document.getElementById("chatbox").value="";
}

function changeColor(e){//this function sends the messages that the user wants to change his color
   if(e.target.value=='rgb')//if we use RGB, we input a color value on our own.
   {
      var r=prompt('Please enter the R value of your color.Value should be [0,255]');//user is asked to input R value
      var g=prompt('Please enter the G value of your color.Value should be [0,255]');//same 
      var b=prompt('Please enter the B value of your color.Value should be [0,255]');//same
      alert('In case of an invalid color,the defaul one will be BLACK');
      if(r!=null&&g!=null&&b!=null)//if user has inputed a value on all 3 of the prompts we assign this color
      socket.emit('changeUserColor',{name:username,color:'rgb('+r+','+g+','+b+')'})
      else alert('Operation canceled, user hasn\'t entered all colors');//else we just alert him that operation's cancelled
   }
   else if(e.target.value=='name')//if the user chose this,he inputs a color name 
   {
      var temp=prompt('Please enter the color name that you want, in case it\'s invalid, default color will be BLACK');
      if(temp!=null) socket.emit('changeUserColor',{name:username,color:temp})
      else alert('Operation canceled, user hasn\'t entered a color name');
   }
   else
   {
      socket.emit('changeUserColor',{name:username,color:e.target.value});//if we have any other option,we just assign that color
   }
}

function pickUsername(){

   username=prompt('Pick your username please');
   while(username==null)
   {
      username=prompt('Invalid input,choose your username please');
   }
   socket.emit('pickUsername',{name:username,textColor:document.getElementById("textColor").value});//send to the server that we want THAT username,
   //server will respond accordingly
}

function sendMessage(){
   var key = window.event.keyCode;
   if( key == 13)
   {//in case key with ascii code 13 ( enter ) is pressed, we'll send the chatbox's content on the server,and then reset it's content
      messageSend();
      document.getElementById("chatbox").value="";
   }
}

function hideThings(){//hides chatbox and makes the password box appear
   document.getElementById("outbox").style.display="none";
   document.getElementById("password").style.display="block";
}
function reappear(){//if asd123 is typed somewhere in the password box, the content appears again
   var key = window.event.keyCode;
   if( key == 13)
   {
      var txt=document.getElementById("password").value;
      if(txt.includes("asd123"))
      {
         document.getElementById("outbox").style.display="block";
         document.getElementById("password").style.display="none";
      }
      document.getElementById("password").value="";
   }
}