Parse.Cloud.beforeSave('Activity', function(request, response) {
  var currentUser = request.user;
  var objectUser = request.object.get('fromUser');
  
  if(!currentUser || !objectUser) {
    response.error('An Activity should have a valid fromUser.');
  } else if (currentUser.id === objectUser.id) {
  
  		if (request.object.get("type") === "comment" || request.object.get("type") === "comment-video"|| request.object.get("type") === "comment-post") {
  			var photo = request.object.get('photo');
  			var dummy = request.object.get('photoId');
  			var photoId = photo.id;
  			if (dummy) {
			//object has  id string
  			}
  			else {
				request.object.set('photoId', photoId);
			}
  		}
  		
    	response.success();
      	
	}
   else {
    response.error('Cannot set fromUser on Activity to a user other than the current user.');
  }
  
});
  
Parse.Cloud.afterSave('Activity', function(request) {
  // Only send push notifications for new activities
  if (request.object.existed()) {
    return;
  }
  var toUser = request.object.get('toUser');
  var fromUser = request.object.get('fromUser');
  if (!toUser && request.object.get("type") !== "mention") {
    throw "Undefined toUser. Skipping push for Activity " + request.object.get('type') + " : " + request.object.id;
    return; 
    }
  if (request.object.get("type") === "comment" || request.object.get("type") === "comment-post" || request.object.get("type") === "comment-video" ) {
  			
	var Student = Parse.Object.extend("PhotoCommenters");
  var query = new Parse.Query(Student);
  query.equalTo("User",request.object.get("fromUser"));
  query.equalTo("Photo", request.object.get("photo"));
                        
  if (toUser.id != fromUser.id) { //The photo's owner will not be in the list of commenters, reasons are trivial
     query.find({
        success: function(results){
            if (results.length > 0) {
                //nothing here, user already commented on that photo
            }
            else {
                console.log("Starting test");
                var Foob = Parse.Object.extend("PhotoCommenters");
                var foob = new Foob();
                foob.set("User", request.object.get("fromUser"));
                foob.set("Photo", request.object.get("photo"));
                foob.save(null, {
                    success:function (aFoob) {
                        console.log("Successfully saved a new commenter");
                    },
                    error:function (pointAward, error) {
                        console.log("Could not save a new commenter , damnit" + error.message);
                    }
                });
             }           
        }
    });
 }
 var secondQuery = new Parse.Query("PhotoCommenters");
 secondQuery.include("User");
 secondQuery.equalTo("Photo", request.object.get("photo"));
 secondQuery.find({
    success: function(results){
        if (results.length > 0) {
            for (var i = 0; i < results.length; i++) {
                console.log("Results from query " + results[i].get("User").id);
                var newObject = results[i];
                var newUser = newObject.get("User");
                newUser.fetch();
                var thirdQuery = new Parse.Query(Parse.Installation);
                thirdQuery.equalTo('user', newUser);
                                   
                toUser.fetch().then(function(fetched){
                    if (toUser.id != fromUser.id) {
                       
                         if (request.object.get("type") === "comment") {
                            var payload = {
                                alert: request.user.get('displayName') + ' has also commented on ' + toUser.get('displayName') + "'s photo", // Set our alert message.
                                badge: 'Increment', // Increment the target device's badge count.
                                // The following keys help Netzwierk load the correct photo in response to this push notification.
                                p: 'a', // Payload Type: Activity
                                t: 'c', // Activity Type: Comment
                                fu: request.object.get('fromUser').id, // From User
                                pid: request.object.get('photo').id // Photo Id
                            };
                        	}
                         else if (request.object.get("type") === "comment-video") {
                         var payload = {
                                alert: request.user.get('displayName') + ' has also commented on ' + toUser.get('displayName') + "'s video", // Set our alert message.
                                badge: 'Increment', // Increment the target device's badge count.
                                // The following keys help Netzwierk load the correct photo in response to this push notification.
                                p: 'a', // Payload Type: Activity
                                t: 'c', // Activity Type: Comment
                                fu: request.object.get('fromUser').id, // From User
                                pid: request.object.get('photo').id // Photo Id
                            };
                         }
                         else if (request.object.get("type") === "comment-post") {
                         var payload = {
                                alert: request.user.get('displayName') + ' has also commented on ' + toUser.get('displayName') + "'s post", // Set our alert message.
                                badge: 'Increment', // Increment the target device's badge count.
                                // The following keys help Netzwierk load the correct photo in response to this push notification.
                                p: 'a', // Payload Type: Activity
                                t: 'c', // Activity Type: Comment
                                fu: request.object.get('fromUser').id, // From User
                                pid: request.object.get('photo').id // Photo Id
                            };
                         }
                        
                    }
                    else {
                    	if (request.object.get("type") === "comment") {
                            var payload = {
                                alert: request.user.get('displayName') + ' commented on a photo you also commented on.', // Set our alert message.
                                badge: 'Increment', // Increment the target device's badge count.
                                // The following keys help Netzwierk load the correct photo in response to this push notification.
                                p: 'a', // Payload Type: Activity
                                t: 'c', // Activity Type: Comment
                                fu: request.object.get('fromUser').id, // From User
                                pid: request.object.get('photo').id // Photo Id
                            };
                        }
                        else if (request.object.get("type") === "comment-video") {
                        	var payload = {
                                alert: request.user.get('displayName') + ' commented on a video you also commented on.', // Set our alert message.
                                badge: 'Increment', // Increment the target device's badge count.
                                // The following keys help Netzwierk load the correct photo in response to this push notification.
                                p: 'a', // Payload Type: Activity
                                t: 'c', // Activity Type: Comment
                                fu: request.object.get('fromUser').id, // From User
                                pid: request.object.get('photo').id // Photo Id
                            };
                        }
                        else if (request.object.get("type") === "comment-post") {
                        	var payload = {
                                alert: request.user.get('displayName') + ' commented on a post you also commented on.', // Set our alert message.
                                badge: 'Increment', // Increment the target device's badge count.
                                // The following keys help Netzwierk load the correct photo in response to this push notification.
                                p: 'a', // Payload Type: Activity
                                t: 'c', // Activity Type: Comment
                                fu: request.object.get('fromUser').id, // From User
                                pid: request.object.get('photo').id // Photo Id
                            };
                        }
                    }
                    console.log("Push send to " + newUser.get('displayName'));                                       
                    console.log("Displayname defective? " + request.object.get('fromUser').id);
                    console.log("Displayname defective? " + toUser.get('displayName'));
                                                                                             
                    Parse.Push.send({
                        where: thirdQuery, // Set our Installation query.
                        data: payload
                    }).then(function() {
                    // Push was successful
                        console.log('Sent comment push');
                        }, function(error) {
                            throw "Push Error " + error.code + " : " + error.message;
                        });
                });
                                         
                                         
            }
                                    
        }
                                   
        else {
          
        }
                                   
    }
});
}
                        
  var query = new Parse.Query(Parse.Installation);
  
 if (request.object.get("type") === "mention") {
    var newUser = request.object.get("mentions");                 
    query.containedIn('user', newUser);
    Parse.Push.send({
        where: query, // Set our Installation query.
        data: alertPayload(request)
    }).then(function() {
        // Push was successful
        console.log('Sent push.');
        }, function(error) {
            throw "Push Error " + error.code + " : " + error.message;
        });
 } else {
    query.equalTo('user', toUser);
    Parse.Push.send({
        where: query, // Set our Installation query.
        data: alertPayload(request)
    }).then(function() {
    // Push was successful
    console.log('Sent push.');
    }, function(error) {
        throw "Push Error " + error.code + " : " + error.message;
        });
    }
  
    
});
  
var alertMessage = function(request) {
  var message = "";
  
  if (request.object.get("type") === "comment-video") {
    if (request.user.get('displayName')) {
      message = request.user.get('displayName') + ' commented on your video';
    } else {
      message = "Someone commented on your photo.";
    }
  } else if (request.object.get("type") === "like-video") {
    if (request.user.get('displayName')) {
      message = request.user.get('displayName') + ' likes your video';
    } else {
      message = 'Someone likes your photo.';
    }
  }
  else if (request.object.get("type") === "comment-post") {
    if (request.user.get('displayName')) {
      message = request.user.get('displayName') + ' commented on your post';
    } else {
      message = "Someone commented on your post.";
    }
  } 
  else if (request.object.get("type") === "like-post") {
    if (request.user.get('displayName')) {
      message = request.user.get('displayName') + ' liked your post';
    } else {
      message = "Someone liked your post.";
    }
  }
  else if (request.object.get("type") === "comment") {
    if (request.user.get('displayName')) {
      message = request.user.get('displayName') + ' commented on your photo';
    } else {
      message = "Someone commented on your photo.";
    }
  } else if (request.object.get("type") === "like") {
    if (request.user.get('displayName')) {
      message = request.user.get('displayName') + ' likes your photo';
    } else {
      message = 'Someone likes your photo.';
    }
  } else if (request.object.get("type") === "follow") {
    if (request.user.get('displayName')) {
      message = request.user.get('displayName') + ' is following you';
    } else {
      message = "You have a new follower.";
    }
  } else if (request.object.get("type") === "mention") {
      if (request.user.get('displayName')) {
          message = request.user.get('displayName') + ' mentioned you in a comment';
      } else {
          message = "You were mentioned in a comment";
      }
  }
  
  // Trim our message to 140 characters.
  if (message.length > 140) {
    message = message.substring(0, 140);
  }
  
  return message;
}
  
var alertPayload = function(request) {
  var payload = {};
  
  if (request.object.get("type") === "comment") {
    return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct photo in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'c', // Activity Type: Comment
      fu: request.object.get('fromUser').id, // From User
      pid: request.object.get('photo').id // Photo Id
    };
  } else if (request.object.get("type") === "comment-video") {
    return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct photo in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'c', // Activity Type: Comment
      fu: request.object.get('fromUser').id, // From User
      pid: request.object.get('photo').id // Photo Id
    };
  }else if (request.object.get("type") === "like-video") {
    return {
      alert: alertMessage(request), // Set our alert message.
	  badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct video in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'l', // Activity Type: Like
      fu: request.object.get('fromUser').id, // From User
    pid: request.object.get('photo').id // Photo Id
    };
  } else if (request.object.get("type") === "comment-post") {
    return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct photo in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'c', // Activity Type: Comment
      fu: request.object.get('fromUser').id, // From User
      pid: request.object.get('photo').id // Photo Id
    };
  }else if (request.object.get("type") === "like-post") {
    return {
      alert: alertMessage(request), // Set our alert message.
	  badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct video in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'l', // Activity Type: Like
      fu: request.object.get('fromUser').id, // From User
    pid: request.object.get('photo').id // Photo Id
    };
  }
   else if (request.object.get("type") === "like") {
    return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct photo in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'l', // Activity Type: Like
      fu: request.object.get('fromUser').id, // From User
    pid: request.object.get('photo').id // Photo Id
    };
  }else if (request.object.get("type") === "follow") {
    return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
      // The following keys help Anypic load the correct photo in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'f', // Activity Type: Follow
      fu: request.object.get('fromUser').id // From User
    };
  } else if (request.object.get("type") === "mention") {
      return {
      alert: alertMessage(request), // Set our alert message.
      badge: 'Increment', // Increment the target device's badge count.
          // The following keys help Anypic load the correct photo in response to this push notification.
      p: 'a', // Payload Type: Activity
      t: 'f', // Activity Type: Follow
      fu: request.object.get('fromUser').id // From User
      };
  }
}