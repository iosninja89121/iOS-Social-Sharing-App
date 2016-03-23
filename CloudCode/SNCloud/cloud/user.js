Parse.Cloud.beforeSave(Parse.User, function(request, response) {
	//Parse.Cloud.useMasterKey();  

  	if (!request.object.isNew()) {

  		console.log("User is not a new one");

  		//User is not new, so this is an update to the PFUser
  		for (var i=0; i < request.object.dirtyKeys().length; i++) {
  		console.log(request.object.dirtyKeys()[i]); //"aa", "bb"
  		var dirtyKey = request.object.dirtyKeys()[i];

			console.log("dirty key is" + dirtyKey);

    		if (dirtyKey === "verified") {

    			console.log("Verified is dirty key, going ahead");

      			var status = request.object.get('verified');
      			var lowerStatus = status.toLowerCase();
      			if (lowerStatus === "yes") {

      				console.log ('Verified has been changed to a yes, sending push');

      				var query = new Parse.Query(Parse.Installation);  
      				var user = request.object;
      				console.log ('User is ' + request.object.get('displayName'));

  					query.equalTo('user', user);
    				Parse.Push.send({
        				where: query, // Set our Installation query.
        				data: alertPayload(request)
    				}).then(function() {
    					// Push was successful
    					console.log('Sent push.');
    				}, function(error) {
        				throw "Push Error " + error.code + " : " + error.message;
        			});
      			};
      
    		}
  		}

	}	

    response.success();
});

var alertPayload = function(request) {
  var payload = {};
  
    return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct photo in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'c', // Activity Type: Comment
      fu: '0', // From User
      pid: '0' // Photo Id
    };
   
 }

 var alertMessage = function(request) {
	var message = "You have been upgraded to a verified user";
  	return message;
}