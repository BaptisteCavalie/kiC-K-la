window.StudentsCollection = Backbone.Collection.extend({

  localStorage: new Backbone.LocalStorage("student-storage"), // Unique name within your app.

  model: StudentModel

});
