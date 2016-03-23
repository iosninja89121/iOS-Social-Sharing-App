Parse.Cloud.job("checkUserExistance", function(request, status) {
  // Set up to modify user data
  Parse.Cloud.useMasterKey();
  // Query for all users
  var activity = Parse.Object.extend("Activity");
  var query = new Parse.Query(activity);
  query.equalTo("type", "follow");
  query.include("fromUser");
  query.include("toUser");


  query.each(function(object) {
      // Set and save the change
      var toUser = object.get("toUser");
      var fromUser = object.get("fromUser");
      if (!toUser || !fromUser) {
      object.destroy();
}
     
  }).then(function() {
    // Set the job's success status
    status.success("Activity clean up completed successfully.");
  }, function(error) {
    // Set the job's error status
    status.error("Uh oh, something went wrong.");
  });
});